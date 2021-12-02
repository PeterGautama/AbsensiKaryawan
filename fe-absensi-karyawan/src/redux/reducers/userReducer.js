import { ADD_USER_LOGIN } from "../constants/userTypes"

import objectAssign from "object-assign"
import initialState from "./initialState"

export default function userReducer(state = initialState.user, action) {
  switch (action.type) {
    case ADD_USER_LOGIN: {
      return objectAssign({}, state, action.payload)
    }

    default: {
      return state
    }
  }
}
