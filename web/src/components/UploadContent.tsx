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

export type UploadState = "idle" | "uploaded" | "confirmed";

interface UploadContentProps  {
    onUploaded: (doc: { document_id: string; original_name: string }) => void;
};

const UploadContent = ({ onUploaded }: UploadContentProps)=> {    
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [uploadStatus, setUploadStatus] = useState<UploadState>("idle");

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.currentTarget.files?.[0];
        if (file === undefined) return;
        if (file.size > 15 * 1024 * 1024) {
            toast.warning("File size must be less than 10MB");
            setSelectedFile(null);
            return;
        } 
        setSelectedFile(file);
        setUploadStatus("uploaded");
    };
    
    
    const handleConfirm = async(e: React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault()
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
        setUploadStatus("confirmed")
        const response = await summarizerService.uploadContent(formData);

        if (response?.data) {
            onUploaded(response.data); // 🔥 NOTIFIER LE PARENT
        }
    }
    
    const handleCancel = () => {
        setSelectedFile(null);
        setUploadStatus("idle");
    };

    return (
        <div className="mx-auto mt-6 max-w-lg md:mt-10">
            <section className="relative mx-auto mt-20 max-w-md px-4 md:mt-16">
                <Card>
                    <CardContent>
                        <div className="flex flex-col gap-4">
                            <CardTitle>upload content</CardTitle>
                            {uploadStatus === "idle" && (
                                <section
                                    className="mt-2 flex aspect-video cursor-pointer items-center justify-center rounded-lg border border-dashed bg-gray-100"
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
                                        <Button 
                                            type="button" 
                                            className=""
                                            onClick={() => fileInputRef.current?.click()}    
                                        >
                                            Select PDF
                                        </Button>
                                    </div>
                                </section>
                            )}

                            {uploadStatus === "uploaded" && selectedFile && (
                                <form 
                                    onSubmit={handleConfirm}
                                    className="flex flex-col gap-4 aspect-video  items-center justify-center "    
                                >
                                    <section className="text-center">
                                        <p>{selectedFile.name}</p>
                                        <h6 className=" mt-2 scroll-m-20 text-center  font-bold">
                                            Please confirm this is the file you would like to upload
                                        </h6>
                                    </section>
                                    <section className="flex flex-col gap-2">
                                        <Button 
                                            type="submit" 
                                            className=""    
                                        >
                                            Confirm
                                        </Button>
                                        <Button 
                                            type="button" 
                                            className=""
                                            variant={'outline'}    
                                            onClick={handleCancel}
                                        >
                                            Cancel
                                        </Button>
                                    </section>
                                </form>
                            )}

                            {uploadStatus === "confirmed" && selectedFile && (
                                <div className="mt-2 flex aspect-video cursor-pointer items-center justify-center rounded-lg border border-dashed bg-gray-100">
                                    <p>{selectedFile.name}</p>
                                </div>  
                            )}
                        </div>
                    </CardContent>
                </Card>            
            </section>
        </div> 
    )
}
export default UploadContent;