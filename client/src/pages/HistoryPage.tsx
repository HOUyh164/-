import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import axios from 'axios'
import { Clock, User, Trophy, TrendingUp, Eye, Calendar } from 'lucide-react'

interface HistoryResult {
  id: number
  user_name: string
  score: number
  level: string
  dimensions: any[]
  created_at: string
}

const HistoryPage = () => {
  const [results, setResults] = useState<HistoryResult[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      const response = await axios.get('/api/test/results')
      setResults(response.data)
    } catch (err) {
      setError('加载历史记录失败')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getLevelColor = (level: string) => {
    const colors: { [key: string]: string } = {
      '卓越': 'bg-green-100 text-green-800',
      '良好': 'bg-blue-100 text-blue-800',
      '中等': 'bg-yellow-100 text-yellow-800',
      '待提升': 'bg-orange-100 text-orange-800',
      '需要关注': 'bg-red-100 text-red-800'
    }
    return colors[level] || 'bg-gray-100 text-gray-800'
  }

  const calculatePercentage = (dimensions: any[]) => {
    if (!dimensions || dimensions.length === 0) return 0
    const total = dimensions.reduce((sum, dim) => sum + dim.percentage, 0)
    return Math.round(total / dimensions.length)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载历史记录中...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={fetchHistory}
            className="mt-4 btn-primary"
          >
            重新加载
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">
            <span className="gradient-text">测试历史记录</span>
          </h1>
          <p className="text-gray-600">
            查看所有的测试记录和结果详情
          </p>
        </div>

        {/* Statistics */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">总测试数</p>
                <p className="text-2xl font-bold text-gray-800">{results.length}</p>
              </div>
              <Clock className="w-8 h-8 text-primary-600" />
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">最高等级</p>
                <p className="text-2xl font-bold text-gray-800">
                  {results.length > 0 ? results.reduce((best, r) => {
                    const levels = ['卓越', '良好', '中等', '待提升', '需要关注']
                    const currentIndex = levels.indexOf(r.level)
                    const bestIndex = levels.indexOf(best)
                    return currentIndex < bestIndex ? r.level : best
                  }, '需要关注') : '-'}
                </p>
              </div>
              <Trophy className="w-8 h-8 text-yellow-500" />
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">平均得分</p>
                <p className="text-2xl font-bold text-gray-800">
                  {results.length > 0 
                    ? Math.round(results.reduce((sum, r) => sum + calculatePercentage(r.dimensions), 0) / results.length) + '%'
                    : '-'}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">参与者数</p>
                <p className="text-2xl font-bold text-gray-800">
                  {new Set(results.map(r => r.user_name)).size}
                </p>
              </div>
              <User className="w-8 h-8 text-purple-500" />
            </div>
          </motion.div>
        </div>

        {/* Results List */}
        {results.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">暂无测试记录</h2>
            <p className="text-gray-600 mb-6">完成您的第一次情商测试，开始探索自己的情绪智慧</p>
            <Link to="/test">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary"
              >
                开始测试
              </motion.button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {results.map((result, index) => (
              <motion.div
                key={result.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.01 }}
                className="bg-white rounded-xl shadow-lg p-6 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold">
                      {result.user_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {result.user_name}
                      </h3>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(result.level)}`}>
                          {result.level}
                        </span>
                        <span className="text-sm text-gray-500">
                          得分: {calculatePercentage(result.dimensions)}%
                        </span>
                        <span className="text-sm text-gray-500">
                          <Clock className="inline w-3 h-3 mr-1" />
                          {new Date(result.created_at).toLocaleDateString('zh-CN')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Link to={`/result/${result.id}`}>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="flex items-center space-x-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      <span>查看详情</span>
                    </motion.button>
                  </Link>
                </div>

                {/* Dimension Summary */}
                <div className="mt-4 grid grid-cols-3 md:grid-cols-6 gap-2">
                  {result.dimensions.slice(0, 6).map((dim, idx) => (
                    <div key={idx} className="text-center">
                      <div className="text-xs text-gray-600 mb-1">{dim.category}</div>
                      <div className="text-sm font-semibold text-primary-600">
                        {dim.percentage}%
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Load More / Pagination could be added here */}
        {results.length > 0 && (
          <div className="text-center mt-8">
            <p className="text-gray-600">
              显示最近 {results.length} 条记录
            </p>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default HistoryPage
