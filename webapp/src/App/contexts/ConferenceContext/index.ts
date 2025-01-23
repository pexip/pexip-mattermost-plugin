import { connect } from 'react-redux'
import { bindActionCreators, type Dispatch } from 'redux'
import { ActionType } from 'src/actions'
import { ConferenceContextProvider } from './ConferenceContext'
import { type GlobalState } from 'mattermost-redux/types/store'
import manifest from '../../../../../plugin.json'
import { type State } from 'src/state'

const mapStateToProps = (state: GlobalState): any => {
  const pluginId = manifest.id
  const pluginState = (state as any)[`plugins-${pluginId}`] as State

  return {
    screenSharingSourceId: pluginState.screenSharingSourceId
  }
}

const mapDispatchToProps = (dispatch: Dispatch): any =>
  bindActionCreators(
    {
      onShowScreenSharingModal: () => (dispatch: Dispatch) => {
        dispatch({
          type: ActionType.ShowScreenSharingModal
        })
      }
    },
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(ConferenceContextProvider)
