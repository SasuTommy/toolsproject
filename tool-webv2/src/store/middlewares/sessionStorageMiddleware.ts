import * as Redux from "redux";


const sessionStorageMiddleware: Redux.Middleware = (store) => (next) => (action) => {
    const result = next(action)
    if (action.type?.startsWith('auth/')) {
        const state = store.getState().auth
        if (state.keepInStore === undefined || !state.keepInStore && state.accessToken !== undefined) {
            sessionStorage.setItem('auth', JSON.stringify(state))
        }
    }
    if (action.type?.startsWith('menu/')) {
        const state = store.getState().menu
        sessionStorage.setItem('menu', JSON.stringify(state))
    }

    return result
}

export default sessionStorageMiddleware