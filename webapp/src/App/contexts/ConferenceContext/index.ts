import { connect } from 'react-redux'
import { bindActionCreators, type Dispatch } from 'redux'
import { ActionType } from 'src/actions'
import { ConferenceContextProvider } from './ConferenceContext'

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

export default connect(null, mapDispatchToProps)(ConferenceContextProvider)
