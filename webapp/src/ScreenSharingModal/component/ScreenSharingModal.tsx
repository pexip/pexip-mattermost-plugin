import React, { useEffect, useState } from 'react'
import { Icon, IconTypes } from '@pexip/components'

import './ScreenSharingModal.scss'

export interface DesktopCaptureSource {
  id: string
  name: string
  thumbnailURL: string
}

interface ScreenSharingModalProps {
  show: boolean
  onHide: () => void
  onShare: (sourceId: string | null) => void
}

export const ScreenSharingModal = (props: ScreenSharingModalProps): JSX.Element => {
  const [sources, setSources] = useState<DesktopCaptureSource[]>([])
  const [selected, setSelected] = useState<string | null>(null)

  const modalRef = React.createRef<HTMLDivElement>()

  const handleShare = (): void => {
    props.onHide()
    props.onShare(selected)
  }

  useEffect(() => {
    const payload = {
      types: ['window', 'screen'] as Array<'screen' | 'window'>,
      thumbnailSize: {
        width: 400,
        height: 400
      }
    }

    ;(window as any).desktopAPI?.getDesktopSources(payload).then((sources: DesktopCaptureSource[]) => {
      setSources(sources.sort((a, b) => a.id.localeCompare(b.id)))
    })
  }, [props.show])

  useEffect(() => {
    if (sources.length > 0) {
      setSelected(sources[0].id)
    }
  }, [sources])

  const sourcesComponent = sources.map((source) => {
    return (
      <button
        className='SourceButton style--none'
        key={source.id}
        onClick={() => {
          setSelected(source.id)
        }}
      >
        <div className={`SourceThumbnail ${source.id === selected ? 'selected' : ''}`}>
          <img
            style={{
              height: '100%'
            }}
            src={source.thumbnailURL}
          />
        </div>
        <span className='SourceLabel'>{source.name}</span>
      </button>
    )
  })

  if (!props.show) {
    return <></>
  }

  return (
    <div className='ScreenSharingModal' data-testid='ScreenSharingModal' onClick={props.onHide}>
      <div
        className='Modal'
        data-testid='ScreenSharingModalInner'
        ref={modalRef}
        onClick={(e) => {
          e.stopPropagation()
        }}
      >
        <div className='Header'>
          <span className='Title'>Choose what to share</span>
          <button className='ModalCloseButton style--none' data-testid='ScreenSharingModalClose' onClick={props.onHide}>
            <Icon source={IconTypes.IconClose} />
          </button>
        </div>
        <hr className='Divider' />
        <div className='Body'>{sourcesComponent}</div>
        <hr className='Divider' />
        <div className='Footer'>
          <button className='CancelButton style--none' data-testid='ScreenSharingModalCancel' onClick={props.onHide}>
            Cancel
          </button>
          <button className='ShareButton style--none' data-testid='ScreenSharingModalShare' onClick={handleShare}>
            Share
          </button>
        </div>
      </div>
    </div>
  )
}
