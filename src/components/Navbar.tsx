'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'

export function Navbar({ user, isAdmin }: { user?: any; isAdmin?: boolean }) {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const navLinks = user
    ? isAdmin
      ? [
          { href: '/admin', label: 'Dashboard' },
          { href: '/admin/users', label: 'Users' },
          { href: '/admin/draws', label: 'Draws' },
          { href: '/admin/charities', label: 'Charities' },
          { href: '/admin/winners', label: 'Winners' },
          { href: '/admin/reports', label: 'Reports' },
        ]
      : [
          { href: '/dashboard', label: 'Dashboard' },
          { href: '/dashboard/scores', label: 'Scores' },
          { href: '/dashboard/draws', label: 'Draws' },
          { href: '/dashboard/charity', label: 'Charity' },
        ]
    : [
        { href: '/#how-it-works', label: 'How It Works' },
        { href: '/#charities', label: 'Charities' },
        { href: '/#pricing', label: 'Pricing' },
      ]

  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href={user ? '/dashboard' : '/'} className="flex items-center gap-2">
            <span className="text-2xl">⛳</span>
            <span className="font-bold text-xl gradient-text">GolfGive</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(l => (
              <Link
                key={l.href}
                href={l.href}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  pathname === l.href
                    ? 'bg-green-500/10 text-green-400'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                {isAdmin && (
                  <span className="hidden sm:block text-xs bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-1 rounded-full">
                    Admin
                  </span>
                )}
                <button
                  onClick={signOut}
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm text-zinc-400 hover:text-white">
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="text-sm bg-green-500 hover:bg-green-400 text-black font-semibold px-4 py-2 rounded-lg transition-colors"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
