import { useEffect, useRef, useState } from "react"
import styles from "./timer.module.css"

type TimerProps = {
  duration: number // in seconds
  isActive: boolean
}

export default function Timer(props: TimerProps) {
  const [time, setTime] = useState(props.duration)
  const startTimeRef = useRef<number | null>(null)
  const requestRef = useRef<number | null>(null)

  useEffect(() => {
    if (props.isActive && time > 0) {
      startTimeRef.current = Date.now()
      requestRef.current = requestAnimationFrame(redrawTime)
    } else if (!props.isActive) {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
        requestRef.current = null
      }
    }

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [props.isActive])

  function redrawTime() {
    if (!startTimeRef.current) {
      return
    }

    const now = Date.now()
    const elapsedTime = Math.floor((now - startTimeRef.current) / 1000)
    const remainingTime = Math.max((props.duration - elapsedTime), 0)

    setTime(remainingTime)

    requestRef.current = requestAnimationFrame(redrawTime)
  }

  function formatTime(s: number): string {
    const secs = s % 60
    const mins = Math.floor(s / 60)
    return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  function getClassName(): string {
    let className = styles.timer
    if (props.isActive) {
      className = styles.active
    }
    return className
  }

  return (
    <div className={getClassName()} style={{ color: time <= 30 ? "red" : "white" }}>
      {formatTime(time).split("").map((char, index) => (
        <span key={index} className={styles.digit}>
          {char}
        </span>
      ))}
    </div>
  )
}