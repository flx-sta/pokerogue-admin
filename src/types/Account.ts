export interface Account {
  username: string
  registered: Date
  lastLoggedIn: Date | null
  lastActivity: Date | null
  banned: boolean
  trainerId: number | null
  secretId: number | null
  discordId: string | null
  googleId: string | null
}
