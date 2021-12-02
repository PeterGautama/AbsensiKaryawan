import axios from "axios"

class RouteAPI {
  get_data() {
    return axios({
      method: "GET",
      url: process.env.GATSBY_BACKEND_URL + "report",
    })
  }

  get_attachment(data) {
    return axios({
      method: "GET",
      url: process.env.GATSBY_BACKEND_URL + "report/attachment",
      params: data,
    })
  }
}

const routeAPI = new RouteAPI()
export default routeAPI
