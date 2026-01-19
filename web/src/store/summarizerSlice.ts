import summarizerService from "@/services/summarizer.service";
import type { SummarizerState } from "@/types/summarizer";
import { createSlice, type PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "./store";

export const getSummaryThunk = createAsyncThunk<
    string, 
    string,
     {
      state: RootState;
      rejectValue: string;
    }
>(
  "summary/getSummary",
    async (document_id: string, { rejectWithValue }) => {
        try {
            const response = await summarizerService.getSummary(document_id);
            return response.data;
        } catch {
           return rejectWithValue("Summarization failed");
        }
    }
);

const initialState: SummarizerState = {
    document_id:"",
    original_name:"",
    summary : "",
    status: "idle",
    error: null,
};

const summarizerSlice = createSlice({
    name: "summarizer",
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(getSummaryThunk.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(getSummaryThunk.fulfilled, (state, action) => {
                state.status = "received";
                state.summary = action.payload;
            })
            .addCase(getSummaryThunk.rejected, (state, action) => {
                state.status = "rejected";
                state.error = action.payload || "Cannot load data";
            });
    },
    reducers: {
        uploadcontent: (state, action: PayloadAction<{document_id:string , original_name:string}>) => {
            const {document_id , original_name} = action.payload;
            state.document_id = document_id;
            state.original_name = original_name;
        },
    }
});

export const {
    uploadcontent,
} = summarizerSlice.actions;

export default summarizerSlice.reducer;