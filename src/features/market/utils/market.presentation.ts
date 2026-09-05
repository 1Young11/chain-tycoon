export type ChangeDirection = 'positive' | 'negative' | 'neutral' | null

export interface AssetPresentation {
   name: string
   glyph: string
   background: string
   foreground?: string
}

export interface DataStatusPresentation {
   label: string
   modifier: 'fresh' | 'cached'
}

const assetPresentations: Readonly<Partial<Record<string, Readonly<AssetPresentation>>>> = {
   BTC: { name: 'Bitcoin', glyph: '₿', background: '#f7931a' },
   ETH: { name: 'Ethereum', glyph: 'Ξ', background: '#627eea' },
   SOL: { name: 'Solana', glyph: 'S', background: '#14f195', foreground: '#090a0f' },
   BNB: { name: 'BNB', glyph: 'B', background: '#f3ba2f', foreground: '#090a0f' },
   ADA: { name: 'Cardano', glyph: 'A', background: '#0033ad' },
}

export const getAssetPresentation = (symbol: string): Readonly<AssetPresentation> => {
   return assetPresentations[symbol] ?? {
      name: symbol,
      glyph: symbol.charAt(0),
      background: 'var(--color-bg-elevated)',
   }
}

export const getChangeDirection = (percent: string | null): ChangeDirection => {
   if (percent === null) return null
   const percentValue = Number(percent)
   if (percentValue > 0) return 'positive'
   if (percentValue < 0) return 'negative'
   return 'neutral'
}

export const getDataStatusPresentation = (isStale: boolean): Readonly<DataStatusPresentation> => {
   return isStale ? { label: 'Cached', modifier: 'cached' } : { label: 'Fresh', modifier: 'fresh' }
}
