//This file will handle the retrieval of data from gitlab
import axios from "axios";

export const getAllMRs = async (projectID:string, userAccessToken:string )=>{
    try {
        const result:any = await axios.get(`https://gitlab.com/api/v4/projects/${projectID}/merge_requests`,{headers:{'PRIVATE-TOKEN': userAccessToken}});
    if(result && result.data){
        console.log(result);
        return result.data;
    }
    } catch (error) {
        console.log(error);
        return "API EPIC FAIL";
    }
 
};
 
// GET /projects/:id/merge_requests/:merge_request_iid
export const currentMRNotes = async (projectID:string, userAccessToken:string, mergeRequestID:string )=>{
    try {
        const result:any = await axios.get(`https://gitlab.com/api/v4/projects/${projectID}/merge_requests/${mergeRequestID}/notes`,{headers:{'PRIVATE-TOKEN': userAccessToken}});
    if(result && result.data){
        console.log(result);
        return result.data;
    }
    } catch (error) {
        console.log(error);
        return "API EPIC FAIL";
    }
};