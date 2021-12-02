import axios from "axios"

class RouteAPI {
  get_data(data) {
    return axios({
      method: "GET",
      url: process.env.GATSBY_BACKEND_URL + "absent",
      params: data,
    })
  }

  insert_data(data) {
    return axios({
      method: "POST",
      url: process.env.GATSBY_BACKEND_URL + "absent",
      data: data,
    })
  }
}

const routeAPI = new RouteAPI()
export default routeAPI
