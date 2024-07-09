//This file will handle the retrieval of data from gitlab

enum apiKeys{
    default = '',
    mergeRequests = '',
    mrComments = ''
    
}

//Should be set from the settings page
let userAccessToken = '';
let repoID;
let userName;

