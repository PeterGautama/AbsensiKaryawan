import * as React from "react"
import "../styles/global.scss"
import WaitLogo from "../images/wait.gif"

const IndexPage = props => {
  return (
    <div className={(props && props.loading ? "block" : "") + " wait"}>
        <img id="imageLoading" src={WaitLogo} alt="wait" />
    </div>
  )
}

export default IndexPage
