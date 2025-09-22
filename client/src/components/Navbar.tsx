import { Link, useLocation } from 'react-router-dom'
import { Brain, Home, History, TestTube } from 'lucide-react'

const Navbar = () => {
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Brain className="w-8 h-8 text-primary-600" />
            <span className="text-xl font-bold gradient-text">EQ Test</span>
          </Link>

          <div className="flex items-center space-x-8">
            <Link
              to="/"
              className={`flex items-center space-x-2 transition-colors duration-200 ${
                isActive('/') 
                  ? 'text-primary-600 font-semibold' 
                  : 'text-gray-600 hover:text-primary-600'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>首页</span>
            </Link>

            <Link
              to="/test"
              className={`flex items-center space-x-2 transition-colors duration-200 ${
                isActive('/test') 
                  ? 'text-primary-600 font-semibold' 
                  : 'text-gray-600 hover:text-primary-600'
              }`}
            >
              <TestTube className="w-4 h-4" />
              <span>开始测试</span>
            </Link>

            <Link
              to="/history"
              className={`flex items-center space-x-2 transition-colors duration-200 ${
                isActive('/history') 
                  ? 'text-primary-600 font-semibold' 
                  : 'text-gray-600 hover:text-primary-600'
              }`}
            >
              <History className="w-4 h-4" />
              <span>历史记录</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
