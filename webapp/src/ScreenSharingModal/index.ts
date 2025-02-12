import { connect } from 'react-redux'
import { bindActionCreators, type Dispatch } from 'redux'
import { ScreenSharingModal } from './component/ScreenSharingModal'
import { type GlobalState } from 'mattermost-redux/types/store'
import { ActionType } from '../actions'
import manifest from '../../../plugin.json'
import { type State } from '../state'

const mapStateToProps = (state: GlobalState): any => {
  const pluginId = manifest.id
  const pluginState = (state as any)[`plugins-${pluginId}`] as State
  return {
    show: pluginState.showScreenSharingModal
  }
}

const mapDispatchToProps = (dispatch: Dispatch): any =>
  bindActionCreators(
    {
      onHide: () => (dispatch: Dispatch) => {
        dispatch({
          type: ActionType.HideScreenSharingModal
        })
      },
      onShare: (sourceId: string) => (dispatch: Dispatch) => {
        dispatch({
          type: ActionType.StartScreenSharing,
          payload: sourceId
        })
      }
    },
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(ScreenSharingModal)
