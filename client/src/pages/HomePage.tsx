import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Brain, Heart, Users, TrendingUp, Award, BookOpen } from 'lucide-react'

const HomePage = () => {
  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: '自我意识',
      description: '了解自己的情绪状态和内心需求'
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: '情绪管理',
      description: '学会控制和调节自己的情绪反应'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: '社交技能',
      description: '提升人际交往和沟通能力'
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: '持续成长',
      description: '获得个性化的提升建议'
    }
  ]

  const benefits = [
    '科学的评估体系，基于心理学研究',
    '全面的维度分析，深入了解各方面表现',
    '个性化建议，针对性提升方案',
    '即时反馈，快速获得测试结果'
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center py-16"
      >
        <h1 className="text-5xl font-bold mb-6">
          <span className="gradient-text">探索你的情商潜力</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          通过专业的情商测试，了解自己的情绪智慧水平，获得个性化的成长建议，
          提升人际关系和生活质量
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/test">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary"
            >
              立即开始测试
            </motion.button>
          </Link>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-secondary"
            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
          >
            了解更多
          </motion.button>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 py-12"
      >
        <div className="bg-white rounded-xl p-6 text-center shadow-lg">
          <div className="text-3xl font-bold text-primary-600">20</div>
          <div className="text-gray-600 mt-2">专业题目</div>
        </div>
        <div className="bg-white rounded-xl p-6 text-center shadow-lg">
          <div className="text-3xl font-bold text-primary-600">7</div>
          <div className="text-gray-600 mt-2">评估维度</div>
        </div>
        <div className="bg-white rounded-xl p-6 text-center shadow-lg">
          <div className="text-3xl font-bold text-primary-600">5</div>
          <div className="text-gray-600 mt-2">等级划分</div>
        </div>
        <div className="bg-white rounded-xl p-6 text-center shadow-lg">
          <div className="text-3xl font-bold text-primary-600">100%</div>
          <div className="text-gray-600 mt-2">免费使用</div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section id="features" className="py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-center mb-12">
            <span className="gradient-text">核心评估维度</span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-6 shadow-lg card-hover"
              >
                <div className="text-primary-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-3xl p-12"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">
                <span className="gradient-text">为什么选择我们的测试？</span>
              </h2>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start"
                  >
                    <Award className="w-6 h-6 text-primary-600 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
            <div className="flex justify-center">
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "loop"
                }}
                className="bg-white rounded-2xl p-8 shadow-xl"
              >
                <BookOpen className="w-32 h-32 text-primary-600 mx-auto" />
                <p className="text-center mt-4 font-semibold text-gray-700">
                  专业 · 科学 · 实用
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-center py-16"
      >
        <h2 className="text-3xl font-bold mb-6">
          <span className="gradient-text">准备好探索你的情商了吗？</span>
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          只需几分钟，即可获得专业的情商评估报告
        </p>
        <Link to="/test">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary text-lg px-8 py-4"
          >
            开始免费测试
          </motion.button>
        </Link>
      </motion.section>
    </div>
  )
}

export default HomePage
