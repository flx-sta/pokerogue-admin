export interface DiscordUser {
  id: number
  username: string
  discriminator: number
  avatar: string
  bot: boolean
  banner: string
  accent_color: number
  global_name: string
  public_flags: number
}
