import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

//异步请求
export const fetchUserById = createAsyncThunk(
    'users/fetchByIdStatus',
    async (userId, thunkAPI) => {
        const response = userId;
        return response
    }
)

export const counterSlice = createSlice({
    name: 'users',
    initialState: {
        entities: [],
        warnState: true,
        loading: false
    },
    reducers: {
        changeWarnStatus: (state, action) => {
            state.warnState = action.payload
        },
    },
    extraReducers: (builder) => {
        // Add reducers for additional action types here, and handle loading state as needed
        builder.addCase(fetchUserById.pending, (state, action) => {
            // Add user to the state array
            state.loading = true
        })
        builder.addCase(fetchUserById.fulfilled, (state, action) => {
            // Add user to the state array
            state.loading = false
            state.entities.push(action.payload)
        })
        builder.addCase(fetchUserById.rejected, (state, action) => {
            // Add user to the state array
            state.loading = false
        })
    }
})

// Action creators are generated for each case reducer function
export const { changeWarnStatus } = counterSlice.actions

export default counterSlice.reducer