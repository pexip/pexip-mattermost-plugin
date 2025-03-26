export interface ConferenceConfig {
  node: string
  displayName: string
  vmrPrefix: string
  hostPin: string
  filterChannels: {
    enabled: boolean
    allowedChannels: string[]
  }
}
