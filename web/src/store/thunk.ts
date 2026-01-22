import { createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import type { OptionSchemaType } from "@/lib/validations";
import summarizerService from "@/services/summarizer.service";

export const getSummaryThunk = createAsyncThunk<
    string, 
    {
        document_key: string;
        option_data: OptionSchemaType;
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
