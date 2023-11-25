import axios from "axios";
import { useAppDispatch, useAppSelector } from "../hooks/storeHooks";
import { saveTokens, selectAuthState } from "../store/slices/authSlice";

let store: any

export const injectStoreForAxios = (_store: any) => {
    store = _store
}

const axiosClient = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
})

axiosClient.interceptors.request.use((config) => {
    const tokens = store.getState().auth

    if (tokens.accessToken !== undefined) {
        config.headers['Authorization'] = `Bearer ${tokens.accessToken}`
    }

    return config
}, (error) => {
    Promise.reject(error)
})

axiosClient.interceptors.response.use((response) => response, (error) => {
    const originalRequest = error.config

    if (error.response.status === 401 && !originalRequest._retry) {
        const tokens = store.getState().auth
        originalRequest._retry = true
        const refreshToken = tokens.refreshToken
        return axiosClient
            .post('/tokens/refresh', {
                refreshToken: refreshToken,
            })
            .then((res) => {
                if (res.status === 200) {
                    store.dispatch(saveTokens({
                        accessToken: res.data['access_token'],
                        refreshToken: res.data['refresh_token'],
                    }))
                    axiosClient.defaults.headers.common['Authorization'] = `Bearer ${res.data['access_token']}`
                    return axiosClient(originalRequest)
                }
            })
    }

    return Promise.reject(error)
})

export default axiosClient