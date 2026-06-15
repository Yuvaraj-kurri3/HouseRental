import userModel from '../models/UserSchema.js'
import bookingModel from '../models/BookingSchema.js'
import PropertyModel from '../models/PropertySchema.js'


export const AllUsers= async(req,res)=>{

try{
        const users= await userModel.find({type: {$in: ["Renter", "Owner"]}},{_id:1, name:1,phoneNumber:1,type:1, email:1, PermissionStatus:1});
    return res.status(200).json({message:"all users fetched", users});
}
catch(error){
    console.error({error})
    return res.status(400).json({message:"error while fetching Users", error})
}

}

export const getAllProperties = async(req,res)=>{
    try {
        const response= await PropertyModel.find({});
        return res.status(200).json({message:"Properties Fetched Successfully", properties:response});
        
    } catch (error) {
        console.error('Error while fetching All Properties:', error);
        return res.status(400).json({message:"Error while Fetching All Properties", error:error.message});
    }
}

export const getAllBookings= async(req,res)=>{
try{
    const  bookings= await bookingModel.find({});
    return res.status(200).json({message:"Bookings Fetched SuccessFully", bookings});


}catch(error){
console.error("Error while Fetching Bookings:",error);
return res.status(400).json({message:"Error Fetching Bookings", error})
}
}

export const updatePermissionStatus= async(req,res)=>{
    try {
        const {userId, PermissionStatus}=req.body;
        console.log(userId, PermissionStatus);
       const upatedData= await userModel.findByIdAndUpdate({_id:userId}, 
        
        {$set:{PermissionStatus:PermissionStatus}}, {new:true},{password:1});


        return res.status(200).json({message:"Status Updated Successfully", upatedData});
        
    } catch (error) {
        console.error('Error while Updating Permission Status');
        return res.status(400).json({message: "Error while Updating Permission", error});
    }

}

export const deleteUser= async(req,res)=>{

    try{
        const {userId}=req.params;
        console.log("UserId:", userId);
        
        // Delete from userModel
        var existinguser= await userModel.findById(userId);
        if(existinguser) {
            await userModel.deleteOne({_id:userId});
        }

        // Delete from bookingModel where user is renter OR owner
        var existingBookings= await bookingModel.find({$or: [{userId:userId}, {ownerId:userId}]});
        if(existingBookings && existingBookings.length > 0){
            await bookingModel.deleteMany({$or: [{userId:userId}, {ownerId:userId}]});
        }

        // Delete from PropertyModel where user is owner
        var existingProperties= await PropertyModel.find({ownerId:userId});
        if(existingProperties && existingProperties.length > 0){
            await PropertyModel.deleteMany({ownerId:userId});
        }

        return res.status(200).json({message:"User Deleted Successfully."});
    }catch(error){
        console.error("Error while deleting User: ", error);
        return res.status(400).json({message:"error while deleting User."});
    }
}