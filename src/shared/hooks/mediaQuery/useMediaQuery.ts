"use client"
import { useState, useLayoutEffect, useEffect } from "react";

const getMatches = (query: string): boolean => {
    if (typeof window !== 'undefined') {
        return window.matchMedia(query).matches;
    }
    return false;
}

export function useMediaQuery(query: string): boolean | undefined {
    const [hasMatch, setHasMatch] = useState<boolean>(getMatches(query));
    const [initialLoad, setInitialLoad] = useState(true);

    useLayoutEffect(() => {
        if (initialLoad) {
            setInitialLoad(false);
        }
    }, [initialLoad])

    function handleChange() {
        setHasMatch(getMatches(query));
    }

    useEffect(() => {
        const matchMedia = window.matchMedia(query);
        handleChange();
        matchMedia.addEventListener('change', handleChange);
        return () => {
            matchMedia.removeEventListener('change', handleChange);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query])
    
    return initialLoad ? undefined : hasMatch;
}