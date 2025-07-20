 import {v2 as cloudinary} from "cloudinary"
 import fs from "fs/promises"


 cloudinary.config({ 
        cloud_name:process.env.CLOUDINARY_CLOUD_NAME , 
        api_key:process.env.CLOUDINARY_API_KEY , 
        api_secret:process.env.CLOUDINARY_API_SECRET
    });
 
   const uploadOnCloundinary=async (localFilePath)=>{
    try {
        if(!localFilePath) return "File not found"
         const respone =await cloudinary.uploader.upload(localFilePath,
            {
                resource_type:"auto"
            })
            console.log('Fileuploaded succesfully on cloudinary');
            await fs.unlink(localFilePath);
            return respone;
    } catch (error) {
        await fs.unlink(localFilePath);
        return null;
    }
   }

 export {uploadOnCloundinary};
    