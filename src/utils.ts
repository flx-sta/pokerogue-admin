import { $settings } from './stores/settingsStore'

export function getCookie(name: string): string {
  const nameStr = `${name}=`
  const ca = document.cookie.split(';')
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === ' ') {
      c = c.substring(1)
    }
    if (c.indexOf(nameStr) === 0) {
      return c.substring(nameStr.length, c.length)
    }
  }
  return ''
}

export function setCookie(name: string, value: string): void {
  const expiration = new Date()
  expiration.setTime(new Date().getTime() + 3600000 * 24 * 30 * 3 /*7*/)
  document.cookie = `${name}=${value};Secure;SameSite=Strict;Domain=${window.location.hostname};Path=/;Expires=${expiration.toUTCString()}`
}

export function formatDate(
  date?: string | Date | null,
  options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' },
): string {
  if (!date) return 'n/a'
  return new Date(date).toLocaleDateString($settings.get().locale, options)
}

export function formatNumber(n: number, options: Intl.NumberFormatOptions = {}): string {
  return new Intl.NumberFormat($settings.get().locale, options).format(n)
}

export function debounce(fn: (...args: unknown[]) => void, delay = 300) {
  let timeout = -1

  return (...args: unknown[]) => {
    window.clearTimeout(timeout)
    timeout = window.setTimeout(() => fn(...args), delay)
  }
}
