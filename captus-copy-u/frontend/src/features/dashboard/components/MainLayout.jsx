"use client"

import { useState, useEffect } from "react"
import { Outlet } from "react-router-dom"
import { motion } from "framer-motion"
import Sidebar from "./Sidebar"

const MainLayout = ({ children }) => {
  const [sidebarWidth, setSidebarWidth] = useState(240)

  // Listen for sidebar width changes
  useEffect(() => {
    const handleResize = () => {
      const sidebar = document.querySelector('[class*="fixed inset-y-0 left-0"]')
      if (sidebar) {
        setSidebarWidth(sidebar.offsetWidth)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)

    // Use MutationObserver to detect sidebar width changes
    const observer = new MutationObserver(handleResize)
    const sidebar = document.querySelector('[class*="fixed inset-y-0 left-0"]')
    if (sidebar) {
      observer.observe(sidebar, { attributes: true, attributeFilter: ["style"] })
    }

    return () => {
      window.removeEventListener("resize", handleResize)
      observer.disconnect()
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#F6F7FB]">
      <Sidebar />

      <motion.div
        initial={false}
        animate={{ marginLeft: sidebarWidth }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="min-h-screen"
      >
        {children || <Outlet />}
      </motion.div>
    </div>
  )
}

export default MainLayout
