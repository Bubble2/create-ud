import { combineReducers } from 'redux'
import indexSlice from '@state/indexSlice'
import routeSlice from '@state/routeSlice'
<%if (fnFeatures.includes('web3')) {-%>
import tokenSlice from '@state/tokenSlice'
import transactionSlice from '@state/transactionSlice'
<%}-%>
import api from '@state/api'

export default combineReducers({
    indexSlice,
    routeSlice,
<%if (fnFeatures.includes('web3')) {-%>
    tokenSlice,
    transactionSlice,
<%}-%>
    [api.reducerPath]: api.reducer
})