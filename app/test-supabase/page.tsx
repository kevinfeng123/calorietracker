'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function TestSupabase() {
  const [status, setStatus] = useState('Testing...')
  const [details, setDetails] = useState('')

  useEffect(() => {
    const testConnection = async () => {
      try {
        setStatus('Testing Supabase connection...')
        
        // Test basic connection
        const { data, error } = await supabase.from('_test').select('*').limit(1)
        
        if (error) {
          if (error.message.includes('relation "_test" does not exist')) {
            setStatus('✅ Supabase connection successful!')
            setDetails('Your Supabase credentials are working correctly.')
          } else {
            setStatus('❌ Supabase connection failed')
            setDetails(`Error: ${error.message}`)
          }
        } else {
          setStatus('✅ Supabase connection successful!')
          setDetails('Your Supabase credentials are working correctly.')
        }
      } catch (err: any) {
        setStatus('❌ Connection failed')
        setDetails(`Error: ${err.message}`)
      }
    }

    testConnection()
  }, [])

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8">
      <div className="max-w-md w-full">
        <h1 className="text-2xl font-bold text-black mb-4">Supabase Connection Test</h1>
        <div className="bg-gray-100 p-4 rounded-lg">
          <p className="font-medium text-black mb-2">{status}</p>
          <p className="text-gray-600 text-sm">{details}</p>
        </div>
        <div className="mt-4 text-sm text-gray-600">
          <p><strong>URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not set'}</p>
          <p><strong>Key:</strong> {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not set'}</p>
        </div>
      </div>
    </div>
  )
}
