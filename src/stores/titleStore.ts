import { atom } from 'nanostores'

export const $title = atom('')

export function setTitle(title: string) {
  $title.set(title)
}
