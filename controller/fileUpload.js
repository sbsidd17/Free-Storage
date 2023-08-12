const { uploadViaUrl } = require("../utils/uploadViaUrl")

exports.fileUpload = async(req, res)=>{
    const {name, url} = req.body
    if(!name || !url){
        res.status(400).json({
            sucess:false,
            msg : "All Fields Are Required",
        })
    }
    try {
        const result = await uploadViaUrl(url)
        res.status(200).json({
            sucess:true,
            msg : "File Uploaded Successfully",
            url : result
        })
    } catch (error) {
        res.status(400).json({
            sucess:false,
            msg : error.message
        })
    }
}