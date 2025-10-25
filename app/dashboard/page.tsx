'use client'

import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'

export default function Dashboard() {
  const { user, signOut, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse text-black text-lg">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-black">CalorieTracker</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/meals" className="text-gray-600 hover:text-black transition-colors">
                Meals
              </Link>
              <span className="text-gray-600">Welcome, {user.email}</span>
              <Button variant="outline" onClick={handleSignOut} className="border-black text-black hover:bg-gray-50">
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-black mb-2">Dashboard</h2>
          <p className="text-gray-600">Track your daily calorie intake and progress.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="border border-gray-200">
            <CardHeader>
              <CardTitle className="text-black">Today's Calories</CardTitle>
              <CardDescription>Current intake</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-black">0</div>
              <p className="text-gray-600 text-sm">of 2,000 goal</p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200">
            <CardHeader>
              <CardTitle className="text-black">This Week</CardTitle>
              <CardDescription>Average daily intake</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-black">1,850</div>
              <p className="text-gray-600 text-sm">calories per day</p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200">
            <CardHeader>
              <CardTitle className="text-black">Streak</CardTitle>
              <CardDescription>Days logged</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-black">7</div>
              <p className="text-gray-600 text-sm">days in a row</p>
            </CardContent>
          </Card>
        </div>

        <Card className="border border-gray-200">
          <CardHeader>
            <CardTitle className="text-black">Quick Actions</CardTitle>
            <CardDescription>Get started with tracking your calories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <Button asChild className="bg-black text-white hover:bg-gray-800">
                <Link href="/meals">Add Meal</Link>
              </Button>
              <Button variant="outline" asChild className="border-black text-black hover:bg-gray-50">
                <Link href="/meals">View Meals</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
