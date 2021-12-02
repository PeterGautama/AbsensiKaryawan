import { ADD_USER_LOGIN } from "../constants/userTypes"

export function add_user_login(payload) {
  return {
    type: ADD_USER_LOGIN,
    payload,
  }
}
