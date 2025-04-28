type Modes = Record<string, boolean>

export function classNames(cls: string, mods: Modes, additional: string[] = []): string {
    return [
        cls,
        ...additional.filter(Boolean),
        ...Object.entries(mods)
            .filter(([, value]) => Boolean(value))
            .map(([className]) => className)
    ].join(' ')
}
