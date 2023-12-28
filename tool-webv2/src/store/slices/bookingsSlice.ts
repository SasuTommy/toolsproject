import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ToolData } from "./toolsCatalogSlice";
import { deleteBooking, getBookings, getRaport, updateEndDateForBooking } from "../../api/requests";
import { RootState } from "../store";

export interface BookingItem {
    id: string,
    tools: Array<ToolData>,
    dateStart: string,
    dateEnd: string,
    isVerified: boolean,
    sumPrice: number,
}

export interface BookingsState {
    items: Array<BookingItem>
}

const initialState: BookingsState = {
    items: []
}

export const loadBookings = createAsyncThunk(
    'bookings/load',
    async () => {
        const res = await getBookings()
        return res.data.results;

    }
)

export const loadRaport = createAsyncThunk(
    'bookings/loadRaport',
    async () => {
        const res = await getRaport()
        return res.data.results;

    }
)

export const deleteBookingItem = createAsyncThunk(
    'cart/deleteBooking',
    async ({ id }: { id: string }) => {
        await deleteBooking(id)
        return { deletedId: id }
    }
)

export const updateEndDate = createAsyncThunk(
    'cart/updateEndDate',
    async ({ id, newDate }: { id: string, newDate: string }) => {
        await updateEndDateForBooking(id, newDate);
    }
)

export const bookingsSlice = createSlice({
    name: 'bookings',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(loadBookings.fulfilled, (state, action) => {
            state.items = action.payload.map((el: any) => ({
                id: el.id,
                tools: el.tools,
                isVerified: el.is_verified,
                sumPrice: el.sum_price,
                dateStart: el.date_start,
                dateEnd: el.date_end,
            }))
        })
        builder.addCase(loadRaport.fulfilled, (state, action) => {
            state.items = action.payload.map((el: any) => ({
                id: el.id,
                tools: el.tools,
                isVerified: el.is_verified,
                sumPrice: el.sum_price,
                dateStart: el.date_start,
                dateEnd: el.date_end,
            }))
        })
        builder.addCase(deleteBookingItem.fulfilled, (state, action) => {
            state.items = state.items.filter((el) => el.id !== action.payload.deletedId)
        })
    }
})

export const selectBookings = (state: RootState) => state.bookings.items
export default bookingsSlice.reducer
