import PropertyModel from "../models/PropertySchema.js";
 
export const getAllProperties= async(req,res)=>{
    try{
        const properties= await PropertyModel.find();
        return res.status(200).json({properties});
    }
    catch(error){
        console.error("Error fetching properties:", error);
        return res.status(500).json({message:"Internal server error"});
    }
}

export const getSingleProperty= async(req,res)=>{
    try{
        const {propertyId}= req.params;
        const property= await PropertyModel.findById(propertyId);
        if(!property){
            return res.status(404).json({message:"Property not found"});
        }   
        return res.status(200).json({property});
    }
    catch(error){
        console.error("Error fetching property:", error);
        return res.status(500).json({message:"Internal server error"});
    }
}

