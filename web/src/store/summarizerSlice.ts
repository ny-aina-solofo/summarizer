import type { SummarizerState } from "@/types/summarizer";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { getListFiles, getSummaryThunk } from "./thunk";

const initialState: SummarizerState = {
    document_key:"",
    original_name:"",
    summary : "",
    existing_files:[],
    status: {
        listFiles: "idle",
        summary: "idle",
    },
    error: null,
};

const summarizerSlice = createSlice({
    name: "summarizer",
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(getSummaryThunk.pending, (state) => {
                state.status.summary = 'loading';
                state.error = null;
            })
            .addCase(getSummaryThunk.fulfilled, (state, action) => {
                state.status.summary = "received";
                state.summary = action.payload;
            })
            .addCase(getSummaryThunk.rejected, (state, action) => {
                state.status.summary = "rejected";
                state.error = action.payload || "Cannot load data";
            });
        builder
            .addCase(getListFiles.pending, (state) => {
                state.status.listFiles = 'loading';
                state.error = null;
            })
            .addCase(getListFiles.fulfilled, (state, action) => {
                state.status.listFiles = "received";
                state.existing_files = action.payload;
            })
            .addCase(getListFiles.rejected, (state, action) => {
                state.status.listFiles = "rejected";
                state.error = action.payload || "Cannot load data";
            });
    },
    reducers: {
        uploadcontent: (state, action: PayloadAction<{document_key:string , original_name:string}>) => {
            const {document_key , original_name} = action.payload;
            state.document_key = document_key;
            state.original_name = original_name;
        },
    }
});

export const {
    uploadcontent,
} = summarizerSlice.actions;

export default summarizerSlice.reducer;