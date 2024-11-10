import { useEffect, useState } from "react"
import styles from "./timer.module.css"

type TimerProps = {
  duration: number // in seconds
  isActive: boolean
}

export default function Timer(props: TimerProps) {
  const [time, setTime] = useState(props.duration)

  useEffect(() => {
    if (props.isActive && time > 0) {
      setTimeout(() => {
        setTime(time - 1)
      }, 1000)
    }
  }, [time, props.isActive])

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