import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/contexts/AuthContext'
import { Eye, EyeOff, Mail, Lock, User, Sparkles, Film, Play, Star, Camera, Gamepad2, BookOpen, Headphones, Zap } from 'lucide-react'

export function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const { signIn, signUp } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      if (isLogin) {
        await signIn(email, password)
      } else {
        await signUp(email, password, username)
        // Show success message for registration
        setSuccess('Account created successfully! Welcome to Trackist!')
        // Clear form
        setEmail('')
        setPassword('')
        setUsername('')
        // Switch to login mode after a delay
        setTimeout(() => {
          setIsLogin(true)
          setSuccess('')
        }, 3000)
      }
    } catch (error: any) {
      setError(error.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Movie-Themed Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated Background Gradients */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400/20 to-orange-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-blue-600/10 rounded-full blur-3xl animate-pulse delay-500"></div>

        {/* Film Strip Elements */}
        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-r from-black/20 via-transparent to-black/20 opacity-30">
          <div className="flex space-x-4 h-full items-center px-4">
            {[...Array(20)].map((_, i) => (
              <div key={i} className={`w-8 h-12 rounded-sm border border-white/20 ${i % 4 === 0 ? 'bg-gradient-to-b from-blue-500/30 to-purple-600/30' :
                  i % 4 === 1 ? 'bg-gradient-to-b from-green-500/30 to-emerald-600/30' :
                    i % 4 === 2 ? 'bg-gradient-to-b from-amber-500/30 to-yellow-600/30' :
                      'bg-gradient-to-b from-pink-500/30 to-orange-600/30'
                }`}></div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-r from-black/20 via-transparent to-black/20 opacity-30">
          <div className="flex space-x-4 h-full items-center px-4">
            {[...Array(20)].map((_, i) => (
              <div key={i} className={`w-8 h-12 rounded-sm border border-white/20 ${i % 4 === 0 ? 'bg-gradient-to-b from-purple-500/30 to-blue-600/30' :
                  i % 4 === 1 ? 'bg-gradient-to-b from-cyan-500/30 to-green-600/30' :
                    i % 4 === 2 ? 'bg-gradient-to-b from-yellow-500/30 to-amber-600/30' :
                      'bg-gradient-to-b from-orange-500/30 to-pink-600/30'
                }`}></div>
            ))}
          </div>
        </div>

        {/* Floating Movie Icons */}
        <div className="absolute top-20 left-10 text-blue-500/20 animate-bounce">
          <Film className="h-8 w-8" />
        </div>
        <div className="absolute top-32 right-16 text-purple-500/20 animate-bounce delay-300">
          <Play className="h-6 w-6" />
        </div>
        <div className="absolute bottom-32 left-20 text-pink-500/20 animate-bounce delay-700">
          <Star className="h-7 w-7" />
        </div>
        <div className="absolute bottom-20 right-10 text-orange-500/20 animate-bounce delay-1000">
          <Camera className="h-6 w-6" />
        </div>
        <div className="absolute top-1/3 left-1/4 text-blue-500/20 animate-bounce delay-500">
          <Film className="h-5 w-5" />
        </div>
        <div className="absolute top-2/3 right-1/4 text-purple-500/20 animate-bounce delay-1200">
          <Star className="h-6 w-6" />
        </div>

        {/* Floating Game Icons */}
        <div className="absolute top-40 right-8 text-green-500/20 animate-bounce delay-200">
          <Gamepad2 className="h-7 w-7" />
        </div>
        <div className="absolute bottom-40 left-8 text-cyan-500/20 animate-bounce delay-800">
          <Gamepad2 className="h-6 w-6" />
        </div>
        <div className="absolute top-1/2 left-8 text-emerald-500/20 animate-bounce delay-400">
          <Zap className="h-5 w-5" />
        </div>
        <div className="absolute top-3/4 right-1/3 text-lime-500/20 animate-bounce delay-600">
          <Gamepad2 className="h-6 w-6" />
        </div>

        {/* Floating Book Icons */}
        <div className="absolute top-24 right-1/3 text-amber-500/20 animate-bounce delay-900">
          <BookOpen className="h-6 w-6" />
        </div>
        <div className="absolute bottom-24 left-1/3 text-yellow-500/20 animate-bounce delay-1100">
          <BookOpen className="h-7 w-7" />
        </div>
        <div className="absolute top-1/4 right-8 text-orange-500/20 animate-bounce delay-300">
          <BookOpen className="h-5 w-5" />
        </div>
        <div className="absolute bottom-1/4 left-12 text-amber-500/20 animate-bounce delay-700">
          <Headphones className="h-6 w-6" />
        </div>

        {/* Cinema Curtain Effect */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-red-900/30 via-red-800/20 to-transparent opacity-20"></div>
        <div className="absolute top-0 right-0 w-full h-32 bg-gradient-to-b from-red-900/30 via-red-800/20 to-transparent opacity-20"></div>

        {/* Subtle Movie Reel Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 border-4 border-blue-500/30 rounded-full"></div>
          <div className="absolute top-1/4 left-1/4 w-24 h-24 border-2 border-blue-500/20 rounded-full"></div>
          <div className="absolute top-1/4 left-1/4 w-16 h-16 border border-blue-500/10 rounded-full"></div>

          <div className="absolute bottom-1/4 right-1/4 w-32 h-32 border-4 border-purple-500/30 rounded-full"></div>
          <div className="absolute bottom-1/4 right-1/4 w-24 h-24 border-2 border-purple-500/20 rounded-full"></div>
          <div className="absolute bottom-1/4 right-1/4 w-16 h-16 border border-purple-500/10 rounded-full"></div>
        </div>

        {/* Game Controller Patterns */}
        <div className="absolute inset-0 opacity-3">
          <div className="absolute top-1/3 right-1/5 w-20 h-12 border-2 border-green-500/20 rounded-lg"></div>
          <div className="absolute top-1/3 right-1/5 w-16 h-8 border border-green-500/10 rounded-lg mt-2"></div>

          <div className="absolute bottom-1/3 left-1/5 w-20 h-12 border-2 border-cyan-500/20 rounded-lg"></div>
          <div className="absolute bottom-1/3 left-1/5 w-16 h-8 border border-cyan-500/10 rounded-lg mt-2"></div>
        </div>

        {/* Book Page Patterns */}
        <div className="absolute inset-0 opacity-4">
          <div className="absolute top-1/2 left-1/6 w-16 h-20 border border-amber-500/15 rounded-sm"></div>
          <div className="absolute top-1/2 left-1/6 w-14 h-18 border border-amber-500/10 rounded-sm mt-1 ml-1"></div>

          <div className="absolute bottom-1/2 right-1/6 w-16 h-20 border border-yellow-500/15 rounded-sm"></div>
          <div className="absolute bottom-1/2 right-1/6 w-14 h-18 border border-yellow-500/10 rounded-sm mt-1 ml-1"></div>
        </div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl blur-lg opacity-30"></div>
            <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-slate-700/50">
              <div className="flex items-center justify-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/50 to-purple-600/50 animate-pulse"></div>
                  <Film className="h-6 w-6 text-white relative z-10" />
                </div>
                <div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Trackist
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Track Movies, Shows, Books, And Games
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Auth Card */}
        <Card className="group hover:shadow-2xl transition-all duration-300 border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-200">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </CardTitle>
            <p className="text-slate-600 dark:text-slate-300 mt-2">
              {isLogin ? 'Sign in to continue your journey' : 'Join us and start tracking your media'}
            </p>
          </CardHeader>
          <CardContent className="pt-4">
            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Username
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter your username"
                      className="pl-10 h-12 border-slate-200 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500/20"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="pl-10 h-12 border-slate-200 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500/20"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="pl-10 pr-10 h-12 border-slate-200 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500/20"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm p-4 rounded-xl">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 text-sm p-4 rounded-xl flex items-center space-x-2">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span>{success}</span>
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Loading...</span>
                  </div>
                ) : (
                  isLogin ? 'Sign In' : 'Create Account'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin)
                  setError('')
                  setSuccess('')
                }}
                className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
              >
                {isLogin
                  ? "Don't have an account? Sign Up"
                  : "Already have an account? Sign In"
                }
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}