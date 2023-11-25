import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { RootState } from "../store"
import { getToolsList } from "../../api/requests"

export interface ToolData {
    id: number,
    label: string,
    description: string,
    image_url: string,
    available: number,
    price: number,
}

export interface ToolsCatalogState {
    listItems: Array<ToolData>,
    selectedItem?: ToolData,
}

const initialState: ToolsCatalogState = {
    listItems: [],
    selectedItem: undefined,
}

export const loadList = createAsyncThunk(
    'toolsCatalog/list',
    async () => {
        const res = await getToolsList()
        return res.data.results
    }
)

export const toolsCatalogSlice = createSlice({
    name: 'toolsCatalog',
    initialState,
    reducers: {
        setSelectedItem: (state, action: PayloadAction<{ id: number }>) => {
            state.selectedItem = state.listItems.find((el) => el.id === action.payload.id)
        },
        removeSelectedItem: (state) => {
            state.selectedItem = undefined
        }
    },
    extraReducers: (builder) => {
        builder.addCase(loadList.fulfilled, (state, action) => {
            state.listItems = action.payload
            state.selectedItem = undefined
        })
    }
})

export const { setSelectedItem, removeSelectedItem } = toolsCatalogSlice.actions
export const selectSelectedCatalogItem = (state: RootState) => state.toolsCatalog.selectedItem
export const selectCatalog = (state: RootState) => state.toolsCatalog.listItems
export default toolsCatalogSlice.reducer