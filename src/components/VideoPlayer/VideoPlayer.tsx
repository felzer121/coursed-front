import React from 'react'
import posterImg  from './poster.jpg'
import videoSrc from './video.mp4'
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import './style.css'
import { IconButton } from '@mui/material';
import PauseIcon from '@mui/icons-material/Pause';
import FullscreenIcon from '@mui/icons-material/Fullscreen';

const settings = [
  {
    durationSeconds: 50,
    name: 'Объявление темы'  
  },
  {
    durationSeconds: 250,
    name: 'Объявление темы'  
  },
  {
    durationSeconds: 300,
    name: 'Метод для компонента'   
  }
]

interface VideoPlayerProps {
  width?: number
  heigth?: number
}
interface videoArgType {
  durationSeconds: number
  name: string
  width: number
}
interface videoStatus {
  onPause: boolean
}


function toggleFullScreen(video) {
  console.log(video.current.fullscreenElement)
  if (!document.fullscreenElement &&    // alternative standard method
          !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {  // current working methods
          if (document.documentElement.requestFullscreen) {
                  document.documentElement.requestFullscreen();
          } else if (document.documentElement.msRequestFullscreen) {
                  document.documentElement.msRequestFullscreen();
          } else if (document.documentElement.mozRequestFullScreen) {
                  document.documentElement.mozRequestFullScreen();
          } else if (document.documentElement.webkitRequestFullscreen) {
                  document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
          }
  } 
  else {
          if (document.exitFullscreen) {
                  document.exitFullscreen();
          } else if (document.msExitFullscreen) {
                  document.msExitFullscreen();
          } else if (document.mozCancelFullScreen) {
                  document.mozCancelFullScreen();
          } else if (document.webkitExitFullscreen) {
                  document.webkitExitFullscreen();
          }
  }
}


const VideoPlayer = ({width, heigth}: VideoPlayerProps) => {

  const video = React.useRef<HTMLVideoElement | null>(null)
  const [duration, setDuration] = React.useState<number | null>(null)
  const [videoArg, setVideoArg] = React.useState<videoArgType[] | null>(null)
  const [videoStatus, setVideoStatus] = React.useState<videoStatus>({onPause: true})

  !!width ? width : width = 400

  React.useEffect(() => {
    if(!!video.current && !!duration) {
      video.current.controls = false;
      setVideoArg(settings.map(item => {
          return {...item, width: item.durationSeconds / (duration / 100)}
      }))
    }
  }, [duration])
  
  const handleLoadedMetadata = () => {
    const videoEl = video.current;
    if (!videoEl) return;
    setDuration(videoEl.duration)
    setVideoStatus({onPause: videoEl?.paused})
  };

  const handleController = (type: string) => {
    switch(type){
      case 'playPause' :
        !!video.current?.paused ? video.current?.play() : video.current?.pause()
        setVideoStatus({onPause: !!video.current?.paused})
        break;
      case 'fullscreen' :
        video?.current?.requestFullscreen()
    }
  }

  const handleProgress = (e) => {
    if(!!video.current) {
      var pos = (e.pageX  - (video.current.offsetLeft + video.current.offsetParent?.offsetLeft)) / video.current.offsetWidth;
		  video.current.currentTime = pos * video.current.duration;
    }
  }

  return (
    <> 
    <figure className="videoContainer" data-fullscreen="false" style={{width: width}}>
      <video src={videoSrc} ref={video} preload="metadata" controls poster={posterImg} onLoadedMetadata={handleLoadedMetadata}>
        <source src={videoSrc} type="video/mp4" />
      </video>
      {!!videoArg ? 
        <>
          <div className='videoBackground' />
          <div id="video-controls" className="controls" data-state="visible">
            <div className='progress' onClick={handleProgress}>
              {videoArg.map(item => (
                <div className='progress-bar-item' style={{width: `${item.width}%`}} />
              ))}
            </div>
            <div>
              <IconButton data-state="play" onClick={()=>handleController('playPause')}>
                {videoStatus?.onPause ? <PlayArrowIcon style={{color: '#fff'}} /> :
                <PauseIcon style={{color: '#fff'}} />}
              </IconButton>
              <IconButton data-state="fullscreen" onClick={()=>handleController('fullscreen')}>
                <FullscreenIcon />
              </IconButton>
            </div>
            
            {/* <button id="stop" type="button" data-state="stop">Stop</button> */}
            {/* <button id="mute" type="button" data-state="mute">Mute/Unmute</button>
            <button id="volinc" type="button" data-state="volup">Vol+</button>
            <button id="voldec" type="button" data-state="voldown">Vol-</button>
            <button id="fs" type="button" data-state="go-fullscreen">Fullscreen</button> */}
          </div>
        </> : <div>Load</div>}
    </figure>
    </>
    
  )
}

export { VideoPlayer }
