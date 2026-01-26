import React,{useState,useRef, useEffect}  from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { toast } from "sonner"
import UploadContent from "@/components/UploadContent";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import type { RootState } from "@/store/store";
import type { OptionSchemaType } from "@/lib/validations";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { getListFiles, getSummaryThunk } from "@/store/thunk";
import type { NormalizedData } from "@/types/summarizer";
import { IconAlertCircleFilled } from "@tabler/icons-react";

const SummarizerPage =  ()=> {
    const dispatch = useAppDispatch();    
    const {document_key, original_name,summary,status, error } = useAppSelector((state : RootState) => state.summarizer );  
    
    useEffect(() => {
        dispatch(getListFiles())
            .catch(() => {
                toast.error("Failed to get existing files");
            });
    }, [dispatch]);

    const handleGenerate = async(option_data: NormalizedData)=>{        
        if (!document_key) {
            toast.warning("Please upload a document first");
            return;
        }
        try {
            dispatch(getSummaryThunk({document_key,option_data}));
        } catch (error) {
            toast.error("Failed to generate summary");
        } 
    }

    return (
        <div className="max-w-xl mx-20 py-10">
            {/* <section className="text-center">
                <h1 className="scroll-m-20 text-center text-4xl md:text-5xl font-bold">
                    Summarize content in seconds
                </h1>
            </section> */}
            {status.summary === "idle" ? (
                <section>
                    <UploadContent onGenerate={handleGenerate} original_name={original_name}  />
                </section>
            ) : (
                <section className="flex flex-col gap-4 items-center justify-center ">
                    {status.summary === "loading"  &&  (
                        <Empty className="w-full">
                            <EmptyHeader>
                                <EmptyMedia variant="icon">
                                    <Spinner className="size-8" />
                                </EmptyMedia>
                                <EmptyTitle>Processing your request</EmptyTitle>
                                <EmptyDescription>
                                    Please wait while we process your request. Do not refresh the page.
                                </EmptyDescription>
                            </EmptyHeader>
                            {/* <EmptyContent>
                                <Button variant="outline" size="sm">
                                Cancel
                                </Button>
                            </EmptyContent> */}
                        </Empty>
                    )}
                    {status.summary === "received" && (
                        <section>
                            <div className="flex justify-between">
                                <Item variant="outline" size="sm">
                                    <ItemMedia>
                                        <IconAlertCircleFilled className="size-8" color="red" />
                                    </ItemMedia>
                                    <ItemContent>
                                        <ItemTitle>This is a lecture mode - press create to edit  </ItemTitle>
                                    </ItemContent>
                                </Item>   
                                <Button
                                    type="button"
                                >
                                    Create
                                </Button>
                            </div>
                            <div className="py-5">
                                <ReactMarkdown 
                                    remarkPlugins={[remarkGfm]}
                                    components={{
                                        h2: ({ node, ...props }) => (
                                            <h2
                                                className="mt-8 mb-4 text-2xl font-bold tracking-tight"
                                                {...props}
                                            />
                                        ),
                                        h3: ({ node, ...props }) => (
                                            <h3
                                                className="mt-6 mb-2 text-xl font-semibold"
                                                {...props}
                                            />
                                        ),
                                        p: ({ node, ...props }) => (
                                            <p
                                                className="mb-4 leading-relaxed text-muted-foreground"
                                                {...props}
                                            />
                                        ),
                                        ul: ({ node, ...props }) => (
                                            <ul
                                                className="mb-4 ml-6 list-disc space-y-2"
                                                {...props}
                                            />
                                        ),
                                        li: ({ node, ...props }) => (
                                            <li className="leading-relaxed" {...props} />
                                        ),
                                        strong: ({ node, ...props }) => (
                                            <strong className="font-semibold text-foreground" {...props} />
                                        ),
                                    }}
                                >
                                    {summary.content}
                                </ReactMarkdown>
                            </div>
                        </section>
                    )}
                    {status.summary === "rejected" && (<p>Error : {error}</p>)}
                </section>
            )}
        </div> 
    )
}
export default SummarizerPage;