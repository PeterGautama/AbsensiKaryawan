import axios from "axios"

class RouteAPI {
  get_data() {
    return axios({
      method: "GET",
      url: process.env.GATSBY_BACKEND_URL + "employee",
    })
  }

  insert_data(data) {
    return axios({
      method: "POST",
      url: process.env.GATSBY_BACKEND_URL + "employee",
      data: data,
    })
  }

  update_data(data) {
    return axios({
      method: "PUT",
      url: process.env.GATSBY_BACKEND_URL + "employee",
      data: data,
    })
  }

  delete_data(data) {
    return axios({
      method: "DELETE",
      url: process.env.GATSBY_BACKEND_URL + "employee",
      data: data,
    })
  }
}

const routeAPI = new RouteAPI()
export default routeAPI
