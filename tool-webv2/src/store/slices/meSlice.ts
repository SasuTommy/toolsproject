import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { getMe } from "../../api/requests"
import { RootState } from "../store"

export interface MeData {
    email: string,
    first_name: string,
    last_name: string,
    is_staff: boolean,
}

export interface MeState {
    info?: MeData
}

const initialState: MeState = {
    info: undefined
}

export const loadMe = createAsyncThunk(
    'me/load',
    async () => {
        const res = await getMe()
        return res.data
    }
)

export const meSlice = createSlice({
    name: 'me',
    initialState,
    reducers: {
        clearMeInfo: (state) => {
            state.info = undefined
        }
    },
    extraReducers: (builder) => {
        builder.addCase(loadMe.fulfilled, (state, action) => {
            state.info = action.payload
        })
    }
})

export const { clearMeInfo } = meSlice.actions
export const selectMeInfo = (state: RootState) => state.me.info
export const selectIsAdmin = (state: RootState) => state.me.info?.is_staff ?? false
export default meSlice.reducer
