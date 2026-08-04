import { useEffect, useRef, useState } from 'react'
import type { MouseEvent } from 'react'
import { PlayIcon } from './icons'
import { getYoutubeId } from '../../utils/youtube'
import styles from './VideoPlayer.module.css'

type VideoPlayerProps = {
  src: string
  poster?: string
  initialProgress?: number
  onProgressChange?: (progress: number) => void
}

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return '00:00'
  const minutes = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

export function VideoPlayer({ src, poster, initialProgress = 0, onProgressChange }: VideoPlayerProps) {
  const youtubeId = getYoutubeId(src)
  const videoRef = useRef<HTMLVideoElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    const video = videoRef.current
    if (!video || !initialProgress) return

    function seekToInitialProgress() {
      if (video && video.duration) {
        video.currentTime = (initialProgress / 100) * video.duration
      }
    }
    video.addEventListener('loadedmetadata', seekToInitialProgress)
    return () => video.removeEventListener('loadedmetadata', seekToInitialProgress)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src])

  function togglePlay() {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      video.play()
    } else {
      video.pause()
    }
  }

  function handleSeek(event: MouseEvent<HTMLDivElement>) {
    const video = videoRef.current
    const track = trackRef.current
    if (!video || !track || !duration) return
    const rect = track.getBoundingClientRect()
    const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width))
    video.currentTime = ratio * duration
  }

  const percent = duration ? (currentTime / duration) * 100 : initialProgress

  const lastReportedRef = useRef(initialProgress)
  useEffect(() => {
    if (!onProgressChange || !duration) return
    const rounded = Math.round(percent)
    if (Math.abs(rounded - lastReportedRef.current) >= 5) {
      lastReportedRef.current = rounded
      onProgressChange(rounded)
    }
  }, [percent, duration, onProgressChange])

  if (youtubeId) {
    return (
      <div className={styles.player}>
        <iframe
          className={styles.video}
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}`}
          title="Vídeo da aula"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    )
  }

  return (
    <div className={styles.player}>
      <video
        ref={videoRef}
        className={styles.video}
        src={src}
        poster={poster}
        onClick={togglePlay}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
      />

      <span className={styles.progressBadge}>{Math.round(percent)}% concluído</span>

      {!playing && (
        <button type="button" className={styles.playButton} onClick={togglePlay} aria-label="Reproduzir">
          <PlayIcon />
        </button>
      )}

      <div className={styles.controls}>
        <div className={styles.seekTrack} ref={trackRef} onClick={handleSeek}>
          <div className={styles.seekFill} style={{ width: `${percent}%` }} />
        </div>
        <div className={styles.timeRow}>
          <span className={styles.time}>{formatTime(currentTime)}</span>
          <span className={styles.time}>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  )
}
