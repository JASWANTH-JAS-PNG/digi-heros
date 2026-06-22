import Link from 'next/link'

export default function SubscriptionSuccessPage() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-7xl mb-6">🎉</div>
        <h1 className="text-4xl font-black text-white mb-3">You're in!</h1>
        <p className="text-zinc-400 mb-8">
          Your subscription is active. You can now log your scores, enter monthly draws, and start giving to your chosen charity.
        </p>
        <Link href="/dashboard"
          className="inline-block bg-green-500 hover:bg-green-400 text-black font-bold px-8 py-4 rounded-2xl transition-all hover:scale-105">
          Go to Dashboard →
        </Link>
      </div>
    </div>
  )
}
