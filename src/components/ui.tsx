import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('bg-zinc-900 border border-zinc-800 rounded-2xl p-6', className)}>
      {children}
    </div>
  )
}

export function Badge({ children, variant = 'default' }: { children: ReactNode; variant?: 'default' | 'green' | 'purple' | 'yellow' | 'red' }) {
  const variants = {
    default: 'bg-zinc-800 text-zinc-300',
    green: 'bg-green-500/10 text-green-400 border border-green-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
    yellow: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
    red: 'bg-red-500/10 text-red-400 border border-red-500/20',
  }
  return (
    <span className={cn('text-xs font-medium px-2.5 py-1 rounded-full', variants[variant])}>
      {children}
    </span>
  )
}

export function Button({
  children,
  className,
  variant = 'primary',
  disabled,
  onClick,
  type = 'button',
}: {
  children: ReactNode
  className?: string
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  disabled?: boolean
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
}) {
  const variants = {
    primary: 'bg-green-500 hover:bg-green-400 text-black font-semibold',
    secondary: 'bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700',
    danger: 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20',
    ghost: 'hover:bg-zinc-800 text-zinc-400 hover:text-white',
  }
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'px-4 py-2 rounded-xl text-sm transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        className
      )}
    >
      {children}
    </button>
  )
}

export function Input({
  label,
  error,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label?: string; error?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-zinc-300">{label}</label>}
      <input
        className={cn(
          'bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 text-sm',
          'focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/30 transition-colors',
          error && 'border-red-500',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}

export function Select({
  label,
  children,
  className,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-zinc-300">{label}</label>}
      <select
        className={cn(
          'bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm',
          'focus:outline-none focus:border-green-500 transition-colors',
          className
        )}
        {...props}
      >
        {children}
      </select>
    </div>
  )
}

export function Stat({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
      <p className="text-sm text-zinc-500 mb-1">{label}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
      {sub && <p className="text-xs text-zinc-500 mt-1">{sub}</p>}
    </div>
  )
}
