import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const tokenSlice = createSlice({
    name: 'token',
    initialState: {
        tokenList: [],
        customTokenList: [],
        tokenBalance: {},
        tokenAllowance: {}
    },
    reducers: {
        updateTokenList: (state, action) => {
            state.tokenList = action.payload
        },
        updateCustomTokenList: (state, action) => {
            state.customTokenList = action.payload
        },
        updateTokenBalance: (state, action) => {
            state.tokenBalance = {
                ...state.tokenBalance,
                ...action.payload
            }
        },
        updateTokenAllowance: (state, action) => {
            state.tokenAllowance = {
                ...state.tokenAllowance,
                ...action.payload
            }
        }
    }
})

// Action creators are generated for each case reducer function
export const { updateTokenList, updateCustomTokenList, updateTokenBalance, updateTokenAllowance } = tokenSlice.actions

export default tokenSlice.reducer