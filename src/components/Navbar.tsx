'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'
import { Menu, X, ArrowRight } from 'lucide-react'

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
          { href: '/admin',           label: 'Dashboard' },
          { href: '/admin/users',     label: 'Users' },
          { href: '/admin/draws',     label: 'Draws' },
          { href: '/admin/charities', label: 'Charities' },
          { href: '/admin/winners',   label: 'Winners' },
          { href: '/admin/reports',   label: 'Reports' },
        ]
      : [
          { href: '/dashboard',          label: 'Dashboard' },
          { href: '/dashboard/scores',   label: 'Scores' },
          { href: '/dashboard/draws',    label: 'Draws' },
          { href: '/dashboard/charity',  label: 'Charity' },
        ]
    : [
        { href: '/#how-it-works', label: 'How It Works' },
        { href: '/#charities',    label: 'Charities' },
        { href: '/#pricing',      label: 'Pricing' },
      ]

  return (
    <nav className="sticky top-0 z-50 glass border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href={user ? '/dashboard' : '/'} className="flex items-center gap-2">
            <span className="text-2xl">⛳</span>
            <span className="font-extrabold text-xl gradient-text">GolfGive</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(l => (
              <Link
                key={l.href}
                href={l.href}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  pathname === l.href
                    ? 'bg-indigo-500/10 text-indigo-400'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Right actions */}
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
                  className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm text-slate-400 hover:text-white transition-colors hidden sm:block">
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="flex items-center gap-1.5 text-sm bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold px-4 py-2 rounded-xl neon-indigo hover:from-indigo-400 hover:to-purple-500 transition-all"
                >
                  Get Started <ArrowRight size={13} />
                </Link>
              </>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setOpen(v => !v)}
              className="md:hidden p-2 rounded-lg glass border border-white/10 text-slate-400 hover:text-white"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden py-3 border-t border-white/5 flex flex-col gap-1 pb-4">
            {navLinks.map(l => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === l.href
                    ? 'bg-indigo-500/10 text-indigo-400'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {l.label}
              </Link>
            ))}
            {!user && (
              <Link href="/login" onClick={() => setOpen(false)} className="px-3 py-2 text-sm text-slate-400">
                Log In
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
