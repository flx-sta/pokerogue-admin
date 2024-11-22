import { atom } from 'nanostores'

export const $pageTitle = atom('')

export function setPageTitle(title: string) {
  $pageTitle.set(title)
}
