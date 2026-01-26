export type SummarizerState = {
    document_key: string,
    original_name: string,
    summary : any,
    existing_files:any[],
    status: {
        listFiles: "idle" | "loading" | "received" | "rejected";
        summary: "idle" | "loading" | "received" | "rejected";
    }
    error: string | null;
}

export type ExistingFiles = {
    document_id :number ,
    original_name : string,
    file_name : string,
    path : string,
    size : string,
    mime_type : string,
    date_creation : string
}


export type NormalizedData = {
    title: string,
    language: string,
    summaryType: string,
    pages: string | undefined
}