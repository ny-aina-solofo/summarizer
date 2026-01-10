import React,{useState,useRef}  from "react";
import {
  Card,
  CardContent,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";
import summarizerService from "@/services/summarizer.service";
import { toast } from "sonner"
import "pdfjs-dist/legacy/build/pdf.worker.mjs";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

const SummarizerPage = ()=> {    
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.currentTarget.files?.[0];
        if (file === undefined) return;
        if (file.size > 15 * 1024 * 1024) {
            toast.warning("File size must be less than 10MB");
            setSelectedFile(null);
            return;
        } 
        setSelectedFile(file);
    };
    
    const handleSubmit = async()=>{
        const formData = new FormData();
        if (selectedFile === null) {
            toast.warning("No file selected");
            return;
        }
        formData.append('pdf-file' , selectedFile); 
        
        const arrayBuffer = await selectedFile.arrayBuffer();
        const pdf = await getDocument({ data: arrayBuffer }).promise;
        if (pdf.numPages > 500) {
            toast.warning("PDF too large (500 pages max)");;
            setSelectedFile(null)
            return;
        }
        summarizerService.summarizeContent(formData).then()
        setSelectedFile(null)
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
            <section className="relative mx-auto mt-20 max-w-md px-4 md:mt-16">
                <Card>
                    <CardContent>
                        <div className="flex flex-col gap-4">
                            <CardTitle>upload content</CardTitle>
                            <section 
                                className={`mt-2 flex aspect-video cursor-pointer items-center justify-center rounded-lg border border-dashed bg-gray-100 `}
                                onClick={() => fileInputRef.current?.click()}    
                            >
                                <Input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="application/pdf,.pdf"
                                    required={!selectedFile}
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                                <div className="text-center">
                                    {selectedFile ? (
                                        <p>{selectedFile.name}</p>
                                    ) : (
                                        <Button 
                                            type="button" 
                                            className="md:text-base"
                                            onClick={() => fileInputRef.current?.click()}    
                                        >
                                            Select PDF
                                        </Button>
                                    )}
                                </div>
                            </section>

                        </div>
                    </CardContent>
                </Card>
                <Button 

                    type="submit" 
                    className="mt-4"
                    onClick={handleSubmit}
                >
                    Generate
                </Button>
            </section>
        </div> 
    )
}
export default SummarizerPage;