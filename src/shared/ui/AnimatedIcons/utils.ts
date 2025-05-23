import { CRYPTO_ICONS, TECH_ICONS, ICON_PATHS, type IconName, type IconCategory } from './constants';

export const getIconCategory = (iconName: string): IconCategory | null => {
    if (CRYPTO_ICONS.includes(iconName as any)) return 'crypto';
    if (TECH_ICONS.includes(iconName as any)) return 'tech';
    return null;
};

export const getIconPath = (iconName: string): string => {
    const category = getIconCategory(iconName);
    
    if (category) {
        return `${ICON_PATHS[category]}/${iconName}.svg`;
    }
    
    return `${ICON_PATHS.fallback}/${iconName}.svg`;
};

export const getRandomIcon = (icons: readonly string[]): string => {
    return icons[Math.floor(Math.random() * icons.length)];
};

export const getRandomSize = (): 'small' | 'medium' | 'large' => {
    const sizes = ['small', 'medium', 'large'] as const;
    return sizes[Math.floor(Math.random() * sizes.length)];
};

export const getRandomDuration = (min: number, max: number): number => {
    return min + Math.random() * (max - min);
};

export const getRandomPosition = (min: number, max: number, drift: number) => {
    const startX = Math.random() * (max - min) + min;
    const endX = Math.max(5, Math.min(95, startX + (Math.random() - 0.5) * drift));
    return { startX, endX };
}; 