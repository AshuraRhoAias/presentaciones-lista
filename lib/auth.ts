"use server"

import { cookies } from "next/headers"

// In a real application, you would use a database and proper authentication
// This is a simplified example for demonstration purposes
const VALID_CREDENTIALS = {
  username: "admin",
  password: "admin123",
}

export async function login(username: string, password: string) {
  if (username === VALID_CREDENTIALS.username && password === VALID_CREDENTIALS.password) {
    // Set a session cookie
    cookies().set("session", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    })
    return true
  }
  return false
}

export async function logout() {
  cookies().delete("session")
}

export async function getSession() {
  const session = cookies().get("session")
  return session?.value === "authenticated" ? { user: VALID_CREDENTIALS.username } : null
}

