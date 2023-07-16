var ResponseObj = {
    status:null,
    data:null,
    message:"",
    error:"",
    page:null,
    limit:null,
}

const sendResponse = (status,data,message,error,page,limit) =>{
    ResponseObj.status = status;
    ResponseObj.data = data;
    ResponseObj.message = message;
    ResponseObj.error = error;
    ResponseObj.page = page;
    ResponseObj.limit = limit;
    return ResponseObj
}

module.exports = sendResponse;