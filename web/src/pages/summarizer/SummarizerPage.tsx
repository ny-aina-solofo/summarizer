import React,{useState,useRef, useEffect}  from "react";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { toast } from "sonner"
import UploadContent from "@/components/UploadContent";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import type { RootState } from "@/store/store";
import type { OptionSchemaType } from "@/lib/validations";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { getListFiles, getSummaryThunk } from "@/store/thunk";
import type { NormalizedData } from "@/types/summarizer";

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
        <div className="mx-auto mt-6 max-w-xl md:mt-10 px-4">
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
                   <div className="">
                        <p className="md:text-lg">{original_name}</p>
                    </div> 
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
                                <EmptyContent>
                                    <Button variant="outline" size="sm">
                                    Cancel
                                    </Button>
                                </EmptyContent>
                            </Empty>
                        )}
                        {status.summary === "received" && (
                            <section>
                                <p>Status: {status.summary}</p>
                                <p>Type summary: {typeof summary}</p>
                                <p className="mt-2 text-sm">content : {summary}</p>
                            </section>
                        )}
                        {status.summary === "rejected" && (<p>Error : {error}</p>)}
                </section>
            )}
        </div> 
    )
}
export default SummarizerPage;