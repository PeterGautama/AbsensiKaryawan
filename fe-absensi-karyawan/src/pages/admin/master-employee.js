import React, { useState, useEffect } from "react"
import Seo from "../../components/seo"
import Table from "../../components/table"
import Header from "../../components/header"
import Api from "../../api/admin/master-employee"
import MetaTags from 'react-meta-tags'
import Loading from '../../components/loading'
import moment from "moment"
import base64 from "react-native-base64"

const IndexPage = () => {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    Api.get_data().then(res => {
      setData(res.data)
      setIsLoading(false)
    })
  }, [])

  return (
    <div>
      <MetaTags>
        <meta name="viewport" content="width=1024"/>
      </MetaTags>
      <Seo title="Master Employee" />
      <div className="layout">
        <Header
          program_name="Master Employee"
          setIsLoading={bol => setIsLoading(bol)}
        />
        <Loading loading={isLoading} />
        <div className="content">
          <Table
            title=""
            data={data}
            columns={[
              { title: "Employee ID", field: "EMPLOYEE_ID", editable: "onAdd" },
              { title: "Name", field: "EMPLOYEE_NAME", },
              { title: "Department", field: "DEPT", 
                editComponent: t => {
                  return (
                    // disini digunakan data statis, karena hanya sbg demontrasi, seharusnya menggunakan tabel department dari database
                      <select defaultValue={t.rowData.DEPT} onChange={e => { t.onChange(e.target.value) }}>
                          <option value="">Choose Department...</option>
                          <option value="Finance">Finance</option>
                          <option value="Marketing">Marketing</option>
                          <option value="IT">IT</option>
                      </select>
                  )
                },  
              },
              { title: "Hierarchy", field: "HIERARCHY", 
                editComponent: t => {
                  return (
                      <select defaultValue={t.rowData.HIERARCHY} onChange={e => { t.onChange(e.target.value) }}>
                          <option value="">Choose Hierarchy...</option>
                          <option value="Staff">Staff</option>
                          <option value="Supervisor">Supervisor</option>
                          <option value="Manager">Manager</option>
                          <option value="Dept Head">Dept Head</option>
                      </select>
                  )
                }, 
              },
              { title: "Updated Time and By", field: "UPDATED_TIME", editable: "never",
                render: rowData => {
                  if (rowData.UPDATED_TIME) {
                    return moment(rowData.UPDATED_TIME).format('DD/MM/YYYY') + ' ' + rowData.UPDATED_TIME.substring(11, 19) + ' ' + (rowData.UPDATED_BY ? rowData.UPDATED_BY : '')
                  } else {
                    return ''
                  }
                },
              },
              { title: "Created Time and By", field: "CREATED_TIME", editable: "never",
                render: rowData => {
                  if (rowData.CREATED_TIME) {
                    return moment(rowData.CREATED_TIME).format('DD/MM/YYYY') + ' ' + rowData.CREATED_TIME.substring(11, 19) + ' ' + (rowData.CREATED_BY ? rowData.CREATED_BY : '')
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
            actions={[
                {
                  icon: () => <div></div>,
                },
            ]}
            editable={{
              onRowAdd: newData =>
                new Promise((resolve, reject) => {
                  if (
                    newData.EMPLOYEE_ID &&
                    newData.EMPLOYEE_NAME &&
                    newData.DEPT && 
                    newData.HIERARCHY
                  ) {
                    if (
                      (newData.EMPLOYEE_ID.length > 50)
                    ) {
                      alert("Employee ID cannot be longer than 50 characters!")
                      return reject()
                    } else if (
                      (newData.EMPLOYEE_NAME.length > 100)
                    ) {
                      alert("Employee Name cannot be longer than 100 characters!")
                      return reject()
                    } else if (
                      (newData.DEPT.length > 100)
                    ) {
                      alert("Department cannot be longer than 100 characters!")
                      return reject()
                    } else if (
                      (newData.HIERARCHY.length > 50)
                    ) {
                      alert("Hierarchy cannot be longer than 50 characters!")
                      return reject()
                    }
                  } else {
                    alert("Please fill in all required fields!")
                    return reject()
                  }

                  if(!window.confirm("Are you sure?")) {
                    return reject()
                  }

                  setTimeout(() => {
                    setIsLoading(true)
                    Api.insert_data({
                      aa: newData.EMPLOYEE_ID,
                      bb: newData.EMPLOYEE_NAME,
                      cc: newData.DEPT,
                      dd: newData.HIERARCHY,
                      ee: base64.decode(localStorage.getItem('xa')),
                    }).then(res => {
                      if (res && res.data.SUCCESS) {
                        resolve()
                        Api.get_data().then(res => {
                          setData(res.data)
                          setIsLoading(false)
                        })
                      } else {
                        alert(res.data.MESSAGE)
                        Api.get_data().then(res => {
                          setData(res.data)
                          setIsLoading(false)
                          return reject()
                        })
                      }
                    })
                  }, 1000)
                }),
              onRowUpdate: (newData, oldData) =>
                new Promise((resolve, reject) => {
                  if (
                    newData.EMPLOYEE_NAME &&
                    newData.DEPT && 
                    newData.HIERARCHY
                  ) {
                    if (
                      (newData.EMPLOYEE_NAME.length > 100)
                    ) {
                      alert("Employee Name cannot be longer than 100 characters!")
                      return reject()
                    } else if (
                      (newData.DEPT.length > 100)
                    ) {
                      alert("Department cannot be longer than 100 characters!")
                      return reject()
                    } else if (
                      (newData.HIERARCHY.length > 50)
                    ) {
                      alert("Hierarchy cannot be longer than 50 characters!")
                      return reject()
                    }
                  } else {
                    alert("Please fill in all required fields!")
                    return reject()
                  }

                  if(!window.confirm("Are you sure?")) {
                    return reject()
                  }

                  setTimeout(() => {
                    setIsLoading(true)
                    Api.update_data({
                      aa: newData.EMPLOYEE_NAME,
                      bb: newData.DEPT,
                      cc: newData.HIERARCHY,
                      dd: base64.decode(localStorage.getItem('xa')),
                      ee: oldData.EMPLOYEE_ID,
                    }).then(res => {
                      if (res && res.data.SUCCESS) {
                        resolve()
                        Api.get_data().then(res => {
                          setData(res.data)
                          setIsLoading(false)
                        })
                      } else {
                        alert(res.data.MESSAGE)
                        Api.get_data().then(res => {
                          setData(res.data)
                          setIsLoading(false)
                          return reject()
                        })
                      }
                    })
                  }, 1000)
              }),
              onRowDelete: (newData, oldData) =>
                new Promise((resolve, reject) => {
                  setTimeout(() => {
                    resolve()
                    setIsLoading(true)
                    Api.delete_data({
                      aa: newData.EMPLOYEE_ID,
                    })
                      .then(res => {
                        if (res.data.SUCCESS) {
                          Api.get_data().then(res => {
                            setData(res.data)
                            setIsLoading(false)
                          })
                        } else {
                          alert(res.data.MESSAGE)
                          Api.get_data().then(res => {
                            setData(res.data)
                            setIsLoading(false)
                          })
                        }
                      })
                      .catch(err => {
                        alert("FAILED")
                        setIsLoading(false)
                      })
                  }, 1000)
                }),
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default IndexPage
