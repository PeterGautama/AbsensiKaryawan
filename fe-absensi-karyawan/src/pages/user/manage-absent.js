import React, { useState, useEffect } from "react"
import Seo from "../../components/seo"
import Table from "../../components/table"
import Header from "../../components/header"
import Api from "../../api/user/manage-absent"
import ApiEmployee from "../../api/admin/absent-report"
import MetaTags from 'react-meta-tags'
import Loading from '../../components/loading'
import moment from "moment"
import base64 from "react-native-base64"
import "../../styles/manage-absent.scss"
import "../../styles/button.scss"
import AbsentLogo from "../../images/absent_logo.png"

const IndexPage = () => {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [fileAttachment, setFileAttachment] = useState("")
  const [popupImage, setPopupImage] = useState(false)
  const [popupImageFile, setPopupImageFile] = useState("")
  const [popupImageName, setPopupImageName] = useState("")
  var base64List = ""
  var attachment_name = ""

  useEffect(() => {
    Api.get_data({aa: base64.decode(localStorage.getItem('xa'))}).then(res => {
      setData(res.data)
      setIsLoading(false)
    })
  }, [])

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = error => reject(error)
    })
  }

  const submitAbsent = () => {
    var today = new Date()
    var time = today.getHours() + ":" + today.getMinutes()
      console.log(time.toString())

    if (fileAttachment == "" || !fileAttachment.value) {
        window.alert("File is required!")
        return
    }

    setIsLoading(true)
    base64List = ""

    if (
      fileAttachment.files[0].name.split(".").pop().toLowerCase() != "jpg" &&
      fileAttachment.files[0].name.split(".").pop().toLowerCase() != "jpeg" &&
      fileAttachment.files[0].name.split(".").pop().toLowerCase() != "png"
    ) {
      setIsLoading(false)
      alert("File extention must be .png, .jpg, or .jpeg!")
      return
    }

    attachment_name = fileAttachment.files[0].name

    if(attachment_name.length > 150){
      setIsLoading(false)
      alert("File name cannot be longer than 150 characters!")
      return
    }

    getBase64(fileAttachment.files[0]).then(data2 => {
        base64List = data2
        Api.insert_data({
            aa: data.ABSENT_STATUS,
            bb: data.EMPLOYEE_ID,
            cc: time.toString(),
            dd: base64.encode(base64List),
            ee: attachment_name, 
        }).then(response => {
          setFileAttachment("")
          if (!response.data.SUCCESS) {
            document.getElementById("myForm").reset()
            alert(response.data.MESSAGE)
            setIsLoading(false)
          } else {
            document.getElementById("myForm").reset()
            Api.get_data({aa: base64.decode(localStorage.getItem('xa'))}).then(res => {
                setData(res.data)
                setIsLoading(false)
            })
          }
        })
    })
  }

  const clickAttachment = (status) => {
    ApiEmployee.get_attachment({
        aa: moment().format("YYYY-MM-DD"),
        bb: data.EMPLOYEE_ID 
    }).then(res => {
        if(status=='Clock-In'){
            setPopupImageFile(base64.decode(res.data.ATTACHMENT_FILE_CLOCK_IN))
            setPopupImageName(data.ATTACHMENT_NAME_CLOCK_IN)
            setPopupImage(true)
        } else {
            setPopupImageFile(base64.decode(res.data.ATTACHMENT_FILE_CLOCK_OUT))
            setPopupImageName(data.ATTACHMENT_NAME_CLOCK_OUT)
            setPopupImage(true)
        }
    })
  }

  return (
    <div>
      <MetaTags>
        <meta name="viewport" content="width=1024"/>
      </MetaTags>
      <Seo title="Manage Absent" />
      <div className="layout">
        <Header
          program_name="Manage Absent"
          setIsLoading={bol => setIsLoading(bol)}
        />
        <Loading loading={isLoading} />
        <div
            className={
                "modal-popup history-popup " + (popupImage ? "modal-show" : "")
            }
        >
            <div
                className="modal-backdrop-dark"
                onClick={() => { setPopupImageFile(""); setPopupImageName(""); setPopupImage(false); }}
            ></div>
            <div className="modal-content">
                <span
                    className="icon-cancel"
                    onClick={() => { setPopupImageFile(""); setPopupImageName(""); setPopupImage(false); }}
                ><i className="fa fa-times"></i></span>
                <br/><br/>
                <h3>{popupImageName}</h3>
                <img className="imagePopup" src={popupImageFile}></img>
            </div>
        </div>
        <div className="content">
          <div className="pageContainer">
            <div className="boxContainer">
                <img src={AbsentLogo} />
                <h1>Absent System</h1>
                <hr/>
                <h2>{data.ABSENT_DATE ? moment(data.ABSENT_DATE).format('DD/MM/YYYY') : moment().format('DD/MM/YYYY')}</h2>
                <div className="boxContentLeft">
                    {(() => {
                        if(data.ABSENT_STATUS && data.ABSENT_STATUS != 'X1'){
                            return (
                                <>
                                    <div className="sameLine">
                                        ✅ Clock-In ({data.ABSENT_CLOCK_IN})
                                    </div>
                                    &nbsp;&nbsp;&nbsp;
                                    <div className="sameLine linkUrl" onClick={() => clickAttachment("Clock-In")}>
                                        View Image
                                    </div>
                                </>
                            )
                        } else {
                            return (
                                <>
                                    ❌ Clock-In
                                </>
                            )
                        }
                    })()} 
                    <br/>
                    {(() => {
                        if(data.ABSENT_STATUS && data.ABSENT_STATUS == 'X3'){
                            return (
                                <>
                                    <div className="sameLine">
                                        ✅ Clock-Out ({data.ABSENT_CLOCK_OUT})
                                    </div>
                                    &nbsp;&nbsp;&nbsp;
                                    <div className="sameLine linkUrl" onClick={() => clickAttachment("Clock-Out")}>
                                        View Image
                                    </div>
                                </>
                            )
                        } else {
                            return (
                                <>
                                    ❌ Clock-Out
                                </>
                            )
                        }
                    })()} 
                    <br/> <br/>
                    <form id="myForm" autoComplete="off">
                        {(() => {
                            if(data.ABSENT_STATUS && data.ABSENT_STATUS == 'X3'){
                                return ''
                            } else {
                                return (
                                    <>
                                        <input
                                            type="file"
                                            onChange={e => setFileAttachment(e.target)}
                                            onClick={e => (e.target.value = null)}
                                        />
                                        <br/>
                                        <p className="txtWarning">*File is required as proof of WFH...</p>
                                    </>
                                )
                            }
                        })()} 
                    </form>
                </div>
                <div className="boxContentCenter">
                    <div className={(data.ABSENT_STATUS && data.ABSENT_STATUS == 'X3' ? "buttonDisabled" : "button")} onClick={() => submitAbsent()} >
                        <span>
                            {
                                (data.ABSENT_STATUS && data.ABSENT_STATUS == 'X1') ?
                                "Clock-In" :
                                ((data.ABSENT_STATUS && data.ABSENT_STATUS == 'X2') ?
                                "Clock-Out" : "DONE!")
                            }
                        </span>
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
