import axios from "axios"; 

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const http =  axios.create({
    baseURL : API_BASE_URL,
}); 

class SummarizerService {

    summarizeContent(formData: FormData){
        return http.post('/summarize-content',formData,{
            headers: {
               "Content-Type": "multipart/form-data",
            },
        });
    }

}

export default new SummarizerService();
