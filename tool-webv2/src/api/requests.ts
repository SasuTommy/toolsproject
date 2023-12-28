import axiosClient from "./axiosClient";

export function fetchTokens(email: string, password: string) {
    return axiosClient.post('/tokens/', { email, password });
}

export function postRegister(
    email: string,
    firstName: string,
    lastName: string,
    password: string,
) {
    return axiosClient.post('/auth/register', {
        email,
        first_name: firstName,
        last_name: lastName,
        password,
    })
}

export function postConfirmEmail(
    email: string,
    token: string,
) {
    return axiosClient.post('/auth/confirm', { email, token })
}

export function getToolsList() {
    return axiosClient.get('/tools/list')
}

export function getMe() {
    return axiosClient.get('/me')
}

export function book(items: Array<any>, dateStart: string, dateEnd: string) {
    return axiosClient.post('/bookings/list', {
        tools: items,
        date_start: dateStart,
        date_end: dateEnd,
    })
}

export function getBookings() {
    return axiosClient.get('/bookings/list')
}

export function getRaport() {
    return axiosClient.get('/bookings/raport/')
}

export function deleteBooking(id: string) {
    return axiosClient.delete(`/bookings/list/${id}`)
}

export function updateEndDateForBooking(id: string, newDateEnd: string) {
    return axiosClient.put(`/bookings/list/${id}`, {
        date_end: newDateEnd
    })
}
