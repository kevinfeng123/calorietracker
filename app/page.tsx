'use client'

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse text-black text-lg">Loading...</div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-black mb-4">Welcome back!</h1>
          <p className="text-gray-600 mb-8">You're already logged in.</p>
          <Button asChild>
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
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
              <Button variant="ghost" asChild>
                <Link href="/auth">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/auth">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-black mb-6 tracking-tight">
            Track Your Calories
            <br />
            <span className="text-gray-500">With Precision</span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            A minimalistic approach to calorie tracking. 
            Focus on what matters most - your health and fitness goals.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="bg-black text-white hover:bg-gray-800">
              <Link href="/auth">Start Tracking</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-black text-black hover:bg-gray-50">
              <Link href="#features">Learn More</Link>
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="mt-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black mb-4">Simple. Clean. Effective.</h2>
            <p className="text-gray-600 text-lg">Everything you need, nothing you don't.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">📊</span>
              </div>
              <h3 className="text-2xl font-bold text-black mb-4">Track Everything</h3>
              <p className="text-gray-600">
                Log your meals, snacks, and drinks with our intuitive interface.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">🎯</span>
              </div>
              <h3 className="text-2xl font-bold text-black mb-4">Set Goals</h3>
              <p className="text-gray-600">
                Define your daily calorie targets and track your progress.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">📈</span>
              </div>
              <h3 className="text-2xl font-bold text-black mb-4">Visualize Progress</h3>
              <p className="text-gray-600">
                See your journey with clean, minimalistic charts and insights.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 CalorieTracker. Built with precision.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
