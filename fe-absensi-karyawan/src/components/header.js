import React, { useState, useEffect } from "react"
import Drawer from "@material-ui/core/Drawer"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import Logout from "./logout"
import "../styles/components/misc/header.scss"
import "../fonts/font-awesome-4.7.0/css/font-awesome.min.css"
import ApiUser from "../api/auth"
import base64 from "react-native-base64"
import { connect } from "react-redux"
import * as userActions from "../redux/actions/userActions"
import { bindActionCreators } from "redux"
import { navigate } from "gatsby"

const Header = props => {
  const [drawer, setDrawer] = useState(false)
  const [menulist, setMenuList] = useState(false)
  const [user, setUser] = useState(false)

  useEffect(() => {
    let search = window.location.search
    let params = new URLSearchParams(search)
    let id = atob(params.get("userid")).trim()
    let code = atob(params.get("apk")).trim()
    props.setIsLoading(true)

    let SESS1 = localStorage.getItem("xa")
    let SESS2 = localStorage.getItem("xb")
    if (SESS1 && SESS2) {
      ApiUser.check_session({
        xx: base64.decode(localStorage.getItem("xa")),
        yy: base64.decode(localStorage.getItem("xb")),
      }).then(res => {
        if (res.data.status == "SUCCESS") {
          setUser(res.data.user_name)
          ApiUser.get_program_list({xx: res.data.access_level}).then(res => {
            setMenuList(res.data)
            props.setIsLoading(false)
          })
        } else {
          props.setIsLoading(false)
          alert("Please login first!")
          navigate("/")
        }
      })
    } else {
      props.setIsLoading(false)
      alert("Please login first!")
      navigate("/")
    }
  }, [])

  const handleClickMenu = (program_path) => {
    window.location.href = process.env.GATSBY_FRONTEND_URL + "/" + program_path
  }

  return (
    <div className="header">
      <div className="header-left">
        <span onClick={() => setDrawer(!drawer)} className="icon-menu"><i className="fa fa-bars"></i></span>
        <span className="header-menu-text">{props.program_name}</span>
        <Drawer anchor="left" open={drawer} onClose={() => setDrawer(!drawer)}>
          <List
            classes={{
              padding: "drawer-max-width",
            }}
          >
            {menulist.length > 0 &&
              menulist.map((val, index) => (
                <ListItem button key={index}>
                  <ListItemText
                    primary={val.PROGRAM_NAME}
                    classes={{
                      primary: "drawer-text",
                    }}
                    onClick={() => handleClickMenu(val.PROGRAM_PATH)}
                  />
                </ListItem>
              ))}
          </List>
        </Drawer>
      </div>
      <div className="header-right">
        <div className="user">
          <span className="icon-user"><i className="fa fa-user"></i></span>
          <span>&nbsp;&nbsp;{user}&nbsp;</span>
        </div>
        <Logout />
      </div>
    </div>
  )
}

function mapDispatchToProps(dispatch) {
  return {
    userActions: bindActionCreators(userActions, dispatch),
  }
}

export default connect(null, mapDispatchToProps)(Header)
