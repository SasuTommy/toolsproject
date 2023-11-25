import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { RootState } from "../store"

export enum AuthScreenOptions { signin, signup }

export interface MenuState {
    activeItem: number
    authScreenOption: AuthScreenOptions,
}

const initialState: MenuState = {
    activeItem: 1,
    authScreenOption: AuthScreenOptions.signin,
}

export const menuSlice = createSlice({
    name: 'menu',
    initialState,
    reducers: {
        setActiveItem: (state, action: PayloadAction<{ newItem: number }>) => {
            state.activeItem = action.payload.newItem
        },
        setAuthScreenOption: (state, action: PayloadAction<{ option: AuthScreenOptions }>) => {
            state.authScreenOption = action.payload.option
         }
    }
})

export const { setActiveItem, setAuthScreenOption } = menuSlice.actions
export const selectMenuActiveItem = (state: RootState) => state.menu.activeItem
export const selectAuthScreenOption = (state: RootState) => state.menu.authScreenOption
export default menuSlice.reducer;