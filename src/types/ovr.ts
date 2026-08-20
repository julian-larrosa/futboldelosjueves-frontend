export type OvTier = 'gold' | 'silver' | 'bronze'

export interface OvTierInfo {
  key: OvTier
  label: string
  min: number
  max: number
  cardBg: string
  cardBorder: string
  badgeBg: string
  badgeText: string
}

export const OVR_TIERS: OvTierInfo[] = [
  {
    key: 'gold',
    label: 'Oro',
    min: 8.0,
    max: 10,
    cardBg: 'from-amber-400 via-yellow-500 to-amber-600',
    cardBorder: 'border-yellow-400',
    badgeBg: 'bg-yellow-400',
    badgeText: 'text-yellow-950',
  },
  {
    key: 'silver',
    label: 'Plata',
    min: 6.5,
    max: 7.99,
    cardBg: 'from-slate-300 via-slate-400 to-slate-500',
    cardBorder: 'border-slate-300',
    badgeBg: 'bg-slate-300',
    badgeText: 'text-slate-900',
  },
  {
    key: 'bronze',
    label: 'Bronce',
    min: 0,
    max: 6.49,
    cardBg: 'from-amber-600 via-amber-700 to-amber-800',
    cardBorder: 'border-amber-700',
    badgeBg: 'bg-amber-700',
    badgeText: 'text-amber-100',
  },
]

export function getOvTier(ovr: number): OvTierInfo {
  return OVR_TIERS.find((tier) => ovr >= tier.min && ovr <= tier.max) ?? OVR_TIERS[2]
}

export function averageAttributes(values: number[]): number {
  if (values.length === 0) return 0
  const total = values.reduce((sum, value) => sum + value, 0)
  return Math.round((total / values.length) * 100) / 100
}