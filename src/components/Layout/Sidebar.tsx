import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'
import {
  Home,
  Search,
  Bookmark,
  TrendingUp,
  User,
  Settings,
  BarChart3,
  Users,
  List,
  Sparkles
} from 'lucide-react'

interface SidebarProps {
  currentPage: string
  onPageChange: (page: string) => void
}

export function Sidebar({ currentPage, onPageChange }: SidebarProps) {
  const { userProfile } = useAuth()

  const navigation = [
    { name: 'Dashboard', icon: Home, id: 'dashboard' },
    { name: 'Search', icon: Search, id: 'search' },
    { name: 'My Media', icon: Bookmark, id: 'lists' },
    { name: 'My Lists', icon: List, id: 'mylists' },
    { name: 'Users', icon: Users, id: 'users' },
    { name: 'Trending', icon: TrendingUp, id: 'trending' },
    { name: 'Recommend Me', icon: Sparkles, id: 'recommend' },
  ]

  const userNav = [
    { name: 'Profile', icon: User, id: 'profile' },
    { name: 'Settings', icon: Settings, id: 'settings' },
  ]

  const adminNav = userProfile?.role === 'admin' ? [
    { name: 'Analytics', icon: BarChart3, id: 'analytics' },
    { name: 'Users', icon: Users, id: 'admin-users' },
  ] : []

  return (
    <div className="hidden md:flex md:w-64 md:flex-col">
      <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto bg-background border-r border-border">
        <div className="flex items-center flex-shrink-0 px-4">
          <div className="text-2xl font-bold text-foreground">
            🎬 Trackist
          </div>
        </div>

        <div className="mt-8 flex-grow flex flex-col">
          <nav className="flex-1 px-2 space-y-1">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => onPageChange(item.id)}
                className={cn(
                  'w-full group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all',
                  currentPage === item.id
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                )}
              >
                <item.icon
                  className={cn(
                    'mr-3 h-5 w-5',
                    currentPage === item.id
                      ? 'text-primary'
                      : 'text-muted-foreground'
                  )}
                />
                {item.name}
              </button>
            ))}

            {adminNav.length > 0 && (
              <div className="mt-6">
                <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Admin
                </div>
                {adminNav.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => onPageChange(item.id)}
                    className={cn(
                      'w-full group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all',
                      currentPage === item.id
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                    )}
                  >
                    <item.icon
                      className={cn(
                        'mr-3 h-5 w-5',
                        currentPage === item.id
                          ? 'text-primary'
                          : 'text-muted-foreground'
                      )}
                    />
                    {item.name}
                  </button>
                ))}
              </div>
            )}

            <div className="mt-auto">
              {userNav.map((item) => (
                <button
                  key={item.name}
                  onClick={() => onPageChange(item.id)}
                  className={cn(
                    'w-full group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all',
                    currentPage === item.id
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                  )}
                >
                  <item.icon
                    className={cn(
                      'mr-3 h-5 w-5',
                      currentPage === item.id
                        ? 'text-primary'
                        : 'text-muted-foreground'
                    )}
                  />
                  {item.name}
                </button>
              ))}
            </div>
          </nav>
        </div>
      </div>
    </div>
  )
}