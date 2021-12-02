// Set up your root reducer here...
import { combineReducers } from "redux"
import Export from "./exportReducer"
import Filter from "./filterReducer"

const rootReducer = combineReducers({
  Export,
  Filter,
})

export default rootReducer
