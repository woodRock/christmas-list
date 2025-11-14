'use client'

import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function LoginClient({ redirectUrl = '/', initialMode = 'login' }: { redirectUrl?: string; initialMode?: 'login' | 'signup' }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [message, setMessage] = useState('')
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })
    if (error) {
      setMessage(error.message)
    } else {
      setMessage('Check your email for the confirmation link! You will be redirected after confirmation.')
      // After successful signup, redirect to the specified URL
      // Supabase will handle the email confirmation flow, and then redirect to the redirectTo URL
      // We don't push here directly, as the email confirmation is required first.
    }
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) {
      setMessage(error.message)
    } else {
      router.push(redirectUrl) // Redirect to the specified URL
    }
  }

  const handleResetPassword = async () => {
    setMessage('')
    if (!email) {
      setMessage('Please enter your email to reset password.')
      return
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/update-password`,
    })
    if (error) {
      setMessage(error.message)
    } else {
      setMessage('Password reset email sent! Check your inbox.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="max-w-md w-full bg-white dark:bg-gray-700 p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">{mode === 'login' ? 'Login' : 'Sign Up'}</h2>
        {message && <p className="text-red-500 text-center mb-4">{message}</p>}
        <form className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-300">Full Name</label>
              <input
                type="text"
                id="fullName"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
          )}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
            <input
              type="email"
              id="email"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
            <input
              type="password"
              id="password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-between">
            {mode === 'login' ? (
              <button
                type="button"
                onClick={handleSignIn}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Login
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSignUp}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Sign Up
              </button>
            )}
          </div>
          <div className="text-center mt-4">
            {mode === 'login' ? (
              <>
                <button
                  type="button"
                  onClick={handleResetPassword}
                  className="text-sm text-blue-500 hover:underline mr-4"
                >
                  Forgot Password?
                </button>
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="text-sm text-blue-500 hover:underline"
                >
                  Don't have an account? Sign Up
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-sm text-blue-500 hover:underline"
              >
                Already have an account? Login
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}