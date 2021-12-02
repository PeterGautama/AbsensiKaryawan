import { HISTORY_DATE, ID_HISTORY_ROW } from "../constants/exportTypes"

import objectAssign from "object-assign"
import initialState from "./initialState"

export default function exportReducers(state = initialState, action) {
  switch (action.type) {
    case HISTORY_DATE: {
      return objectAssign({}, state, {
        historyDate: action.payload,
      })
    }
    case ID_HISTORY_ROW: {
      return objectAssign({}, state, {
        selectedIDHistory: action.payload,
      })
    }
    default: {
      return state
    }
  }
}
