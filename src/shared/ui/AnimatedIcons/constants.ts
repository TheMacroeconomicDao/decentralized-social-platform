export const CRYPTO_ICONS = [
    "bitcoin", "ethereum", "cardano", "solana", "polygon", 
    "polkadot", "litecoin", "bnb", "near", "ethereum-classic", 
    "toncoin", "tron", "internet"
] as const;

export const TECH_ICONS = [
    "react", "nodejs", "nextjs", "python", "flutter", "rust", "golang", "kuber"
] as const;

export const ALL_ICONS = [...CRYPTO_ICONS, ...TECH_ICONS] as const;

export const ICON_SIZES = {
    small: 18,
    medium: 28,
    large: 38,
} as const;

export const ICON_SIZES_MOBILE = {
    small: 18,
    medium: 28,
    large: 38,
} as const;

export const ANIMATION_CONFIG = {
    intervalMs: 3000,
    minDuration: 15,
    maxDuration: 30,
    minStartX: 10,
    maxStartX: 90,
    maxDrift: 30,
} as const;

export const ANIMATION_CONFIG_MOBILE = {
    intervalMs: 3000, // немного чаще создаём иконки
    minDuration: 18,  // чуть быстрее, чтобы уменьшить шанс упустить иконку
    maxDuration: 30,
    minStartX: 5,
    maxStartX: 95,
    maxDrift: 25,     // больше дрейфа для более заметного пути
    maxActiveIcons: 5, // до 5 иконок одновременно
} as const;

export const ICON_PATHS = {
    crypto: '/images/icons/flying/crypto',
    tech: '/images/icons/flying/tech',
    fallback: '/images/icons/flying',
} as const;

export type IconName = typeof ALL_ICONS[number];
export type IconSize = keyof typeof ICON_SIZES;
export type IconCategory = 'crypto' | 'tech'; 