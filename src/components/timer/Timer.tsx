import "./Timer.css"
import { useEffect, useRef, useState } from "react"

type TimerProps = {
  dur: number // duration in seconds
  ia: boolean // is active
}

export default function Timer({ dur, ia }: TimerProps) {
  const [time, setTime] = useState(dur)
  const startTimeRef = useRef<number | null>(null)
  const requestRef = useRef<number | null>(null)

  useEffect(() => {
    setTime(dur)
  }, [dur])

  useEffect(() => {
    if (ia && time > 0) {
      startTimeRef.current = Date.now()
      requestRef.current = requestAnimationFrame(redrawTime)
    } else if (!ia) {
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
  }, [ia])

  function redrawTime() {
    if (!startTimeRef.current) {
      return
    }

    const now = Date.now()
    const elapsedTime = Math.floor((now - startTimeRef.current) / 1000)
    const remainingTime = Math.max((dur - elapsedTime), 0)

    setTime(remainingTime)

    requestRef.current = requestAnimationFrame(redrawTime)
  }

  function formatTime(s: number): string {
    const secs = s % 60
    const mins = Math.floor(s / 60)
    return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  function getClassName(): string {
    let className = "timer"
    if (ia) {
      className = "active"
    }
    return className
  }

  return (
    <div className={getClassName()} style={{
      color: time <= 30 &&
        ia ? "red" : "white"
    }}>
      {formatTime(time).split("").map((char, index) => (
        <div key={index} className="digit">
          {char}
        </div>
      ))}
    </div>
  )
}