import { HISTORY_DATE, ID_HISTORY_ROW } from "../constants/exportTypes"

export function add_history_date(payload) {
  return {
    type: HISTORY_DATE,
    payload,
  }
}

export function add_id_history_row(payload) {
  return {
    type: ID_HISTORY_ROW,
    payload,
  }
}
