import React, { useState, useEffect } from "react"
import Seo from "../../components/seo"
import Header from "../../components/header"
import Api from "../../api/auth"
import MetaTags from 'react-meta-tags'
import Loading from '../../components/loading'
import moment from "moment"
import base64 from "react-native-base64"
import "../../styles/manage-absent.scss"
import "../../styles/button.scss"
import AbsentLogo from "../../images/absent_logo.png"
import { navigate } from "gatsby"

const IndexPage = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [inputCurrentPassword, setInputCurrentPassword] = useState("")
  const [inputNewPassword, setInputNewPassword] = useState("")
  const [inputConfirmNewPassword, setInputConfirmNewPassword] = useState("")
  const [form, setForm] = React.useState({})

  useEffect(() => { }, [])

  const updatePassword = param_objForm => {
    let SESS1 = localStorage.getItem("xa")
	let SESS2 = localStorage.getItem("xb")
	if (SESS1 && SESS2) {
		setIsLoading(true)
		Api.check_session({
			xx: base64.decode(localStorage.getItem("xa")),
			yy: inputCurrentPassword,
		}).then(res => {
			if (res.data.status == "SUCCESS") {
				Api.change_password({
                    xx: base64.decode(localStorage.getItem("xa")),
                    yy: inputNewPassword,
                }).then(response => {
                    localStorage.setItem("xb", base64.encode(inputNewPassword))
                    document.getElementById("pwd-form").reset()
                    setInputCurrentPassword("")
                    setInputNewPassword("")
                    setInputConfirmNewPassword("")
                    setIsLoading(false)
                    alert(response.data.status)
				})
			} else {
                document.getElementById("pwd-form").reset()
                setInputCurrentPassword("")
                setInputNewPassword("")
                setInputConfirmNewPassword("")
				setIsLoading(false)
                alert("Your Current Password is wrong!")
			}
		})
	} else {
        alert('Session timeout!')
		localStorage.clear()
        setIsLoading(false)
        navigate("/")
	}
  }

  const handleSubmit = () => {
    setIsLoading(true)

    let objForm = form

    if (
      !inputCurrentPassword ||
      !inputNewPassword ||
      !inputConfirmNewPassword
    ) {
      document.getElementById("pwd-form").reset()
      setInputCurrentPassword("")
      setInputNewPassword("")
      setInputConfirmNewPassword("")
      alert(
        "Please fill all required fields!"
      )
    } else {
      if (
        inputCurrentPassword ===
        base64.decode(localStorage.getItem("xb"))
      ) {
        if (inputNewPassword === inputConfirmNewPassword) {
          updatePassword(objForm)
        } else {
          document.getElementById("pwd-form").reset()
          setInputCurrentPassword("")
          setInputNewPassword("")
          setInputConfirmNewPassword("")
          alert(
            "New Password must equal with Confirm New Password!"
          )
        }
      } else {
        document.getElementById("pwd-form").reset()
        setInputCurrentPassword("")
        setInputNewPassword("")
        setInputConfirmNewPassword("")
        alert("Your Current Password is wrong!")
      }
    }

    setIsLoading(false)
  }

  return (
    <div>
      <MetaTags>
        <meta name="viewport" content="width=1024"/>
      </MetaTags>
      <Seo title="Change Password" />
      <div className="layout">
        <Header
          program_name="Change Password"
          setIsLoading={bol => setIsLoading(bol)}
        />
        <Loading loading={isLoading} />
        <div className="content">
          <div className="pageContainer">
            <div className="boxContainer">
                <img src={AbsentLogo} />
                <h1>Change Password</h1>
                <hr/>
                <div className="boxContentLeft">
                  <form id="pwd-form" autoComplete="off">
                    <input type="password" onChange={e => setInputCurrentPassword(e.target.value)} placeholder="Current Password"/>
                    <br/><br/>
                    <input type="password" onChange={e => setInputNewPassword(e.target.value)} placeholder="New Password"/>
                    <br/><br/>
                    <input type="password" onChange={e => setInputConfirmNewPassword(e.target.value)} placeholder="Confirm New Password"/>
                  </form>
                </div>
                <div className="boxContentCenter">
                    <div className="button" onClick={() => handleSubmit()} >
                        <span>Submit</span>
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
