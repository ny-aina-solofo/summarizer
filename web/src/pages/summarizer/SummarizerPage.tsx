import React,{useState,useRef, useEffect}  from "react";
import {
  Card,
  CardContent,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";
import summarizerService from "@/services/summarizer.service";
import { toast } from "sonner"
import UploadContent from "@/components/UploadContent";

export type StatusApp = "idle" | "loading" | "received";

const SummarizerPage = ()=> {    
    const [status, setStatus] = useState<StatusApp>("idle");
    const [currentDocument, setCurrentDocument] = useState<{
        document_id: string;
        original_name: string;
    } | null>(() => {
        const stored = sessionStorage.getItem("document");
        return stored ? JSON.parse(stored) : null;
    });

    const handleUploaded = (doc: {document_id: string;original_name: string;}) => {
        setCurrentDocument(doc);
        sessionStorage.setItem("document", JSON.stringify(doc));
    };

    let data;

    const handleGenerate = async()=>{
        
        if (!currentDocument) {
            toast.warning("Please upload a document first");
            return;
        }

        try {
            setStatus("loading");

            const response =  await summarizerService.getSummary(currentDocument.document_id);
            data = response?.data;

            setStatus("received");
        } catch (error) {
            setStatus("idle");
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
            {status === "idle" ? (
                <section>
                    <UploadContent onUploaded={handleUploaded} />
                </section>
            ) : (
                <section className="flex flex-col gap-4 items-center justify-center rounded-lg border  bg-white">
                   <div className="">
                        <p className="md:text-lg">{currentDocument?.original_name}</p>
                    </div> 
                        {status === "loading"  && (
                            <p>Loading ...</p>
                        )}
                        {status === "received" && (
                            <section>
                                {/* <h2 className="text-xl font-semibold text-gray-900">{title}</h2> */}
                                {/* <p className="mt-2 text-sm">{data?.summary}</p> */}
                            </section>
                        )}
                </section>
            )}
        </div> 
    )
}
export default SummarizerPage;