import { Role } from '@prisma/client'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role: Role
    }
  }

  interface User {
    id: string
    name?: string | null
    email: string
    image?: string | null
    role: Role
  }
} 