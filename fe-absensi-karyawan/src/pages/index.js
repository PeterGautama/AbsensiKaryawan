import React, { useState, useEffect } from "react"
import Seo from "../components/seo"
import HeaderWithoutMenu from "../components/headerWithoutMenu"
import Api from "../api/auth"
import MetaTags from 'react-meta-tags'
import Loading from '../components/loading'
import moment from "moment"
import base64 from "react-native-base64"
import "../styles/manage-absent.scss"
import "../styles/button.scss"
import AbsentLogo from "../images/absent_logo.png"
import { navigate } from "gatsby"

const IndexPage = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [inputID, setInputID] = useState("")
  const [inputPassword, setInputPassword] = useState("")

  useEffect(() => {
    let SESS1 = localStorage.getItem("xa")
	let SESS2 = localStorage.getItem("xb")
	if (SESS1 && SESS2) {
		setIsLoading(true)
		Api.check_session({
			xx: base64.decode(localStorage.getItem("xa")),
			yy: base64.decode(localStorage.getItem("xb")),
		}).then(res => {
			if (res.data.status == "SUCCESS") {
				setIsLoading(false)
				if(res.data.access_level=='Staff'){
					navigate("/user/manage-absent")
				} else if(res.data.access_level=='Admin'){
					navigate("/admin/master-employee")
				}
			} else {
				setIsLoading(false)
			}
		})
	} else {
		setIsLoading(false)
	}
  }, [])

  const submitLogin = () => {
    if(inputID == "" || inputPassword == ""){
      alert("All fields are required!")
      return
    }

    setIsLoading(true)
	Api.check_login({
		xx: inputID,
		yy: inputPassword,
	}).then(res => {
		console.log(res)
		if (res.data.status=='SUCCESS') {
			setIsLoading(false)
			document.getElementById("myForm").reset()
			localStorage.setItem( "xa", base64.encode(res.data.data[0].EMPLOYEE_ID))
			localStorage.setItem( "xb", base64.encode(res.data.data[0].ABSENT_PASS))

			if(res.data.data[0].ABSENT_ACCESS=='Staff'){
				navigate("/user/manage-absent")
			} else if(res.data.data[0].ABSENT_ACCESS=='Admin'){
				navigate("/admin/master-employee")
			}
		} else {
			setIsLoading(false)
			alert("Invalid Employee ID and/or Password!")
		}
	})
  }

  return (
    <div>
      <MetaTags>
        <meta name="viewport" content="width=1024"/>
      </MetaTags>
      <Seo title="Login" />
      <div className="layout">
        <HeaderWithoutMenu program_name="Absent System" />
        <Loading loading={isLoading} />
        <div className="content">
          <div className="pageContainer">
            <div className="boxContainer">
                <img src={AbsentLogo} />
                <h1>Login</h1>
                <hr/>
                <div className="boxContentLeft">
                  <form id="myForm" autoComplete="off">
                    <input type="text" onChange={e => setInputID(e.target.value)} placeholder="ID"/>
                    <br/><br/>
                    <input type="password" onChange={e => setInputPassword(e.target.value)} placeholder="Password"/>
                  </form>
                </div>
                <div className="boxContentCenter">
                    <div className="button" onClick={() => submitLogin()} >
                        <span>LOGIN</span>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default IndexPage
