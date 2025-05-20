"use client"

import { useState} from "react"
import { useRouter } from "next/navigation"
import "./styles.css"
import Image from "next/image"
import logo from "../../assets/logo.png"
import { signIn } from 'next-auth/react';

export default function AdminLogin() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [errors, setErrors] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [loginError, setLoginError] = useState("")
  
    
  
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
  
        setTimeout( async() => {
          const res = await signIn('credentials', {
            redirect: false,
            email,
            password,
          });
    
        if (res.error) {
          setLoginError('Invalid credentials');
        } else {
          router.push('/admin/dashboard'); 
        }
        }, 1000)
      }
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
        </div>
  
        <div className="admin-login-footer">
          <p>Copyright © 2025 Adventure Freakssss</p>
        </div>
      </div>
    )
  }
  