import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import jikanService from '../services/jikanService';

const initialState = {
    manga: [],
    loadingStatus: 'waiting',
    currentPage: 1, // Pagination starts from the first page.
    lastVisiblePage: 0,
    totalItems: 0,
    sortBy: 'mal_id', // Such application terms.
    dateRange: [1930, 2023],
}

export const fetchManga = createAsyncThunk(
    'manga/fetchManga',
    ({currentPage, sortBy, dateRange}) => {
        const {getAllManga} = jikanService()
        return getAllManga(currentPage, sortBy, dateRange);
    }
);

const mangaSlice = createSlice({
    name: 'manga',
    initialState,
    reducers: {
        setCurrentPage: (state, action) => {
            state.currentPage = action.payload;
        },
        setSortBy: (state, action) => {
            state.sortBy = action.payload;
        },
        setDateRange: (state, action) => {
            state.dateRange = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchManga.pending, (state) => {
                state.loadingStatus = 'loading';
            })
            .addCase(fetchManga.fulfilled, (state, action) => {
                state.manga = action.payload.mangaData;
                state.currentPage = action.payload.paginationData.currentPage;
                state.lastVisiblePage = action.payload.paginationData.lastVisiblePage;
                state.totalItems = action.payload.paginationData.totalItems;
                state.loadingStatus = 'waiting';
            })
            .addCase(fetchManga.rejected, (state) => {
                state.loadingStatus = 'error';
            })
            .addDefaultCase(() => {});
    }
});

const { actions, reducer } = mangaSlice;

export const { setCurrentPage, setSortBy, setDateRange } = actions;

export default reducer;