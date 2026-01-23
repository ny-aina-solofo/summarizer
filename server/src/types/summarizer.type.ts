export type Chunk = {
  text: string;
  summary?: string;
  title?: string;
};

export type OptionSchemaType = {
    title: string;
    language: string;
    summaryType: string;
    pages: string | undefined;
}
