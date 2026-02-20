import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import type { AxiosError } from 'axios'
import './auth.css'

interface ValidationErrors {
  name?: string[]
  email?: string[]
  password?: string[]
}

export default function RegisterPage() {
  const { register } = useAuth()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [generalError, setGeneralError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setErrors({})
    setGeneralError('')
    setLoading(true)

    try {
      await register(name, email, password, passwordConfirmation)
    } catch (err) {
      const error = err as AxiosError<{ message?: string; errors?: ValidationErrors }>
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors ?? {})
        setGeneralError(error.response.data.message ?? '')
      } else {
        setGeneralError('Something went wrong. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const EyeIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="auth-icon">
      <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
      <path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
    </svg>
  )

  const EyeSlashIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="auth-icon">
      <path fillRule="evenodd" d="M3.28 2.22a.75.75 0 00-1.06 1.06l14.5 14.5a.75.75 0 101.06-1.06l-1.745-1.745a10.029 10.029 0 003.3-4.38 1.651 1.651 0 000-1.185A10.004 10.004 0 009.999 3a9.956 9.956 0 00-4.744 1.194L3.28 2.22zM7.752 6.69l1.092 1.092a2.5 2.5 0 013.374 3.373l1.092 1.092a4 4 0 00-5.558-5.558z" clipRule="evenodd" />
      <path d="M10.748 13.93l2.523 2.523A9.987 9.987 0 0110 17c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 012.838-4.327l2.08 2.08a4 4 0 005.373 5.373v-.001z" />
    </svg>
  )

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Logo / Title */}
        <div className="auth-header">
          <div className="auth-logo">Todo List</div>
          <p className="auth-subtitle">Create your account</p>
        </div>

        {/* Card */}
        <div className="auth-card">
          {/* General error */}
          {generalError && (
            <div className="auth-error-banner">{generalError}</div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            {/* Name */}
            <div>
              <label htmlFor="name" className="auth-label">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
                autoComplete="name"
                className={`auth-input ${errors.name ? 'input-error' : ''}`}
              />
              {errors.name && (
                <p className="auth-field-error">{errors.name[0]}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="auth-label">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
                className={`auth-input ${errors.email ? 'input-error' : ''}`}
              />
              {errors.email && (
                <p className="auth-field-error">{errors.email[0]}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="auth-label">
                Password
              </label>
              <div className="auth-password-wrapper">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 8 characters"
                  required
                  autoComplete="new-password"
                  className={`auth-input auth-input-password ${errors.password ? 'input-error' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="auth-toggle-password"
                >
                  {showPassword ? EyeSlashIcon : EyeIcon}
                </button>
              </div>
              {errors.password && (
                <p className="auth-field-error">{errors.password[0]}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="password_confirmation" className="auth-label">
                Confirm Password
              </label>
              <div className="auth-password-wrapper">
                <input
                  id="password_confirmation"
                  type={showConfirm ? 'text' : 'password'}
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  placeholder="Re-enter your password"
                  required
                  autoComplete="new-password"
                  className="auth-input auth-input-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="auth-toggle-password"
                >
                  {showConfirm ? EyeSlashIcon : EyeIcon}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading} className="auth-submit">
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>

          {/* Divider */}
          <div className="auth-divider">
            <div className="auth-divider-line" />
            <span className="auth-divider-text">or</span>
            <div className="auth-divider-line" />
          </div>

          {/* Login link */}
          <p className="auth-footer">
            Already have an account?{' '}
            <Link to="/login" className="auth-link">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
