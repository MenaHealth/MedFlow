// utils/classNames.ts
export function cn(...classes: Array<string | undefined | boolean>): string {
    return classes.filter((cls): cls is string => typeof cls === 'string' && Boolean(cls)).join(' ');
}
