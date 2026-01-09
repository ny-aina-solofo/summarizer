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

const SummarizerPage = ()=> {    
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.currentTarget.files?.[0];
        if (!file) return;

        if (file.type !== "application/pdf") {
            toast.error("Please select a PDF file");
            return;
        }

        setSelectedFile(file);
    };

    const handleSubmit = ()=>{
        const formData = new FormData();
         if (!selectedFile) {
            toast.error("No file selected");
            return;
        }
        formData.append('pdf-file' , selectedFile); 
        // console.log(formData);
        setSelectedFile(null)
        summarizerService.summarizeContent(formData).then()
    }


    return (
        <div className="flex flex-col mt-10 gap-4 px-40 py-10 ">
            <section className="text-center">
                <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
                    Summarize content in seconds
                </h1>
                <p className="leading-7 [&:not(:first-child)]:mt-6 px-52">
                    Upload a content to get a quick, clear, and shareable summary.
                </p>
            </section>
            <section className="px-52 ">
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