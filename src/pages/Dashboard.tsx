import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { useAuth } from '@/contexts/AuthContext'
import { useUserMedia, useUserStats } from '@/hooks/useMedia'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { MediaCard } from '@/components/MediaCard'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import {
  TrendingUp,
  Clock,
  Play,
  Check,
  Star,
  Calendar,
  BarChart3,
  Award,
  X,
  Timer,
  Flame
} from 'lucide-react'
import { cn, formatStatusName, formatMediaType } from '@/lib/utils'

export function Dashboard() {
  const { userProfile } = useAuth()
  const { data: userMedia, isLoading: isLoadingMedia } = useUserMedia(userProfile?.id || '')
  const { data: userStats, isLoading: isLoadingStats } = useUserStats(userProfile?.id || '')

  // Calculate total hours watched
  const calculateTotalHours = () => {
    if (!userMedia) return 0

    return userMedia.reduce((total, item) => {
      const mediaType = item.media.type
      const status = item.status

      // Only count completed or partially watched items
      if (status === 'completed' || status === 'watching') {
        let hours = 0

        if (mediaType === 'movie') {
          // Assume average movie length of 2 hours
          hours = status === 'completed' ? 2 : 1 // 1 hour if watching
        } else if (mediaType === 'tv') {
          // Calculate based on episodes watched
          const episodesWatched = item.watched_episodes || 0
          const avgEpisodeLength = 45 // minutes
          hours = (episodesWatched * avgEpisodeLength) / 60
        } else if (mediaType === 'book') {
          // Assume average book reading time of 8 hours
          hours = status === 'completed' ? 8 : 2 // 2 hours if reading
        } else if (mediaType === 'game') {
          // Assume average game completion time of 20 hours
          hours = status === 'completed' ? 20 : 5 // 5 hours if playing
        }

        return total + hours
      }

      return total
    }, 0)
  }

  // Calculate current streak
  const calculateStreak = () => {
    if (!userMedia) return 0

    // Get all completed items sorted by completion date
    const completedItems = userMedia
      .filter(item => item.status === 'completed')
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())

    if (completedItems.length === 0) return 0

    let streak = 0
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Check consecutive days
    for (let i = 0; i < completedItems.length; i++) {
      const itemDate = new Date(completedItems[i].updated_at)
      itemDate.setHours(0, 0, 0, 0)

      const daysDiff = Math.floor((today.getTime() - itemDate.getTime()) / (1000 * 60 * 60 * 24))

      if (daysDiff === i) {
        streak++
      } else {
        break
      }
    }

    return streak
  }

  // Calculate stats
  const stats = userMedia?.reduce((acc, item) => {
    const mediaType = item.media.type
    const status = item.status

    if (!acc[mediaType]) {
      acc[mediaType] = { total: 0, completed: 0, watching: 0, planned: 0 }
    }

    acc[mediaType].total++
    if (status === 'completed') acc[mediaType].completed++
    if (status === 'watching') acc[mediaType].watching++
    if (status === 'plan_to_watch') acc[mediaType].planned++

    return acc
  }, {} as any) || {}

  const totalHours = calculateTotalHours()
  const currentStreak = calculateStreak()

  const chartData = Object.entries(stats).map(([type, data]: [string, any]) => ({
    name: type.charAt(0).toUpperCase() + type.slice(1),
    completed: data.completed,
    watching: data.watching,
    planned: data.planned,
  }))

  const pieData = Object.entries(stats).map(([type, data]: [string, any]) => ({
    name: type === 'tv' ? 'TV Shows' : type.charAt(0).toUpperCase() + type.slice(1) + 's',
    value: data.total,
  }))

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444']

  // Recent activity
  const recentActivity = userMedia
    ?.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 5) || []

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <Check className="h-4 w-4 text-green-600" />
      case 'watching': return <Play className="h-4 w-4 text-blue-600" />
      case 'plan_to_watch': return <Clock className="h-4 w-4 text-yellow-600" />
      case 'dropped': return <X className="h-4 w-4 text-red-600" />
      default: return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'watching': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'plan_to_watch': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'dropped': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="p-6 space-y-8">
        {/* Header Section */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 rounded-3xl blur-3xl"></div>
          <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl p-8 border border-white/20 dark:border-slate-700/50">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Welcome back{userProfile?.username ? `, ${userProfile.username}` : ''}!
                </h1>
                <p className="text-slate-600 dark:text-slate-300 mt-2 text-lg">
                  Here's what's happening with your media tracking
                </p>
              </div>
              <div className="hidden md:flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">
                    {userStats?.total || 0}
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">Total Items</div>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(stats).map(([type, data]: [string, any]) => (
            <Card key={type} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  {type === 'tv' ? 'TV Shows' : type.charAt(0).toUpperCase() + type.slice(1).toLowerCase() + 's'}
                </CardTitle>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-xl">
                    {type === 'movie' ? '🎬' : type === 'tv' ? '📺' : type === 'book' ? '📚' : '🎮'}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900 dark:text-white">{data.total}</div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {data.completed} completed
                </p>
                <div className="mt-3 w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${data.total > 0 ? (data.completed / data.total) * 100 : 0}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Total Hours Watched */}
          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-200">Total Hours Consumed</CardTitle>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Timer className="h-6 w-6 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-slate-900 dark:text-white mb-2">{Math.round(totalHours)}</div>
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                {totalHours >= 24 ? `${Math.round(totalHours / 24)} days` : 'hours'} of content
              </p>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Movies</span>
                  <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                    ~{Math.round(userMedia?.filter(item => item.media.type === 'movie' && (item.status === 'completed' || item.status === 'watching')).length * 2 || 0)}h
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600 dark:text-slate-400">TV Shows</span>
                  <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                    ~{Math.round(userMedia?.reduce((total, item) => {
                      if (item.media.type === 'tv' && (item.status === 'completed' || item.status === 'watching')) {
                        return total + ((item.watched_episodes || 0) * 45) / 60
                      }
                      return total
                    }, 0) || 0)}h
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Books</span>
                  <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                    ~{Math.round(userMedia?.filter(item => item.media.type === 'book' && (item.status === 'completed' || item.status === 'watching')).length * 8 || 0)}h
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Games</span>
                  <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                    ~{Math.round(userMedia?.filter(item => item.media.type === 'game' && (item.status === 'completed' || item.status === 'watching')).length * 20 || 0)}h
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Streak System */}
          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-orange-50 to-red-100 dark:from-orange-900/20 dark:to-red-900/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-200">Current Streak</CardTitle>
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Flame className="h-6 w-6 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-orange-600 dark:text-orange-400 mb-2">{currentStreak}</div>
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                {currentStreak === 0 ? 'No Active Streak' :
                  currentStreak === 1 ? 'Day Streak' : 'Days Streak'}
              </p>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                {currentStreak > 0 && (
                  <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-3">
                    <span className="font-medium">Last Completed:</span><br />
                    {userMedia?.filter(item => item.status === 'completed')
                      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())[0]?.media.title}
                  </div>
                )}
                {currentStreak === 0 && userMedia?.filter(item => item.status === 'completed').length > 0 && (
                  <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-3 text-center">
                    Complete Something To Start Your Streak! 🔥
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Media Distribution Chart */}
        <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-200">Media Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={120}
                    innerRadius={50}
                    fill="#8884d8"
                    dataKey="value"
                    stroke="#ffffff"
                    strokeWidth={3}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [value, name]}
                    labelStyle={{ color: '#374151', fontWeight: '600' }}
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                      padding: '12px 16px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-6 mt-6">
              {pieData.map((entry, index) => (
                <div key={entry.name} className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 rounded-full shadow-sm"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{entry.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-200">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="group/item flex items-center space-x-4 p-4 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-700/50 dark:to-slate-600/50 rounded-2xl hover:shadow-md transition-all duration-300">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center group-hover/item:scale-110 transition-transform duration-300">
                    {getStatusIcon(activity.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      <span className="text-slate-600 dark:text-slate-400">{formatStatusName(activity.status, activity.media.type)}</span>{' '}
                      <span className="text-slate-900 dark:text-slate-100">{activity.media.title}</span>
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{formatDate(activity.updated_at)}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <Badge variant="secondary" className="text-xs bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-slate-700 dark:text-slate-300 border-0">
                      {formatMediaType(activity.media.type)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}