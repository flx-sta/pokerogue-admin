export interface DailyRun {
  username: string
  date: string
  score: number
  wave: number
  deleted: boolean
  deletedAt: string | null
  deletedByDiscordId: string | null
}

export interface DailyRunWithId extends DailyRun {
  id: string
}
