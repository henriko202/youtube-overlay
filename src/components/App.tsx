import Close from "assets/close.svg"
import Fullscreen from "assets/fullscreen.svg"
import logo from "assets/logo.svg"
import Pause from "assets/pause.svg"
import PiP from "assets/pic-in-pic.svg"
import play from "assets/play.svg"
import Volume from "assets/volume.svg"
import { MutableRefObject, useEffect, useRef, useState } from "react"
import { Rnd } from "react-rnd"
import YouTube, { YouTubePlayer, YouTubeProps } from "react-youtube"

import "./style.css"

/**
 * Extracts the Youtube video ID from a Youtube video URL
 * @param url The URL of the Youtube video
 * @returns The Youtube video ID (the part after the `v=` in the URL)  or an error if the URL is invalid
 */
export function extractYoutubeVideoId(url: string): string | Error {
  const regexRemoveURL: RegExp = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/
  const regexRemoveQueryParams: RegExp = /([?].*)|(&.*)/

  const match: RegExpMatchArray | null = url.match(regexRemoveURL)
  if (!match) throw new Error("Invalid Youtube URL")

  return match[1].replace(regexRemoveQueryParams, "")
}

/**
 * Returns the thumbnail URL of a Youtube video
 * @param url The URL of the Youtube video
 * @returns The thumbnail URL of the Youtube video or an error if the URL is invalid
 */
export function getThumbnailUrl(url: string): string | Error {
  const videoId: string | Error = extractYoutubeVideoId(url)

  if (!videoId) throw new Error("Invalid Youtube URL")

  return `https://img.youtube.com/vi/${videoId}/0.jpg`
}

/**
 * Returns the thumbnail URL of a Youtube video ID
 * @param url The Youtube video ID
 * @returns The thumbnail URL of the Youtube video or an error if the URL is null
 */
export function getThumbnailUrlFromId(videoId: string): string | Error {
  if (!videoId) throw new Error("Invalid Youtube URL")

  return `https://img.youtube.com/vi/${videoId}/0.jpg`
}

/**
 * Converts a duration in seconds to a string in the format `mm:ss:ms` or `hh:mm:ss`
 * @param duration The duration in seconds
 * @returns The duration in the format `mm:ss:ms` or `hh:mm:ss`
 */
export function msToTime(duration: number): string {
  let seconds: string | number = Math.floor((duration / 1000) % 60)
  let minutes: string | number = Math.floor((duration / (1000 * 60)) % 60)
  let hours: string | number = Math.floor((duration / (1000 * 60 * 60)) % 24)

  if (duration <= 0) return "00:00"

  hours = hours < 10 ? "0" + hours : hours
  minutes = minutes < 10 ? "0" + minutes : minutes
  seconds = seconds < 10 ? "0" + seconds : seconds

  if (hours === "00") return minutes + ":" + seconds
  else return hours + ":" + minutes + ":" + seconds
}

function App() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0)
  const [totalDuration, setTotalDuration] = useState(0)
  const [currentlyElapsed, setCurrentlyElapsed] = useState(0)
  const [onHoverSpyDuration, setOnHoverSpyDuration] = useState(0)

  const [modalProps, setModalProps] = useState({
    x: document.getElementById("root")!.getBoundingClientRect().width - 350,
    y: 10,
    width: 300,
    height: 280,
    isOpen: false,
    isDragging: false,
  })

  const videoId = "3fv0iVcCeh4"

  const playerRef: MutableRefObject<YouTubePlayer> = useRef()
  const tooltipRef: MutableRefObject<HTMLDivElement> = useRef() as MutableRefObject<HTMLDivElement>

  useEffect(() => {
    const interval = setInterval(async () => {
      if (!playerRef.current) return
      const elapsed_sec = await playerRef.current.getCurrentTime()

      setCurrentlyElapsed(elapsed_sec)
    }, 100)

    return () => {
      clearInterval(interval)
    }
  }, [])

  const opts: YouTubeProps["opts"] = {
    playerVars: {
      color: "white",
      controls: 0,
      enablejsapi: 1,
      rel: 0,
      autoplay: 0,
    },
    fullscreen: 1,
  }

  const onPlayerReady: YouTubeProps["onReady"] = (event) => {
    setVolume(event.target.getVolume())
    setTotalDuration(event.target.getDuration())

    playerRef.current = event.target
  }

  const makeFullscreen = () => {
    if (opts.fullscreen === 1) {
      const playerElement: HTMLElement | null = document.getElementById("Youtube-Pic-in-Pic-Player")
      if (!playerElement) return

      const requestFullScreen =
        playerElement.requestFullscreen || playerElement.requestFullscreen || playerElement.requestFullscreen

      if (requestFullScreen) {
        requestFullScreen.bind(playerElement)()
      }
    }
  }

  return (
    <div id="root" className="relative h-screen overflow-hidden bg-white">
      <div
        className={
          "relative h-[160px] w-[300px] bg-gray-950 shadow-xl " + (modalProps.isOpen ? "cursor-auto" : "cursor-pointer")
        }
        onClick={() => {
          setModalProps({ ...modalProps, isOpen: true })
        }}
      >
        {modalProps.isOpen && (
          <div
            className={
              "absolute left-1/2 top-1/2 z-10 flex h-full w-full -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center bg-black/25 text-sm font-bold text-white"
            }
          >
            <img src={PiP} alt="PiP" className="ml-2 h-[20px] w-[20px] invert" />
            This video is playing in picture in picture.
          </div>
        )}
        <div className="h-[160px] w-[300px]">
          <img
            className="h-[160px] w-[300px] object-cover object-center blur-[1px]"
            src={getThumbnailUrlFromId(videoId) as string}
            alt="thumbnail"
          />
        </div>
        {!modalProps.isOpen && (
          <>
            <div className="absolute left-1/2 top-1/2 h-[35px] w-[35px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gray-900 opacity-50" />
            <img
              className="absolute left-1/2 top-1/2 ml-[1.5px] h-[25px] w-[25px] -translate-x-1/2 -translate-y-1/2 opacity-90 invert"
              src={play}
              alt="play"
            />
          </>
        )}
        <div>
          <img className="absolute bottom-5 right-5 h-[20px] w-[85px]" src={logo} alt="logo" />
        </div>
      </div>

      {modalProps.isOpen && (
        <Rnd
          default={{
            x: modalProps.x,
            y: modalProps.y,
            width: modalProps.width,
            height: modalProps.height,
          }}
          minHeight={280}
          minWidth={300}
          bounds="window"
          onDragStart={() => {
            setModalProps({ ...modalProps, isDragging: true })
          }}
          onDragStop={() => {
            setModalProps({ ...modalProps, isDragging: false })
          }}
          onDrag={(_e, d) => {
            setModalProps({ ...modalProps, x: d.x, y: d.y })
          }}
          onResize={(_e, _direction, ref) => {
            setModalProps({
              ...modalProps,
              width: ref.offsetWidth,
              height: ref.offsetHeight,
            })
          }}
          dragHandleClassName="handle"
          className="z-10"
        >
          <div className="h-full w-full rounded-lg bg-cyan-700 pb-[52px] shadow-xl">
            <div className="flex justify-center">
              <div className="handle w-full cursor-move text-center font-bold text-gray-800">::::::::::</div>
              <div
                className="absolute right-0 top-0 z-50 h-[24px] w-[24px] cursor-pointer"
                onClick={() => {
                  setModalProps({ ...modalProps, isOpen: false })
                }}
              >
                <img className="h-[24px] w-[24px]" src={Close} alt="close" />
              </div>
            </div>

            {/* Youtube Container */}
            <div className="h-full w-full">
              {/* Para quando o drag for na parte de baixo da tela, se o mouse ir pra cima do iframe o drag dá problema */}
              {modalProps.isDragging && <div className="absolute h-[90%] w-full" />}

              <YouTube
                id="Youtube-Pic-in-Pic-Player"
                videoId={videoId}
                opts={opts}
                iframeClassName="rounded-lg h-full w-full"
                className="iframeContainer h-full w-full rounded-lg bg-cyan-700"
                onReady={onPlayerReady}
                loading="eager"
                onPlay={() => {
                  setIsPlaying(true)
                }}
                onPause={() => {
                  setIsPlaying(false)
                }}
              />
            </div>

            {/* Controles */}
            <div className="absolute z-50 flex w-full items-center justify-between py-1">
              {isPlaying ? (
                <img
                  className="h-[20px] w-[20px] cursor-pointer"
                  src={Pause}
                  alt="pause"
                  onClick={() => {
                    setIsPlaying(false)
                    playerRef.current.pauseVideo()
                  }}
                />
              ) : (
                <img
                  className="h-[20px] w-[20px] cursor-pointer"
                  src={play}
                  alt="play"
                  onClick={() => {
                    setIsPlaying(true)
                    playerRef.current.playVideo()
                  }}
                />
              )}

              {/* Slider de duração do vídeo */}
              <div className="flex w-full">
                <input
                  type="range"
                  min="0"
                  max={totalDuration}
                  value={currentlyElapsed}
                  onChange={(e) => {
                    setCurrentlyElapsed(parseInt(e.target.value))
                    playerRef.current.seekTo(parseInt(e.target.value))
                  }}
                  onMouseMove={(e: React.MouseEvent<HTMLDivElement>) => {
                    const width = e.currentTarget.clientWidth
                    const rect = e.currentTarget.getBoundingClientRect()
                    const x = e.clientX - rect.left
                    const hoverValue = (x / width) * totalDuration
                    setOnHoverSpyDuration(hoverValue)

                    tooltipRef.current.style.display = "block"
                    tooltipRef.current.style.left = `${x}px`
                  }}
                  onMouseLeave={() => {
                    tooltipRef.current.style.display = "none"
                  }}
                />
                <div id="tooltip" className="ml-[4px] whitespace-nowrap rounded-lg text-xs text-white" ref={tooltipRef}>
                  {msToTime(onHoverSpyDuration * 1000)}
                </div>
              </div>

              {/* Volume */}
              <div
                onMouseEnter={() => {
                  const volumeElement = document.getElementById("volume")!
                  volumeElement.style.opacity = "1"
                  volumeElement.style.visibility = "visible"
                }}
                onMouseLeave={() => {
                  const volumeElement = document.getElementById("volume")!
                  volumeElement.style.opacity = "0"
                  volumeElement.style.visibility = "hidden"
                }}
              >
                <img className="mx-1 h-[20px] w-[20px] cursor-pointer" src={Volume} alt="volume" />

                <div
                  id="volume"
                  className="invisible absolute mx-1 flex h-[20px] w-[100px] translate-x-[-40%] translate-y-[-400%] -rotate-90 select-none items-center rounded-md rounded-l-none bg-slate-700/50 px-1 align-middle opacity-0 transition-opacity"
                >
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(e) => {
                      setVolume(Number(e.target.value))
                      playerRef.current.setVolume(Number(e.target.value))
                    }}
                  />
                </div>
              </div>

              {/* Tela cheia */}
              <img
                className="mx-1 h-[20px] w-[20px] cursor-pointer"
                src={Fullscreen}
                alt="fullscreen"
                onClick={() => {
                  makeFullscreen()
                }}
              />
            </div>
          </div>
        </Rnd>
      )}
    </div>
  )
}

export default App
