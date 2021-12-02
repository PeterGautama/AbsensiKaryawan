import { ADD_FILTER } from "../constants/filterTypes"

import objectAssign from "object-assign"
import initialState from "./initialState"

export default function filterReducers(state = initialState.filter, action) {
  switch (action.type) {
    case ADD_FILTER: {
      let x = {}
      console.log(action.payload)
      x[action.payload.filter] = action.payload.value
      return objectAssign({}, state, action.payload)
    }
    default: {
      return state
    }
  }
}
