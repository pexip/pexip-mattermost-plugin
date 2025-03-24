import type { Channel } from 'mattermost-redux/types/channels'

export type ChannelWithChecked = Channel & { checked: boolean }
