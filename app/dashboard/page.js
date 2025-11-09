"use client"
import React from 'react'
import { useEffect } from "react";
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation";
import Dashboard from '@/components/Dashboard';
const DashboardPage = () => {
  const { data: session } = useSession()
      const router = useRouter();
    useEffect(() => {
      if (!session) {
        router.push("/login");
      }
    }, [session, router]);
  return (
    <div>
      <Dashboard/>
    </div>
  )
}

export default DashboardPage
