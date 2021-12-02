import axios from "axios"

class RouteAPI {
    check_login(data) {
        return axios({
          method: "POST",
          url: process.env.GATSBY_BACKEND_URL + "auth/signin",
          data: data,
        })
    }

    check_session(data) {
        return axios({
            method: "POST",
            url: process.env.GATSBY_BACKEND_URL + "auth/session",
            data: data,
        })
    }

    get_program_list(data) {
        return axios({
            method: "GET",
            url: process.env.GATSBY_BACKEND_URL + "auth/program",
            params: data,
        })
    }

    change_password(data) {
        return axios({
            method: "POST",
            url: process.env.GATSBY_BACKEND_URL + "auth/pwd",
            data: data,
        })
    }
}

const routeAPI = new RouteAPI()
export default routeAPI
