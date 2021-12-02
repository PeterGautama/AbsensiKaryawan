import React from "react"
import { Provider } from "react-redux"
import configureStore from "./store/configureStore"

export default ({ element }) => (
  <Provider store={configureStore}>{element}</Provider>
)
