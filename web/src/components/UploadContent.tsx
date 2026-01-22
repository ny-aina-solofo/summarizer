import React,{useState,useRef, useEffect}  from "react";
import {
  Card,
  CardContent,
  CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";
import summarizerService from "@/services/summarizer.service";
import { toast } from "sonner"
import "pdfjs-dist/legacy/build/pdf.worker.mjs";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import { IconCloudUpload, IconFileTypePdf } from "@tabler/icons-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { uploadcontent } from "@/store/summarizerSlice";
import { filterSchema, type OptionSchemaType} from "@/lib/validations";
import SummaryOptions from "./SummaryOptions";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ExistingFiles } from "@/types/summarizer";
import type { RootState } from "@/store/store";

export type UploadState = "idle" | "uploaded" | "confirmed";

interface UploadContentProps  {
    onGenerate: (option_data: OptionSchemaType) => void;
    original_name:string;
};


const UploadContent = ({ onGenerate,original_name }: UploadContentProps)=> {    
    const dispatch = useAppDispatch();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [existingFile, setExistingFile] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [uploadStatus, setUploadStatus] = useState<UploadState>("idle");
    const {existing_files,document_key} = useAppSelector((state : RootState) => state.summarizer );  
        

    const form = useForm<OptionSchemaType>({
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
    
    const handleSelectExistingFile = (file_name: string) => {
        setExistingFile(file_name);

        const file = existing_files.find(
            (f) => f.file_name === file_name
        );

        if (!file) return;
        
        dispatch(uploadcontent({
            document_key: file.file_name,
            original_name: file.original_name,
        }));

        setUploadStatus("confirmed");
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
                    document_key: data.document_key, 
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
    
    const onSubmit = (option_data: OptionSchemaType) => {
        onGenerate(option_data);
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
                            <p>Or, upload from an existing file</p>
                            <Select value={existingFile} onValueChange={handleSelectExistingFile}>
                                <SelectTrigger
                                    className="w-[180px]"
                                    aria-label="Select a value"
                                >
                                    <SelectValue placeholder="select an existing file" />
                                </SelectTrigger>
                                <SelectContent className="rounded-lg">
                                    {existing_files.map((e:ExistingFiles)=>(
                                        <SelectItem 
                                            key={e.document_id} 
                                            value={e.file_name} 
                                        >
                                            {e.original_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </section>
                    )}
                    {uploadStatus === "uploaded" && selectedFile && !existingFile && (
                        <form 
                            onSubmit={handleConfirm}
                            className="flex flex-col gap-4 aspect-video items-center justify-center "    
                        >
                            <div className="flex gap-4">
                                <IconFileTypePdf />
                                { selectedFile ? (
                                    <p>{selectedFile.name}</p>
                                ) : (
                                    <p>{existingFile}</p>
                                )}
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
                    {uploadStatus === "confirmed" && document_key && (
                        <form 
                            id="form-rhf"
                            className="flex flex-col gap-6 "
                            onSubmit={form.handleSubmit(onSubmit)}    
                        >
                            <SummaryOptions form={form}/>
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