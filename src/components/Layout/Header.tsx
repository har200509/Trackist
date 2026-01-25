import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/Button'
import { LogOut, Menu } from 'lucide-react'

interface HeaderProps {
  onMobileMenuToggle: () => void
}

export function Header({ onMobileMenuToggle }: HeaderProps) {
  const { userProfile, signOut } = useAuth()

  return (
    <div className="bg-background shadow-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={onMobileMenuToggle}
              className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="md:hidden ml-2 text-xl font-bold text-foreground">
              🎬 Trackist
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <img
                className="h-8 w-8 rounded-full bg-muted"
                src={userProfile?.avatar_url || `https://ui-avatars.com/api/?name=${userProfile?.username}&background=6366f1&color=fff`}
                alt={userProfile?.username}
              />
              <div className="hidden md:block">
                <div className="text-sm font-medium text-foreground">
                  {userProfile?.username}
                </div>
                <div className="text-xs text-muted-foreground">
                  {userProfile?.role}
                </div>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={signOut}
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden md:ml-2 md:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}