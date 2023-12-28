import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { RootState } from "../store";
import { fetchTokens, postConfirmEmail, postRegister } from "../../api/requests";

export interface AuthState {
    accessToken?: string,
    refreshToken?: string,
    keepInStore?: boolean,
    sentCodeEmail?: string | null | undefined,
    isAdmin?: boolean,
}

const initialState: AuthState = {
    accessToken: undefined,
    refreshToken: undefined,
    keepInStore: true,
    sentCodeEmail: undefined,
    isAdmin: false,
}

export const login = createAsyncThunk(
    'auth/login',
    async ({ email, password, keepInStore = false }: { email: string, password: string, keepInStore: boolean }) => {
        const res = await fetchTokens(email, password)
        return { ...res.data, keepInStore }
    }
)

export const signup = createAsyncThunk(
    'auth/register',
    async ({
        email,
        firstName,
        lastName,
        password
    }: {
        email: string,
        firstName: string,
        lastName: string,
        password: string,
    }) => {
        await postRegister(email, firstName, lastName, password)
        return {
            keepInStore: true,
            sentCodeEmail: email,
        }
    }
)

export const confirm = createAsyncThunk(
    'auth/confirm',
    async ({ email, token }: { email: string, token: string }) => {
        await postConfirmEmail(email, token)
        return {
            keepInStore: initialState.keepInStore,
            sentCodeEmail: initialState.sentCodeEmail,
        }
    }
)

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        saveTokens: (state, action: PayloadAction<AuthState>) => {
            state.accessToken = action.payload.accessToken
            state.refreshToken = action.payload.refreshToken
        },
        logout: (state) => {
            state.accessToken = initialState.accessToken
            state.refreshToken = initialState.refreshToken
            state.keepInStore = initialState.keepInStore
            state.sentCodeEmail = initialState.sentCodeEmail
        }
    },
    extraReducers: (builder) => {
        builder.addCase(login.fulfilled, (state, action) => {
            state.accessToken = action.payload.access_token
            state.refreshToken = action.payload.refresh_token
            state.keepInStore = action.payload.keepInStore
        })
        builder.addCase(signup.fulfilled, (state, action) => {
            state.keepInStore = action.payload.keepInStore
            state.sentCodeEmail = action.payload.sentCodeEmail
        })
        builder.addCase(confirm.fulfilled, (state, action) => {
            state.keepInStore = action.payload.keepInStore
            state.sentCodeEmail = action.payload.sentCodeEmail
        })
    }

})

export const { saveTokens, logout } = authSlice.actions
export const selectAuthState = (state: RootState) => state.auth
export const selecSentCodeEmail = (state: RootState) => state.auth.sentCodeEmail
export default authSlice.reducer;
