import { ADD_FILTER } from "../constants/filterTypes"

export function add_filter(payload) {
  return {
    type: ADD_FILTER,
    payload,
  }
}
