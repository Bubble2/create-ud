import { combineReducers } from 'redux'
import indexSlice from '@state/indexSlice'
import routeSlice from '@state/routeSlice'
import tokenSlice from '@state/tokenSlice'
import transactionSlice from '@state/transactionSlice'
import api from '@state/api'

export default combineReducers({
    indexSlice,
    routeSlice,
    tokenSlice,
    transactionSlice,
    [api.reducerPath]: api.reducer
})