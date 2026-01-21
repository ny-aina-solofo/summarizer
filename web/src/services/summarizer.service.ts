import type { FilterSchemaType } from "@/lib/validations";
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
    
    getSummary(document_id:string, filter_data:FilterSchemaType){
        return http.post(`/get-summary/${document_id}`,{filter_data});
    }
    

}

export default new SummarizerService();
