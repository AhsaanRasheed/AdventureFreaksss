"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function AuthGuard({ children }) {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const adminAuthenticated = localStorage.getItem("adminAuthenticated")

    if (adminAuthenticated !== "true") {
      router.push("/admin")
    } else {
      setIsAuthenticated(true)
      router.push("/admin/dashboard")
    }

    setIsLoading(false)
  }, [router])

  if (isLoading) {
    return (
      <div className="auth-loading">
        <div className="spinner"></div>
        <p>Verifying authentication...</p>
      </div>
    )
  }

  return isAuthenticated ? children : null
}
