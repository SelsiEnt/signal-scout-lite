'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function TestLogin() {
  const [email, setEmail] = useState('selsi21@gmail.com')
  const [password, setPassword] = useState('password1234')
  const [result, setResult] = useState('')
  const router = useRouter()

  const testLogin = () => {
    if (email === 'selsi21@gmail.com' && password === 'password1234') {
      setResult('✅ Login credentials are correct!')
      localStorage.setItem('admin_authenticated', 'true')
      localStorage.setItem('admin_email', email)
      setTimeout(() => {
        router.push('/admin/dashboard')
      }, 1000)
    } else {
      setResult('❌ Login credentials are incorrect')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6">Login Test</h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <button
            onClick={testLogin}
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Test Login
          </button>
          
          {result && (
            <div className="p-3 bg-gray-100 rounded">
              {result}
            </div>
          )}
        </div>
        
        <div className="mt-6 text-sm text-gray-600">
          <p><strong>Expected credentials:</strong></p>
          <p>Email: selsi21@gmail.com</p>
          <p>Password: password1234</p>
        </div>
      </div>
    </div>
  )
}
