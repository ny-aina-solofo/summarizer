import { createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import summarizerService from "@/services/summarizer.service";
import type { NormalizedData } from "@/types/summarizer";

export const getSummaryThunk = createAsyncThunk<
    string, 
    {
        document_key: string;
        option_data: NormalizedData;
    },
    {
      state: RootState;
      rejectValue: string;
      
    }
>(
  "summary/getSummary",
    async ({document_key,option_data}, { rejectWithValue }) => {
        try {
            const response = await summarizerService.getSummary(document_key,option_data);
            return response.data;
        } catch {
           return rejectWithValue("failed get summary");
        }
    }
);

export const getListFiles = createAsyncThunk<
    any[], 
    void,
    {
      state: RootState;
      rejectValue: string;
      
    }
>(
  "summary/getListFiles",
    async (_, { rejectWithValue }) => {
        try {
            const response = await summarizerService.getListFiles();
            return response?.data || [];
        } catch {
           return rejectWithValue("Failed get existing files");
        }
    }
);
