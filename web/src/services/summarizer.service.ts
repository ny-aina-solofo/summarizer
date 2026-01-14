import axios from "axios"; 

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const http =  axios.create({
    baseURL : API_BASE_URL,
}); 

class SummarizerService {

    async uploadContent(formData: FormData){
        const response = await http.post('/upload-content', formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        if (response.data && response.data.document_id) {
            sessionStorage.setItem('document', JSON.stringify(response.data));    
            return response;
        };
    }
    
    getSummary(document_id:string){
        return http.post(`/get-summary/${document_id}`);
    }
    getCurrentDocument() {
        const document = sessionStorage.getItem("document");
        if (document) {
            return JSON.parse(document);
        }
        return null;
    };

    
    deleteCurrentDocument() {
        return sessionStorage.removeItem("document");
        
    };

    

}

export default new SummarizerService();
