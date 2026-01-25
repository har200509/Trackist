import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'
import { useUpdateProfile, useChangePassword, useChangeEmail } from '@/hooks/useMedia'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { toast } from '@/components/ui/Toast'
import {
    User,
    Mail,
    Lock,
    Palette,
    Shield,
    Save,
    Eye,
    EyeOff,
    Moon,
    Sun,
    Settings as SettingsIcon
} from 'lucide-react'

export function Settings() {
    const { user, userProfile, signOut } = useAuth()
    const { theme, toggleTheme } = useTheme()
    const updateProfileMutation = useUpdateProfile()
    const changePasswordMutation = useChangePassword()
    const changeEmailMutation = useChangeEmail()

    // Profile editing state
    const [isEditingProfile, setIsEditingProfile] = useState(false)
    const [profileForm, setProfileForm] = useState({
        username: userProfile?.username || '',
        bio: userProfile?.bio || ''
    })

    // Password change state
    const [isChangingPassword, setIsChangingPassword] = useState(false)
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    })
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    })

    // Email change state
    const [isChangingEmail, setIsChangingEmail] = useState(false)
    const [emailForm, setEmailForm] = useState({
        newEmail: user?.email || ''
    })

    // Privacy settings state
    const [privacy, setPrivacy] = useState({
        isPrivate: userProfile?.is_private || false
    })

    // Update profile form when userProfile changes
    useEffect(() => {
        if (userProfile) {
            setProfileForm({
                username: userProfile.username || '',
                bio: userProfile.bio || ''
            })
            setPrivacy({
                isPrivate: userProfile.is_private || false
            })
        }
    }, [userProfile])

    // Update email form when user changes
    useEffect(() => {
        if (user?.email) {
            setEmailForm({
                newEmail: user.email
            })
        }
    }, [user])

    const handleSaveProfile = async () => {
        if (!user?.id) return

        try {
            await updateProfileMutation.mutateAsync({
                userId: user.id,
                updates: {
                    ...profileForm,
                    is_private: privacy.isPrivate
                }
            })
            setIsEditingProfile(false)
        } catch (error) {
            console.error('Failed to update profile:', error)
        }
    }

    const handleSavePrivacy = async () => {
        if (!user?.id) return

        try {
            const result = await updateProfileMutation.mutateAsync({
                userId: user.id,
                updates: {
                    is_private: privacy.isPrivate
                }
            })
            toast.success('Privacy Settings Saved', 'Your privacy preferences have been updated successfully!')
        } catch (error) {
            console.error('Failed to update privacy settings:', error)
            toast.error('Failed to Save Privacy Settings', 'Please try again or contact support if the issue persists.')
        }
    }

    const handleChangePassword = async () => {
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            toast.error('Password Mismatch', 'New passwords do not match. Please try again.')
            return
        }

        try {
            await changePasswordMutation.mutateAsync({
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword
            })
            setIsChangingPassword(false)
            setPasswordForm({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            })
            toast.success('Password Changed', 'Your password has been updated successfully!')
        } catch (error) {
            console.error('Failed to change password:', error)
            toast.error('Failed to Change Password', 'Please check your current password and try again.')
        }
    }

    const handleChangeEmail = async () => {
        try {
            await changeEmailMutation.mutateAsync({
                newEmail: emailForm.newEmail
            })
            setIsChangingEmail(false)
            toast.success('Email Change Request Sent', 'Please check your new email for confirmation.')
        } catch (error) {
            console.error('Failed to change email:', error)
            toast.error('Failed to Change Email', 'Please try again or contact support if the issue persists.')
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            <div className="p-6 space-y-8">
                {/* Header */}
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 rounded-3xl blur-3xl"></div>
                    <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl p-8 border border-white/20 dark:border-slate-700/50">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                                <SettingsIcon className="h-8 w-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight">
                                    Settings
                                </h1>
                                <p className="text-slate-600 dark:text-slate-300 mt-2 text-lg">
                                    Manage your account preferences and security
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Profile Settings */}
                    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/50">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                                <User className="h-5 w-5" />
                                Profile Settings
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {isEditingProfile ? (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                                            Username
                                        </label>
                                        <Input
                                            value={profileForm.username}
                                            onChange={(e) => setProfileForm(prev => ({ ...prev, username: e.target.value }))}
                                            placeholder="Enter your username"
                                            className="h-10"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                                            Bio
                                        </label>
                                        <Input
                                            value={profileForm.bio}
                                            onChange={(e) => setProfileForm(prev => ({ ...prev, bio: e.target.value }))}
                                            placeholder="Tell Us About Yourself"
                                            className="h-10"
                                        />
                                    </div>
                                    <div className="flex gap-3">
                                        <Button
                                            onClick={handleSaveProfile}
                                            disabled={updateProfileMutation.isPending}
                                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
                                        >
                                            <Save className="h-4 w-4 mr-2" />
                                            {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() => setIsEditingProfile(false)}
                                            className="border-slate-200 dark:border-slate-600 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                                        <div>
                                            <p className="font-medium text-slate-800 dark:text-slate-200">Username</p>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">{userProfile?.username || 'Not Set'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                                        <div>
                                            <p className="font-medium text-slate-800 dark:text-slate-200">Bio</p>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">{userProfile?.bio || 'No bio set'}</p>
                                        </div>
                                    </div>
                                    <Button
                                        onClick={() => setIsEditingProfile(true)}
                                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
                                    >
                                        <User className="h-4 w-4 mr-2" />
                                        Edit Profile
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Security Settings */}
                    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/50">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                                <Shield className="h-5 w-5" />
                                Security Settings
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Password Change */}
                            {isChangingPassword ? (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                                            Current Password
                                        </label>
                                        <div className="relative">
                                            <Input
                                                type={showPasswords.current ? 'text' : 'password'}
                                                value={passwordForm.currentPassword}
                                                onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                                                placeholder="Enter Current Password"
                                                className="h-10 pr-10"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                            >
                                                {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                                            New Password
                                        </label>
                                        <div className="relative">
                                            <Input
                                                type={showPasswords.new ? 'text' : 'password'}
                                                value={passwordForm.newPassword}
                                                onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                                                placeholder="Enter New Password"
                                                className="h-10 pr-10"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                            >
                                                {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                                            Confirm New Password
                                        </label>
                                        <div className="relative">
                                            <Input
                                                type={showPasswords.confirm ? 'text' : 'password'}
                                                value={passwordForm.confirmPassword}
                                                onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                                placeholder="Confirm New Password"
                                                className="h-10 pr-10"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                            >
                                                {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <Button
                                            onClick={handleChangePassword}
                                            disabled={changePasswordMutation.isPending}
                                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
                                        >
                                            <Lock className="h-4 w-4 mr-2" />
                                            {changePasswordMutation.isPending ? 'Changing...' : 'Change Password'}
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() => setIsChangingPassword(false)}
                                            className="border-slate-200 dark:border-slate-600 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                                        <div>
                                            <p className="font-medium text-slate-800 dark:text-slate-200">Password</p>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">Last changed: Unknown</p>
                                        </div>
                                    </div>
                                    <Button
                                        onClick={() => setIsChangingPassword(true)}
                                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
                                    >
                                        <Lock className="h-4 w-4 mr-2" />
                                        Change Password
                                    </Button>
                                </div>
                            )}

                            {/* Email Change */}
                            {isChangingEmail ? (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                                            New Email Address
                                        </label>
                                        <Input
                                            type="email"
                                            value={emailForm.newEmail}
                                            onChange={(e) => setEmailForm(prev => ({ ...prev, newEmail: e.target.value }))}
                                            placeholder="Enter New Email Address"
                                            className="h-10"
                                        />
                                    </div>
                                    <div className="flex gap-3">
                                        <Button
                                            onClick={handleChangeEmail}
                                            disabled={changeEmailMutation.isPending}
                                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
                                        >
                                            <Mail className="h-4 w-4 mr-2" />
                                            {changeEmailMutation.isPending ? 'Sending...' : 'Change Email'}
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() => setIsChangingEmail(false)}
                                            className="border-slate-200 dark:border-slate-600 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                                        <div>
                                            <p className="font-medium text-slate-800 dark:text-slate-200">Email Address</p>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">{user?.email || 'Not Set'}</p>
                                        </div>
                                    </div>
                                    <Button
                                        onClick={() => setIsChangingEmail(true)}
                                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
                                    >
                                        <Mail className="h-4 w-4 mr-2" />
                                        Change Email
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Appearance Settings */}
                    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/50">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                                <Palette className="h-5 w-5" />
                                Appearance
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                                <div>
                                    <p className="font-medium text-slate-800 dark:text-slate-200">Theme</p>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                        Current: {theme === 'dark' ? 'Dark' : 'Light'} mode
                                    </p>
                                </div>
                                <Button
                                    onClick={toggleTheme}
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
                                >
                                    {theme === 'dark' ? <Sun className="h-4 w-4 mr-2" /> : <Moon className="h-4 w-4 mr-2" />}
                                    Switch to {theme === 'dark' ? 'Light' : 'Dark'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Privacy Settings */}
                    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/50">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                                <Shield className="h-5 w-5" />
                                Privacy
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                                    <div>
                                        <p className="font-medium text-slate-800 dark:text-slate-200">Private Profile</p>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">Hide your profile from other users</p>
                                    </div>
                                    <Button
                                        onClick={() => setPrivacy(prev => ({ ...prev, isPrivate: !prev.isPrivate }))}
                                        className={`${privacy.isPrivate
                                            ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800'
                                            : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800'
                                            } text-white border-0`}
                                    >
                                        {privacy.isPrivate ? 'Private' : 'Public'}
                                    </Button>
                                </div>
                            </div>
                            <div className="flex justify-end pt-4">
                                <Button
                                    onClick={handleSavePrivacy}
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
                                >
                                    <Save className="h-4 w-4 mr-2" />
                                    Save Privacy Settings
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
