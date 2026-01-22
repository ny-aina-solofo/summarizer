import type { OptionSchemaType } from "@/lib/validations";
import axios from "axios"; 

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const http =  axios.create({
    baseURL : API_BASE_URL,
}); 

class SummarizerService {

    uploadContent(formData: FormData){
        return http.post('/upload-content', formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    }
    
    getSummary(document_key:string, option_data:OptionSchemaType){
        return http.post(`/get-summary/${document_key}`,{option_data});
    }
    
    getListFiles() {
        return http.get(`/get-list-files`);
    }

}

export default new SummarizerService();
