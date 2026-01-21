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
import "pdfjs-dist/legacy/build/pdf.worker.mjs";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import { IconCloudUpload, IconFileTypePdf } from "@tabler/icons-react";
import { useAppDispatch } from "@/store/hooks";
import { uploadcontent } from "@/store/summarizerSlice";
import { filterSchema, type FilterSchemaType} from "@/lib/validations";
import SummaryFilter from "./summaryFilter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export type UploadState = "idle" | "uploaded" | "confirmed";

interface UploadContentProps  {
    onGenerate: (filter_data: FilterSchemaType) => void;
    original_name:string;
};

const UploadContent = ({ onGenerate,original_name }: UploadContentProps)=> {    
    const dispatch = useAppDispatch();
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
    
    
    const handleConfirm = async(event: React.FormEvent<HTMLFormElement>)=>{
        event.preventDefault();
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
        
        try {
            const response = await summarizerService.uploadContent(formData);
            if (response?.data) {
                let data = response?.data;
                dispatch(uploadcontent({
                    document_id: data.document_id, 
                    original_name: data.original_name
                }));
            }
        } catch (error) {
            toast.error("Failed upload content");
        }

    }
    
    const handleCancel = () => {
        setSelectedFile(null);
        setUploadStatus("idle");
    };
    
    const form = useForm<FilterSchemaType>({
        resolver: zodResolver(filterSchema),
        defaultValues: {
            title : "",
            language :"english",
            summaryType :"concise",
            pages :"all"

        }
    })
    useEffect(() => {
        if (original_name) {
            form.setValue("title", original_name);
        }
    }, [original_name, form]);
    
    const onSubmit = (filter_data: FilterSchemaType) => {
        onGenerate(filter_data);
    } 

    return (
        <section className="">
            <Card>
                <CardContent>
                    {uploadStatus === "idle" && (
                        <section
                            className="flex flex-col gap-4 aspect-video items-center justify-center "
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
                            <IconCloudUpload size={48} className="mx-auto" />
                            <p className="text-lg md:leading-snug leading-7 ">
                                Upload a content to get a summary.
                            </p>
                            <Button
                                size={'lg'} 
                                type="button" 
                                className=" "
                                onClick={() => fileInputRef.current?.click()}    
                            >
                                Select files
                            </Button>
                        </section>
                    )}
                    {uploadStatus === "uploaded" && selectedFile && (
                        <form 
                            onSubmit={handleConfirm}
                            className="flex flex-col gap-4 aspect-video items-center justify-center "    
                        >
                            <div className="flex gap-4">
                                <IconFileTypePdf />
                                <p>{selectedFile.name}</p>
                            </div>
                            <div className="">
                                <h6 className=" text-lg font-bold ">
                                    Please confirm this is the file you would like to upload
                                </h6>
                            </div>
                            <section className="flex flex-col gap-4  ">
                                <Button 
                                    size={'lg'}
                                    type="submit" 
                                    className=""    
                                >
                                    Confirm
                                </Button>
                                <Button 
                                    size={'lg'}
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
                        <form 
                            id="form-rhf"
                            className="flex flex-col gap-6 "
                            onSubmit={form.handleSubmit(onSubmit)}    
                        >
                            <SummaryFilter form={form}/>
                            <Button 
                                type="submit" 
                                className=""
                                form="form-rhf"
                            >
                                Generate
                            </Button>  
                        </form>  
                    )}
                </CardContent>
            </Card>            
        </section>
    )
}
export default UploadContent;