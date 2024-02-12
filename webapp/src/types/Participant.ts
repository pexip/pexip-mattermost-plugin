export interface Participant {
  api_url: string
  buzz_time: number
  call_direction: 'in' | 'out'
  call_tag: string
  disconnect_supported: 'YES' | 'NO'
  display_name: string
  encryption: 'On' | 'Off'
  external_node_uuid: string
  fecc_supported: 'YES' | 'NO'
  has_media: boolean
  is_audio_only_call: 'YES' | 'NO'
  is_external: boolean
  is_idp_authenticated: boolean
  is_main_video_dropped_out: boolean
  is_muted: 'YES' | 'NO'
  is_presenting: 'YES' | 'NO'
  is_streaming_conference: boolean
  is_video_call: 'YES' | 'NO'
  is_video_muted: boolean
  is_video_silent: boolean
  local_alias: string
  mute_supported: 'YES' | 'NO'
  needs_presentation_in_mix: boolean
  overlay_text: string
  presentation_supported: 'YES' | 'NO'
  protocol: 'api' | 'webrtc' | 'sip' | 'rtmp' | 'h323' | 'mssip'
  role: 'chair' | 'guest'
  room_id: number
  rx_presentation_policy: 'ALLOW' | 'DENY'
  service_type: 'connecting' | 'waiting_room' | 'ivr' | 'conference' | 'lecture' | 'gateway' | 'test_call'
  live_captions: boolean
  spotlight: number
  start_time: number
  transfer_supported: 'YES' | 'NO'
  uri: string
  uuid: string
  vendor: string
}
