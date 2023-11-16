import { combineReducers } from 'redux'
import homePage from "./HomePage.Reducer"

const reducer = combineReducers(
    {
        homePage:homePage
    }
)

export default reducer;