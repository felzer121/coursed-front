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
    start: 0,
    description: 'Объявление темы'  
  },
  {
    start: 50,
    description: 'Объявление темы'  
  },
  {
    start: 250,
    description: 'Метод для компонента'   
  }
]

interface VideoPlayerProps {
  width?: number
  heigth?: number
}
interface videoArgType {
  start: number
  description: string
  width: number
}
interface videoStatus {
  onPause: boolean
}


function toggleFullScreen(video) {
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


function formatTime(timeInSeconds) {
  const result = new Date(timeInSeconds * 1000).toISOString().substr(11, 8);

  return {
    minutes: result.substr(3, 2),
    seconds: result.substr(6, 2),
  };
};

const VideoPlayer = ({width, heigth}: VideoPlayerProps) => {

  const video = React.useRef<HTMLVideoElement | null>(null)
  const [duration, setDuration] = React.useState<number | null>(null)
  const [videoArg, setVideoArg] = React.useState<videoArgType[] | null>(null)
  const [videoStatus, setVideoStatus] = React.useState<videoStatus>({onPause: true})
  const [currentTime, setCurrentTime] = React.useState<number>(0)

  !!width ? width : width = 400

  React.useEffect(() => {
    if(!!video.current && !!duration) {
      video.current.controls = false;
      setVideoArg(settings.map((item, index) => { 
        let end = 0
        const start = item.start
        if(settings.length-1 === index)
          end = duration
        else 
          end = settings[index + 1].start
        return {...item, width: (end - start) / (duration / 100)}
      }))
    }
  }, [duration])
  
  const viewsElem = (index: number): any => {
    let end = 0
    const start = settings[index].start
      if(settings.length-1 === index)
        end = duration
      else 
        end = settings[index + 1].start
      let width = (currentTime - start) / ((end - start) / 100)
      width = width > 100 ? 100 : width < 0 ? 0 : width
      return {width: `${width}%`}
  }


  if(!!video.current)
    video.current.ontimeupdate = (event) => {
      setCurrentTime(event.target.currentTime)
    };
  
  const handleLoadedMetadata = () => {
    const videoEl = video.current;
    if (!videoEl) return;
    setDuration(videoEl.duration)
    setVideoStatus({onPause: videoEl?.paused})
  };

  const getTime = (duration: number) => {
    const videoDuration = Math.round(duration);
    const time = formatTime(videoDuration);
    return `${time.minutes}:${time.seconds}`;
  }

  const handleController = (type: string) => {
    switch(type) {
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
      const pos = (e.pageX  - (video.current.offsetLeft + video.current.offsetParent?.offsetLeft)) / video.current.offsetWidth;
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
              {videoArg.map((item, index) => (
                <div className='progress-bar-item' style={{width: `${item.width}%`}} >
                  <div style={{...viewsElem(index), background: 'red', height: '100%'}} />
                </div>
              ))}
            </div>
            <div className='video-controllers'>
              <div>
                <IconButton data-state="play" onClick={()=>handleController('playPause')}>
                  {videoStatus?.onPause ? <PlayArrowIcon style={{color: '#fff'}} /> :
                  <PauseIcon style={{color: '#fff'}} />}
                </IconButton>
                <span>{getTime(currentTime)} / </span>
                <span>{getTime(duration)}</span>
              </div>
              <IconButton data-state="fullscreen" onClick={()=>handleController('fullscreen')}>
                <FullscreenIcon style={{color: '#fff'}} />
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
