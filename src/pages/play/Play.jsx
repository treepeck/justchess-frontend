import styles from "./play.module.css"

import { useAuth } from "../../context/useAuth"

import WS from "../../api/ws"

import {
  useState,
  useEffect,
} from "react"
import { useParams } from "react-router-dom"

export default function Play() {
  const { id } = useParams()



  const { user } = useAuth()

  return (
    <div className="mainContainer">
      <div className={styles.contentContainer}>
        Play page, game id: {id}
      </div>
    </div>
  )
}