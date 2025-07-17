'use client'

import React, { useState } from 'react'
import { Eye, EyeOff, Mail, Lock, LogIn, UserPlus, RotateCcw } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface LoginFormProps {
  darkMode: boolean
}

export default function LoginForm({ darkMode }: LoginFormProps) {
  const { signIn, signUp, resetPassword } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [mode, setMode] = useState<'signin' | 'signup' | 'reset'>('signin')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setMessage(null)

    try {
      if (mode === 'reset') {
        const { error } = await resetPassword(formData.email)
        if (error) {
          setError(error.message)
        } else {
          setMessage('Check your email for the password reset link')
        }
      } else if (mode === 'signup') {
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match')
          return
        }
        const { error } = await signUp(formData.email, formData.password)
        if (error) {
          setError(error.message)
        } else {
          setMessage('Check your email to confirm your account')
        }
      } else {
        const { error } = await signIn(formData.email, formData.password)
        if (error) {
          // Sanitize error messages to prevent user enumeration
          if (error.message.includes('Invalid login credentials') || 
              error.message.includes('Email not confirmed') ||
              error.message.includes('User not found')) {
            setError('Invalid email or password')
          } else {
            setError('Authentication failed. Please try again.')
          }
        }
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-6 ${
            darkMode ? 'bg-indigo-600' : 'bg-indigo-100'
          }`}>
            <div className={`text-2xl ${darkMode ? 'text-white' : 'text-indigo-600'}`}>
              🎯
            </div>
          </div>
          <h2 className={`text-3xl font-bold ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Ultimate Focus
          </h2>
          <p className={`mt-2 text-sm ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {mode === 'signin' && 'Sign in to your account'}
            {mode === 'signup' && 'Create your account'}
            {mode === 'reset' && 'Reset your password'}
          </p>
        </div>

        <div className={`rounded-2xl shadow-xl p-8 ${
          darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
        }`}>
          {error && (
            <div className="mb-4 p-4 rounded-lg bg-red-50 border border-red-200">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {message && (
            <div className="mb-4 p-4 rounded-lg bg-green-50 border border-green-200">
              <p className="text-sm text-green-600">{message}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className={`h-5 w-5 ${
                    darkMode ? 'text-gray-400' : 'text-gray-400'
                  }`} />
                </div>
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {mode !== 'reset' && (
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className={`h-5 w-5 ${
                      darkMode ? 'text-gray-400' : 'text-gray-400'
                    }`} />
                  </div>
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`block w-full pl-10 pr-10 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className={`h-5 w-5 ${
                        darkMode ? 'text-gray-400' : 'text-gray-400'
                      }`} />
                    ) : (
                      <Eye className={`h-5 w-5 ${
                        darkMode ? 'text-gray-400' : 'text-gray-400'
                      }`} />
                    )}
                  </button>
                </div>
              </div>
            )}

            {mode === 'signup' && (
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className={`h-5 w-5 ${
                      darkMode ? 'text-gray-400' : 'text-gray-400'
                    }`} />
                  </div>
                  <input
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`block w-full pl-10 pr-3 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    placeholder="Confirm your password"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  {mode === 'signin' && <><LogIn className="w-4 h-4 mr-2" /> Sign In</>}
                  {mode === 'signup' && <><UserPlus className="w-4 h-4 mr-2" /> Sign Up</>}
                  {mode === 'reset' && <><RotateCcw className="w-4 h-4 mr-2" /> Reset Password</>}
                </>
              )}
            </button>
          </form>

          <div className="mt-6">
            <div className={`text-sm text-center ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {mode === 'signin' && (
                <>
                  Don&apos;t have an account?{' '}
                  <button
                    onClick={() => setMode('signup')}
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Sign up
                  </button>
                  <br />
                  <button
                    onClick={() => setMode('reset')}
                    className="font-medium text-indigo-600 hover:text-indigo-500 mt-2 inline-block"
                  >
                    Forgot your password?
                  </button>
                </>
              )}
              {mode === 'signup' && (
                <>
                  Already have an account?{' '}
                  <button
                    onClick={() => setMode('signin')}
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Sign in
                  </button>
                </>
              )}
              {mode === 'reset' && (
                <>
                  Remember your password?{' '}
                  <button
                    onClick={() => setMode('signin')}
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Sign in
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}