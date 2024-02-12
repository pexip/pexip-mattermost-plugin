import { ClientCallType, createCallSignals, createInfinityClient, createInfinityClientSignals } from '@pexip/infinity'
import { ConferenceActionType, type ConferenceAction } from '../ConferenceAction'

export const connect = async (dispatch: React.Dispatch<ConferenceAction>): Promise<void> => {
  const clientSignals = createInfinityClientSignals([])
  const callSignals = createCallSignals([])
  const client = createInfinityClient(clientSignals, callSignals)

  const response = await client.call({
    conferenceAlias: '',
    displayName: '',
    bandwidth: 0,
    callType: ClientCallType.AudioVideo
  })

  if (response?.status === 200) {
    dispatch({
      type: ConferenceActionType.Connected,
      body: {
        client
      }
    })
  } else {
    dispatch({
      type: ConferenceActionType.Error,
      body: {
        error: 'Cannot connect'
      }
    })
  }
}
