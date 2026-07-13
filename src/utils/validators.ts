export const isEmpty = (value: string) => value.trim().length === 0

export const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
