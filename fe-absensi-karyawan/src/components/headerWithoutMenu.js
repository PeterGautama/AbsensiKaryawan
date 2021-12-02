import React, { useState, useEffect } from "react"
import "../styles/components/misc/header.scss"
import "../fonts/font-awesome-4.7.0/css/font-awesome.min.css"

const IndexPage = props => {
  return (
    <div className="header">
      <div className="header-left">
        <span className="header-menu-text">{props.program_name}</span>
      </div>
      <div className="header-right">
        <div className="user">
          <span>Created by Peter Gautama</span>
        </div>
      </div>
    </div>
  )
}

export default IndexPage
