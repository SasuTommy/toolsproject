import * as Redux from "redux";


const localStorageMiddleware: Redux.Middleware = (store) => (next) => (action) => {
    const result = next(action)
    if (action.type?.startsWith('auth/')) {
        const state = store.getState().auth
        if (state.accessToken === null || state.accessToken === undefined) {
            localStorage.removeItem('cart');
        }
        if (state.keepInStore) {
            localStorage.setItem('auth', JSON.stringify(state))
        }
    }

    if (action.type.startsWith('cart/')) {
        const state = store.getState().cart
        localStorage.setItem('cart', JSON.stringify(state))
    }

    return result
}

export default localStorageMiddleware