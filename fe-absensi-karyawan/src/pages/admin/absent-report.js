import React, { useState, useEffect } from "react"
import Seo from "../../components/seo"
import Table from "../../components/table"
import Header from "../../components/header"
import Api from "../../api/admin/absent-report"
import ApiEmployee from "../../api/admin/absent-report"
import MetaTags from 'react-meta-tags'
import Loading from '../../components/loading'
import moment from "moment"
import "../../styles/manage-absent.scss"
import "../../styles/button.scss"
import base64 from "react-native-base64"

const IndexPage = () => {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [popupImage, setPopupImage] = useState(false)
  const [popupImageFile, setPopupImageFile] = useState("")
  const [popupImageName, setPopupImageName] = useState("")

  useEffect(() => {
    Api.get_data().then(res => {
      setData(res.data)
      setIsLoading(false)
    })
  }, [])

  const clickAttachment = (data_send, status) => {
    ApiEmployee.get_attachment({
        aa: moment(data_send.ABSENT_DATE).format("YYYY-MM-DD"),
        bb: data_send.EMPLOYEE_ID 
    }).then(res => {
        if(status=='Clock-In'){
            setPopupImageFile(base64.decode(res.data.ATTACHMENT_FILE_CLOCK_IN))
            setPopupImageName(data_send.ATTACHMENT_NAME_CLOCK_IN)
            setPopupImage(true)
        } else {
            setPopupImageFile(base64.decode(res.data.ATTACHMENT_FILE_CLOCK_OUT))
            setPopupImageName(data_send.ATTACHMENT_NAME_CLOCK_OUT)
            setPopupImage(true)
        }
    })
  }

  return (
    <div>
      <MetaTags>
        <meta name="viewport" content="width=1024"/>
      </MetaTags>
      <Seo title="Absent Report" />
      <div className="layout">
        <Header
          program_name="Absent Report"
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
          <Table
            title=""
            data={data}
            columns={[
              { title: "Absent Date", field: "ABSENT_DATE",
                render: rowData => {
                    if (rowData.ABSENT_DATE) {
                        return moment(rowData.ABSENT_DATE).format('DD/MM/YYYY')
                    } else {
                        return ''
                    }
                },
              },
              { title: "Employee ID", field: "EMPLOYEE_ID", },
              { title: "Name", field: "EMPLOYEE_NAME", },
              { title: "Clock In Time", field: "ABSENT_CLOCK_IN",},
              { title: "Clock In Attachment", field: "ATTACHMENT_NAME_CLOCK_IN", 
                render: rowData => {
                  if(rowData.ABSENT_CLOCK_IN){
                    return (
                      <div className="sameLine linkUrl" onClick={() => clickAttachment(rowData, "Clock-In")}>
                        View Image
                      </div>
                    )
                  } else {
                    return ''
                  }
                },
              },
              { title: "Clock Out Time", field: "ABSENT_CLOCK_OUT",},
              { title: "Clock Out Attachment", field: "ATTACHMENT_NAME_CLOCK_OUT", 
                render: rowData => {
                  if(rowData.ABSENT_CLOCK_OUT){
                    return (
                      <div className="sameLine linkUrl" onClick={() => clickAttachment(rowData, "Clock-Out")}>
                        View Image
                      </div>
                    )
                  } else {
                    return ''
                  }
                },
              },
            ]}
            options={{
              toolbar: true,
              paging: true,
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default IndexPage
