export interface DailyRun {
  username: string
  date: string
  score: number
  wave: number
  deleted: boolean
  deletedAt: string | null
  deletedByDiscordId: string | null
}
