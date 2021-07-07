export function getKeys<T>(x: T): (keyof T)[] {
    return Object.keys(x) as (keyof T)[]
}
