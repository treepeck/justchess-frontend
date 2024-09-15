import styles from "./miniprofile.module.css"

import profile from "../../assets/profile.png"

/**
 * Displays username, rating and extended info on click. 
 * @param {User} user 
 */
export default function ({ user, control }) {
  return (
    <div className={styles.miniprofile}>
      <img src={profile} alt="profile" />
      {user?.username}
      {user ? user[`${control}Rating`] : null}
    </div>
  )
}