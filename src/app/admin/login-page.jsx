"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import "./styles.css"
import Image from "next/image"
import logo from "../assets/logo.png"

export default function AdminLogin() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [errors, setErrors] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [loginError, setLoginError] = useState("")
    const [checkingAuth, setCheckingAuth] = useState(true)
  
    // Check if already logged in
    useEffect(() => {
      setCheckingAuth(true)
      const isAuthenticated = localStorage.getItem("adminAuthenticated")
  
      if (isAuthenticated === "true") {
        router.push("/admin/dashboard")
      } else {
        setCheckingAuth(false)
      }
    }, [router])
  
    const validateForm = () => {
      const newErrors = {}
  
      // Email validation
      if (!email) {
        newErrors.email = "Email is required"
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        newErrors.email = "Email is invalid"
      }
  
      // Password validation
      if (!password) {
        newErrors.password = "Password is required"
      } else if (password.length < 6) {
        newErrors.password = "Password must be at least 6 characters"
      }
  
      setErrors(newErrors)
      return Object.keys(newErrors).length === 0
    }
  
    const handleSubmit = (e) => {
      e.preventDefault()
      setLoginError("")
  
      if (validateForm()) {
        setIsLoading(true)
  
        setTimeout(() => {
          if (email === "admin@example.com" && password === "password123") {
            localStorage.setItem("adminAuthenticated", "true")
            localStorage.setItem("adminEmail", email)
            router.push("/admin/dashboard")
          } else {
            setLoginError("Invalid email or password")
            setIsLoading(false)
          }
        }, 1000)
      }
    }
  
    if (checkingAuth) {
      return (
        <div className="auth-loading">
          <div className="spinner"></div>
          <p>Checking authentication status...</p>
        </div>
      )
    }
  
    return (
      <div className="admin-login-container">
        <div className="admin-login-card">
          <div className="admin-login-header">
            <div className="logo">
              <Image src={logo} alt="Adventure Freaks Logo" />
            </div>
            <h1>Admin Login</h1>
          </div>
  
          {loginError && <div className="login-error">{loginError}</div>}
  
          <form onSubmit={handleSubmit} className="admin-login-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={errors.email ? "input-error" : ""}
                placeholder="admin@example.com"
              />
              {errors.email && <div className="error-message">{errors.email}</div>}
            </div>
  
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={errors.password ? "input-error" : ""}
                placeholder="Enter your password"
              />
              {errors.password && <div className="error-message">{errors.password}</div>}
            </div>
  
            <button type="submit" className="login-button" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>
  
          <div className="login-help">
            <p>Demo credentials:</p>
            <p>Email: admin@example.com</p>
            <p>Password: password123</p>
          </div>
        </div>
  
        <div className="admin-login-footer">
          <p>Copyright © 2025 Adventure Freakssss</p>
        </div>
      </div>
    )
  }
  