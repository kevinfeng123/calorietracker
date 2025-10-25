'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

interface Meal {
  id: string
  food_name: string
  calories: number
  date: string
  created_at: string
  user_id?: string
}

export default function MealsPage() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const [meals, setMeals] = useState<Meal[]>([])
  const [isAddingMeal, setIsAddingMeal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    food_name: '',
    calories: '',
    date: new Date().toISOString().split('T')[0]
  })

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth')
    }
  }, [user, loading, router])

  // Fetch meals from Supabase
  const fetchMeals = async () => {
    if (!user) return
    
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('meals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching meals:', error)
        return
      }

      setMeals(data || [])
    } catch (error) {
      console.error('Error fetching meals:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Load meals when user is authenticated
  useEffect(() => {
    if (user) {
      fetchMeals()
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.food_name || !formData.calories || !user) {
      alert('Please fill in all fields')
      return
    }

    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('meals')
        .insert({
          food_name: formData.food_name,
          calories: parseInt(formData.calories),
          date: formData.date,
          user_id: user.id
        })
        .select()
        .single()

      if (error) {
        console.error('Error adding meal:', error)
        alert('Failed to add meal. Please try again.')
        return
      }

      // Add the new meal to the local state
      setMeals(prev => [data, ...prev])
      setFormData({
        food_name: '',
        calories: '',
        date: new Date().toISOString().split('T')[0]
      })
      setIsAddingMeal(false)
    } catch (error) {
      console.error('Error adding meal:', error)
      alert('Failed to add meal. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteMeal = async (mealId: string) => {
    if (!confirm('Are you sure you want to delete this meal?')) return

    try {
      setIsLoading(true)
      const { error } = await supabase
        .from('meals')
        .delete()
        .eq('id', mealId)

      if (error) {
        console.error('Error deleting meal:', error)
        alert('Failed to delete meal. Please try again.')
        return
      }

      // Remove the meal from local state
      setMeals(prev => prev.filter(meal => meal.id !== mealId))
    } catch (error) {
      console.error('Error deleting meal:', error)
      alert('Failed to delete meal. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

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

  const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0)

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link href="/dashboard" className="text-2xl font-bold text-black">
                CalorieTracker
              </Link>
              <div className="hidden md:flex space-x-6">
                <Link href="/dashboard" className="text-gray-600 hover:text-black transition-colors">
                  Dashboard
                </Link>
                <Link href="/meals" className="text-black font-medium">
                  Meals
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, {user.email}</span>
              <Button variant="outline" onClick={handleSignOut} className="border-black text-black hover:bg-gray-50">
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">Meal Log</h1>
          <p className="text-gray-600">Track your daily calorie intake</p>
        </div>

        {/* Today's Summary */}
        <Card className="border border-gray-200 mb-8">
          <CardHeader>
            <CardTitle className="text-black">Today's Summary</CardTitle>
            <CardDescription>Total calories logged for {new Date().toLocaleDateString()}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-black">{totalCalories}</div>
            <p className="text-gray-600 text-sm">calories logged</p>
          </CardContent>
        </Card>

        {/* Add Meal Button */}
        <div className="mb-6">
          <Button 
            onClick={() => setIsAddingMeal(true)}
            disabled={isLoading}
            className="bg-black text-white hover:bg-gray-800 disabled:opacity-50"
          >
            + Add Meal
          </Button>
        </div>

        {/* Add Meal Form */}
        {isAddingMeal && (
          <Card className="border border-gray-200 mb-8">
            <CardHeader>
              <CardTitle className="text-black">Add New Meal</CardTitle>
              <CardDescription>Log a meal or snack</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="food_name" className="text-black font-medium">
                    Food Name
                  </Label>
                  <Input
                    id="food_name"
                    value={formData.food_name}
                    onChange={(e) => setFormData({...formData, food_name: e.target.value})}
                    placeholder="e.g., Grilled Chicken Breast"
                    className="mt-1 border-gray-300 focus:border-black focus:ring-black"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="calories" className="text-black font-medium">
                      Calories
                    </Label>
                    <Input
                      id="calories"
                      type="number"
                      value={formData.calories}
                      onChange={(e) => setFormData({...formData, calories: e.target.value})}
                      placeholder="250"
                      className="mt-1 border-gray-300 focus:border-black focus:ring-black"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="date" className="text-black font-medium">
                      Date
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      className="mt-1 border-gray-300 focus:border-black focus:ring-black"
                      required
                    />
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button 
                    type="submit"
                    disabled={isLoading}
                    className="bg-black text-white hover:bg-gray-800 disabled:opacity-50"
                  >
                    {isLoading ? 'Adding...' : 'Add Meal'}
                  </Button>
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddingMeal(false)}
                    disabled={isLoading}
                    className="border-black text-black hover:bg-gray-50 disabled:opacity-50"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Meals List */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-black">Recent Meals</h2>
          
          {isLoading && meals.length === 0 ? (
            <Card className="border border-gray-200">
              <CardContent className="py-8 text-center">
                <div className="animate-pulse text-gray-600">Loading meals...</div>
              </CardContent>
            </Card>
          ) : meals.length === 0 ? (
            <Card className="border border-gray-200">
              <CardContent className="py-8 text-center">
                <p className="text-gray-600">No meals logged yet. Add your first meal above!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {meals.map((meal) => (
                <Card key={meal.id} className="border border-gray-200">
                  <CardContent className="py-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium text-black">{meal.food_name}</h3>
                        <p className="text-sm text-gray-600">
                          {new Date(meal.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="font-bold text-black">{meal.calories}</div>
                          <div className="text-sm text-gray-600">calories</div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteMeal(meal.id)}
                          disabled={isLoading}
                          className="border-red-300 text-red-600 hover:bg-red-50 disabled:opacity-50"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
