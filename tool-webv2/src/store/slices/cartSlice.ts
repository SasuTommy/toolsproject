import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ToolData } from "./toolsCatalogSlice";
import dayjs from "dayjs";
import { RootState } from "../store";
import { book } from "../../api/requests";

export interface CartState {
    items: Array<ToolData>,
    dateStart: string,
    dateEnd: string,
}

const initialState: CartState = {
    items: [],
    dateStart: dayjs().add(1, 'day').format('YYYY-MM-DD'),
    dateEnd: dayjs().add(4, 'day').format('YYYY-MM-DD'),
}

export const bookItems = createAsyncThunk(
    'cart/book',
    async ({ items, dateStart, dateEnd }: { items: Array<ToolData>, dateStart: string, dateEnd: string }) => {
        await book(items.map((el) => el.id), dateStart, dateEnd)
    }
)

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<{ item: ToolData }>) => {
            if (state.items.findIndex((el) => el.id === action.payload.item.id) === -1) {
                state.items = [...state.items, action.payload.item]
            }
        },
        removeFromCart: (state, action: PayloadAction<{ id: number }>) => {
            if (state.items.findIndex((el) => el.id === action.payload.id) !== - 1) {
                state.items = [...state.items.filter((el) => el.id !== action.payload.id)]
            }
        },
        changeDates: (state, action: PayloadAction<{ range: any }>) => {
            state.dateStart = action.payload.range[0] ?? state.dateStart
            state.dateEnd = action.payload.range[1] ?? state.dateEnd
        }
    },
    extraReducers: (builder) => {
        builder.addCase(bookItems.fulfilled, (state) => {
            state.items = initialState.items
            state.dateStart = initialState.dateStart
            state.dateEnd = initialState.dateEnd
        })
    }
})

export const { addToCart, removeFromCart, changeDates } = cartSlice.actions
export const selectSum = (state: RootState) => {
    let sum = 0
    for (const item of state.cart.items) {
        sum += item.price * dayjs(state.cart.dateEnd).diff(dayjs(state.cart.dateStart), 'day')
    }
    return sum
}
export const selectDates = (state: RootState) => ({ dateStart: state.cart.dateStart, dateEnd: state.cart.dateEnd })
export const selectCartItems = (state: RootState) => state.cart.items
export const selectDatesDiff = (state: RootState) => dayjs(state.cart.dateEnd).diff(dayjs(state.cart.dateStart), 'day')
export default cartSlice.reducer