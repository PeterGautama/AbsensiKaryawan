import * as React from "react"
import "../styles/components/misc/logout.scss"

export default function Logout() {
  const handleLogout = (program_path) => {
    localStorage.clear()
    window.location.href = process.env.GATSBY_FRONTEND_URL + "/"
  }

  return (
    <div
      className="logout"
      onClick={() => handleLogout()}
    >
      <span className="icon-logout"></span>
      <span>Logout</span>
    </div>
  )
}
