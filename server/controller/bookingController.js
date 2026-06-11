import PropertyModel from "../models/PropertySchema.js";
import UserModel from "../models/UserSchema.js";
import BookingModel from "../models/BookingSchema.js";

export const bookProperty= async(req,res)=>{

    try{
        const {propertyId,userid}= req.params;
        const propertyData= await PropertyModel.findById(propertyId).populate("ownerId");
        const ownerId= propertyData.ownerId._id;
        const user=await UserModel.findById({_id:userid},{name:1,phoneNumber:1,email:1,type:1});

        if(!propertyData){
            return res.status(404).json({message:"Property not found"});
        }
            if(!user){
                return res.status(404).json({message:"User not found"});
            }
            console.log("user",user);
            console.log("ownerId",ownerId);
        // const booking= new BookingModel({
        //     propertyId,
        //     ownerId,
        //     userId:userid,
        //     tenantName:user.name,
        //     phoneNumber:user.phoneNumber,
        //     bookingStatus:"pending"
        // });
        // propertyData.availability=false;
        // await propertyData.save();
        // await booking.save();

        // return res.status(200).json({message:"Property booked successfully",booking:booking,property:propertyData, user:user});

                return res.status(200).json({message:"Property booked successfully", user:user});

    }catch(error){

        console.error("Error booking property:", error);
        return res.status(500).json({message:"Internal server error"});
    }

}

export const getUserBookings=async(req,res)=>{
    try{

            const {userId}= req.params;
            const bookings= await BookingModel.find({userId}).populate('propertyId').populate('ownerId');
            return res.status(200).json({message:"User bookings fetched successfully",bookings});

    }catch(error){

            console.error("Error fetching user bookings:", error);
            return res.status(500).json({message:"Internal server error"});

    }
}

export const changebookingStatus= async(req,res)=>{

try{
    const {bookingId}= req.params;
    const {bookingStatus}= req.body;

    const BookingData= await BookingModel.findByIdAndUpdate(bookingId,{bookingStatus: bookingStatus || "confirmed"},{new: true});

    if(!BookingData){
        return res.status(404).json({message:"Booking not found"});
    }
    return res.status(200).json({message:"Booking status updated successfully",booking:BookingData});
}
catch(error){

    console.error("Error changing booking status:", error);
    return res.status(500).json({message:"Internal server error"}); 

}
}