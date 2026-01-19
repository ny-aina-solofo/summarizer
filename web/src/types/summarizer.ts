export type SummarizerState = {
    document_id: string,
    original_name: string,
    summary : string,
    status: "idle" | "loading" | "received" | "rejected";
    error: string | null;
}
