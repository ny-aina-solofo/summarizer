import React,{useState,useRef}  from "react";
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
} from "@/components/ui/select"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";
import summarizerService from "@/services/summarizer.service";
import { toast } from "sonner"
import "pdfjs-dist/legacy/build/pdf.worker.mjs";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import { IconCloudUpload, IconFileTypePdf } from "@tabler/icons-react";
import { Label } from "./ui/label";
import { pages, summaryType } from "@/lib/utils";
import { Checkbox } from "./ui/checkbox";
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
        // const response = await summarizerService.uploadContent(formData);

        // if (response?.data) {
        //     onUploaded(response.data); // 🔥 NOTIFIER LE PARENT
        // }
    }
    
    const handleCancel = () => {
        setSelectedFile(null);
        setUploadStatus("idle");
    };

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
                            className="flex flex-col gap-6 "
                            // onSubmit={}    
                        >
                            <div className="grid gap-2">
                                <Label htmlFor="Title">Title</Label>
                                <Input
                                    id="Title"
                                    type="Title"
                                    placeholder="m@example.com"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="Language">Language</Label>
                                <Select>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Theme" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="French">French</SelectItem>
                                        <SelectItem value="English">English</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="summary-type">How long should the note be?</Label>
                                <FieldGroup className="flex flex-row flex-wrap gap-4 rounded-lg">
                                    {summaryType.map((option) => (
                                        <FieldLabel
                                            htmlFor={option.value}
                                            key={option.value}
                                            className="!w-fit"
                                        >
                                            <Field
                                                orientation="horizontal"
                                                className="overflow-hidden !px-3 !py-2.5 transition-all duration-100 ease-linear group-has-data-[state=checked]/field-label:!px-3"
                                            >
                                                <Checkbox
                                                    value={option.value}
                                                    id={option.value}
                                                    defaultChecked={option.value === "social-media"}
                                                    className="hidden"
                                                />
                                                <FieldTitle>{option.label}</FieldTitle>
                                            </Field>
                                        </FieldLabel>
                                    ))}
                                </FieldGroup>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="summary-type">What pages would you like?</Label>
                                <FieldGroup className="flex flex-row flex-wrap gap-4 rounded-lg">
                                    {pages.map((option) => (
                                        <FieldLabel
                                            htmlFor={option.value}
                                            key={option.value}
                                            className="!w-fit"
                                        >
                                            <Field
                                                orientation="horizontal"
                                                className="overflow-hidden !px-3 !py-2.5 transition-all duration-100 ease-linear group-has-data-[state=checked]/field-label:!px-3"
                                            >
                                                <Checkbox
                                                    value={option.value}
                                                    id={option.value}
                                                    className="hidden"
                                                />
                                                <FieldTitle>{option.label}</FieldTitle>
                                            </Field>
                                        </FieldLabel>
                                    ))}
                                </FieldGroup>
                            </div>
                            <Button 
                                type="submit" 
                                className=""
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