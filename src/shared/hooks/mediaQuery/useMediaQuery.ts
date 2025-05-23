"use client"
import { useState, useEffect, useMemo } from "react";
import { MEDIA_QUERIES, type MediaQueryKey } from '@/shared/constants/breakpoints';

const getMatches = (query: string): boolean => {
    if (typeof window !== 'undefined') {
        return window.matchMedia(query).matches;
    }
    return false;
}

// Хук с готовыми медиа-запросами
export function useMediaQuery(queryKey: MediaQueryKey): boolean;
// Хук с кастомным запросом
export function useMediaQuery(customQuery: string): boolean;
export function useMediaQuery(queryOrKey: MediaQueryKey | string): boolean {
    const query = useMemo(() => {
        const result = queryOrKey in MEDIA_QUERIES 
            ? MEDIA_QUERIES[queryOrKey as MediaQueryKey]
            : queryOrKey;
        return result;
    }, [queryOrKey]);

    const [matches, setMatches] = useState(() => {
        // Инициализируем сразу правильным значением если на клиенте
        return typeof window !== 'undefined' ? getMatches(query) : false;
    });

    useEffect(() => {
        // Проверяем только если мы на клиенте
        if (typeof window === 'undefined') return;

        const mediaQuery = window.matchMedia(query);
        const handleChange = () => setMatches(mediaQuery.matches);
        
        // Устанавливаем текущее значение
        setMatches(mediaQuery.matches);
        
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [query]);

    return matches;
}

// Хуки для популярных breakpoints
export const useIsMobile = () => useMediaQuery('mobile');
export const useIsTablet = () => useMediaQuery('tablet');
export const useIsDesktop = () => useMediaQuery('desktop');
export const useIsTouchDevice = () => useMediaQuery('touch');
export const useReducedMotion = () => useMediaQuery('reducedMotion');