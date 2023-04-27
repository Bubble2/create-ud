import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const counterSlice = createSlice({
    name: 'menu',
    initialState: {
        menuKeys: {
            selectedMenuKeys: ['/'],
            openMenuKeys: ['/'],
            selectedFirstMenuKeys: ['/']
        },
        secondaryMenuOpen: false
    },
    reducers: {
        updateOpenMenuKeys: (state, action) => {
            state.menuKeys.openMenuKeys = action.payload.openMenuKeys
        },
        updateSelectedMenuKeys: (state, action) => {
            state.menuKeys.selectedMenuKeys = action.payload.selectedMenuKeys
        },
        updateSelectedFirstMenuKeys: (state, action) => {
            state.menuKeys.selectedFirstMenuKeys = action.payload.selectedFirstMenuKeys
        },
        toggleSecondaryMenuOpen: (state, action) => {
            state.secondaryMenuOpen = action.payload
        }
    }
})

// Action creators are generated for each case reducer function
export const { updateOpenMenuKeys, updateSelectedMenuKeys, updateSelectedFirstMenuKeys, toggleSecondaryMenuOpen } = counterSlice.actions

export default counterSlice.reducer