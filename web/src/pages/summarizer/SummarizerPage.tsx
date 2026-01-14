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
    // const documents = summarizerService.getCurrentDocument()
    // const document_id = documents?.document_id || null ;
    // useEffect(() => {
    //     const stored = sessionStorage.getItem("document");
    //     if (stored) {
    //         setCurrentDocument(JSON.parse(stored));
    //     }
    // }, []);

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
        <div className="mx-auto mt-6 max-w-lg md:mt-10">
            {/* <section className="text-center">
                <h1 className="scroll-m-20 text-center text-4xl md:text-5xl font-bold">
                    Summarize content in seconds
                </h1>
                <p className="mx-auto mt-6 max-w-md md:text-lg md:leading-snug leading-7 [&:not(:first-child)]:mt-6 ">
                    Upload a content to get a quick, clear, and shareable summary.
                </p>
            </section> */}
            {status === "idle" ? (
                <section>
                    <UploadContent onUploaded={handleUploaded}/>
                    <Button 
                        type="submit" 
                        className="mt-4"
                        onClick={handleGenerate}
                    >
                        Generate
                    </Button>  
                </section>
            ) : (
                <section className="mt-2 items-center justify-center rounded-lg border  bg-white">
                   <div className="">
                        <p className="md:text-lg">{currentDocument?.original_name}</p>
                    </div> 
                    <div className="mt-4 flex gap-4">
                           {status === "loading"  && (
                               <p>Loading ...</p>
                           )}
                           {status === "received" && (
                               <section>
                                   {/* <h2 className="text-xl font-semibold text-gray-900">{title}</h2> */}
                                   {/* <p className="mt-2 text-sm">{data?.summary}</p> */}
                               </section>
                           )}
                    </div>
                </section>
            )}
        </div> 
    )
}
export default SummarizerPage;