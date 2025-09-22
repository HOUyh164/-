import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import { ChevronLeft, ChevronRight, Send, User, AlertCircle } from 'lucide-react'
import { Question, Answer } from '../types'

const TestPage = () => {
  const navigate = useNavigate()
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [userName, setUserName] = useState('')
  const [showNameInput, setShowNameInput] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchQuestions()
  }, [])

  const fetchQuestions = async () => {
    try {
      const response = await axios.get('/api/questions')
      setQuestions(response.data)
    } catch (err) {
      setError('加载题目失败，请刷新重试')
      console.error(err)
    }
  }

  const handleStartTest = () => {
    if (questions.length > 0) {
      setShowNameInput(false)
    }
  }

  const handleAnswer = (answerIndex: number) => {
    const currentQuestion = questions[currentQuestionIndex]
    const newAnswer: Answer = {
      questionId: currentQuestion.id,
      answerIndex
    }

    // 更新或添加答案
    const existingAnswerIndex = answers.findIndex(
      a => a.questionId === currentQuestion.id
    )
    if (existingAnswerIndex >= 0) {
      const updatedAnswers = [...answers]
      updatedAnswers[existingAnswerIndex] = newAnswer
      setAnswers(updatedAnswers)
    } else {
      setAnswers([...answers, newAnswer])
    }

    // 自动进入下一题
    if (currentQuestionIndex < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
      }, 300)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handleSubmit = async () => {
    if (answers.length < questions.length) {
      setError('请回答所有题目后再提交')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await axios.post('/api/test/submit', {
        userName: userName || '匿名用户',
        answers
      })
      
      navigate(`/result/${response.data.id}`)
    } catch (err) {
      setError('提交失败，请重试')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getCurrentAnswer = () => {
    const currentQuestion = questions[currentQuestionIndex]
    const answer = answers.find(a => a.questionId === currentQuestion?.id)
    return answer?.answerIndex
  }

  const progress = questions.length > 0 
    ? ((answers.length / questions.length) * 100).toFixed(0)
    : 0

  if (showNameInput) {
    return (
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h1 className="text-3xl font-bold text-center mb-6">
              <span className="gradient-text">开始情商测试</span>
            </h1>
            <p className="text-gray-600 text-center mb-8">
              请输入您的名字（可选），然后开始测试
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="inline w-4 h-4 mr-1" />
                  您的名字
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="请输入您的名字（可选）"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  {error}
                </div>
              )}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleStartTest}
                disabled={questions.length === 0}
                className="w-full btn-primary"
              >
                {questions.length === 0 ? '加载中...' : '开始测试'}
              </motion.button>
            </div>
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>测试说明：</strong>
              </p>
              <ul className="text-sm text-gray-600 mt-2 space-y-1">
                <li>• 共 {questions.length} 道题目</li>
                <li>• 预计用时 5-10 分钟</li>
                <li>• 请根据真实感受作答</li>
                <li>• 答案没有对错之分</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载题目中...</p>
        </div>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const currentAnswer = getCurrentAnswer()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Progress Bar */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              进度：{currentQuestionIndex + 1} / {questions.length}
            </span>
            <span className="text-sm font-medium text-primary-600">
              {progress}% 完成
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <div className="mb-6">
              <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-4">
                {currentQuestion.category}
              </span>
              <h2 className="text-2xl font-semibold text-gray-800">
                {currentQuestion.question}
              </h2>
            </div>

            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handleAnswer(index)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                    currentAnswer === index
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-primary-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start">
                    <div className={`w-6 h-6 rounded-full border-2 mr-3 mt-0.5 flex items-center justify-center ${
                      currentAnswer === index
                        ? 'border-primary-500 bg-primary-500'
                        : 'border-gray-400'
                    }`}>
                      {currentAnswer === index && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                    <span className="flex-1 text-gray-700">{option}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all ${
              currentQuestionIndex === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md'
            }`}
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            上一题
          </motion.button>

          {currentQuestionIndex === questions.length - 1 ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSubmit}
              disabled={loading || answers.length < questions.length}
              className="btn-primary flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  提交中...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-1" />
                  提交测试
                </>
              )}
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNext}
              className="flex items-center px-4 py-2 bg-white text-gray-700 rounded-lg font-medium hover:bg-gray-50 shadow-md"
            >
              下一题
              <ChevronRight className="w-5 h-5 ml-1" />
            </motion.button>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 bg-red-50 text-red-600 p-4 rounded-lg flex items-center"
          >
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default TestPage
