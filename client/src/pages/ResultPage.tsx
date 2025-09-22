import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import axios from 'axios'
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts'
import { 
  Trophy, 
  Target, 
  TrendingUp, 
  Award, 
  Download, 
  Share2,
  RefreshCw,
  Home,
  CheckCircle
} from 'lucide-react'
import { TestResult } from '../types'

const ResultPage = () => {
  const { id } = useParams()
  const [result, setResult] = useState<TestResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (id) {
      fetchResult()
    }
  }, [id])

  const fetchResult = async () => {
    try {
      const response = await axios.get(`/api/test/results/${id}`)
      setResult(response.data)
    } catch (err) {
      setError('加载结果失败')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getLevelColor = (level: string) => {
    const colors: { [key: string]: string } = {
      '卓越': 'from-green-400 to-emerald-600',
      '良好': 'from-blue-400 to-blue-600',
      '中等': 'from-yellow-400 to-amber-600',
      '待提升': 'from-orange-400 to-orange-600',
      '需要关注': 'from-red-400 to-red-600'
    }
    return colors[level] || 'from-gray-400 to-gray-600'
  }

  const getLevelIcon = (level: string) => {
    if (level === '卓越') return <Trophy className="w-12 h-12 text-white" />
    if (level === '良好') return <Award className="w-12 h-12 text-white" />
    return <Target className="w-12 h-12 text-white" />
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载结果中...</p>
        </div>
      </div>
    )
  }

  if (error || !result) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <p className="text-red-600">{error || '结果未找到'}</p>
          <Link to="/test" className="mt-4 inline-block btn-primary">
            重新测试
          </Link>
        </div>
      </div>
    )
  }

  // 准备图表数据
  const radarData = result.dimensions.map(dim => ({
    dimension: dim.category,
    score: dim.percentage
  }))

  const barData = result.dimensions.map(dim => ({
    category: dim.category,
    percentage: dim.percentage,
    score: dim.score,
    maxScore: dim.maxScore
  }))

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="text-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.5 }}
              className={`inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r ${getLevelColor(result.level)} mb-4`}
            >
              {getLevelIcon(result.level)}
            </motion.div>
            <h1 className="text-4xl font-bold mb-2">
              <span className="gradient-text">{result.userName}的测试结果</span>
            </h1>
            <p className="text-gray-500">{new Date(result.created_at || result.timestamp).toLocaleString('zh-CN')}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-6"
            >
              <div className="text-3xl font-bold text-primary-700 mb-2">
                {result.totalPercentage}%
              </div>
              <div className="text-sm text-primary-600">总体得分</div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className={`bg-gradient-to-br ${getLevelColor(result.level)} rounded-xl p-6 text-white`}
            >
              <div className="text-3xl font-bold mb-2">{result.level}</div>
              <div className="text-sm">情商等级</div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-secondary-50 to-secondary-100 rounded-xl p-6"
            >
              <div className="text-3xl font-bold text-secondary-700 mb-2">
                {result.dimensions.length}
              </div>
              <div className="text-sm text-secondary-600">评估维度</div>
            </motion.div>
          </div>
        </div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-8"
        >
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <TrendingUp className="w-6 h-6 mr-2 text-primary-600" />
            综合评价
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            {result.description}
          </p>
        </motion.div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Radar Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <h3 className="text-xl font-bold mb-4">维度雷达图</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid strokeDasharray="3 3" />
                <PolarAngleAxis dataKey="dimension" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar
                  name="得分"
                  dataKey="score"
                  stroke="#0ea5e9"
                  fill="#0ea5e9"
                  fillOpacity={0.6}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Bar Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <h3 className="text-xl font-bold mb-4">维度得分详情</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" angle={-45} textAnchor="end" height={80} />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="percentage" fill="#0ea5e9" name="得分百分比" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Dimension Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-8"
        >
          <h3 className="text-2xl font-bold mb-6">维度详情</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {result.dimensions.map((dim, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-gray-700">{dim.category}</span>
                  <span className="text-primary-600 font-bold">{dim.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${dim.percentage}%` }}
                    transition={{ duration: 0.8, delay: 0.2 + 0.1 * index }}
                  />
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  得分: {dim.score} / {dim.maxScore}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Suggestions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl shadow-xl p-8 mb-8"
        >
          <h3 className="text-2xl font-bold mb-6 flex items-center">
            <Target className="w-6 h-6 mr-2 text-primary-600" />
            提升建议
          </h3>
          <ul className="space-y-3">
            {result.suggestions.map((suggestion, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + 0.1 * index }}
                className="flex items-start"
              >
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                <span className="text-gray-700">{suggestion}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/test">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary flex items-center"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              重新测试
            </motion.button>
          </Link>
          
          <Link to="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-secondary flex items-center"
            >
              <Home className="w-5 h-5 mr-2" />
              返回首页
            </motion.button>
          </Link>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.print()}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transform transition-all duration-200 hover:-translate-y-0.5 flex items-center"
          >
            <Download className="w-5 h-5 mr-2" />
            打印结果
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              navigator.clipboard.writeText(window.location.href)
              alert('链接已复制到剪贴板')
            }}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transform transition-all duration-200 hover:-translate-y-0.5 flex items-center"
          >
            <Share2 className="w-5 h-5 mr-2" />
            分享结果
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}

export default ResultPage
