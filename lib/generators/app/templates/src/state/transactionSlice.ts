import { TransactionStatus } from '@constants/index'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'


interface Transaction {
    hash?: string
    addedTime?: number,
    confirmedTime?: number
    failedTime?: number
    status?: TransactionStatus
    receipt?: {}
}

const initialState: Transaction = {}

export const transactionSlice = createSlice({
    name: 'transaction',
    initialState,
    reducers: {
        addTransaction: (state, action) => {
            const { hash } = action.payload
            state[hash] = {
                hash,
                addedTime: new Date().getTime(),
                status: TransactionStatus.Pending
            }
        },
        finalizeTransaction: (state, action) => {
            const { hash, transactionReceipt } = action.payload
            if (!state[hash]) {
                return
            }
            state[hash] = {
                ...state[hash],
                receipt: transactionReceipt,
                confirmedTime: new Date().getTime(),
                status: TransactionStatus.Success
            }
        },
        failedTransaction: (state, action) => {
            const { hash } = action.payload
            if (!state[hash]) {
                return
            }
            state[hash] = {
                ...state[hash],
                failedTime: new Date().getTime(),
                status: TransactionStatus.Failure
            }
        },
    }
})

// Action creators are generated for each case reducer function
export const { addTransaction, finalizeTransaction, failedTransaction } = transactionSlice.actions

export default transactionSlice.reducer