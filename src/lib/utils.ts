import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(amount)
}

export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}

export function getCurrentMonth() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

// Draw logic: count how many user scores match drawn numbers
export function calculateMatches(userScores: number[], drawnNumbers: number[]): number {
  return userScores.filter(s => drawnNumbers.includes(s)).length
}

export function getPrizeTier(matchCount: number): '5-match' | '4-match' | '3-match' | 'none' {
  if (matchCount >= 5) return '5-match'
  if (matchCount === 4) return '4-match'
  if (matchCount === 3) return '3-match'
  return 'none'
}

// Generate 5 random numbers between 1 and 45
export function generateRandomDraw(): number[] {
  const numbers = new Set<number>()
  while (numbers.size < 5) {
    numbers.add(Math.floor(Math.random() * 45) + 1)
  }
  return Array.from(numbers).sort((a, b) => a - b)
}

// Algorithmic draw: weighted by least-frequent user scores
export function generateAlgorithmicDraw(
  allScores: number[],
  frequencyMap: Record<number, number>
): number[] {
  const weights: { num: number; weight: number }[] = []
  for (let i = 1; i <= 45; i++) {
    const freq = frequencyMap[i] || 0
    weights.push({ num: i, weight: 1 / (freq + 1) })
  }
  const totalWeight = weights.reduce((s, w) => s + w.weight, 0)
  const numbers = new Set<number>()
  let attempts = 0
  while (numbers.size < 5 && attempts < 1000) {
    attempts++
    let rand = Math.random() * totalWeight
    for (const w of weights) {
      rand -= w.weight
      if (rand <= 0 && !numbers.has(w.num)) {
        numbers.add(w.num)
        break
      }
    }
  }
  return Array.from(numbers).sort((a, b) => a - b)
}
