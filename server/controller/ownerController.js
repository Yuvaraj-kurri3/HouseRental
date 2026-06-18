import PropertyModel from '../models/PropertySchema.js'
import BookingModel from '../models/BookingSchema.js';
import userModel from '../models/UserSchema.js'

export const newProperty = async (req,res)=>{
   try {
    const {ownerId,propertyType,propertyAdType,propertyAddress,ownerContact,propertyAmount,propertyImages,additionalDetails,OwnerName,availability} = req.body;
    const property = new PropertyModel({
        ownerId,
        propertyType,
        propertyAdType,
        propertyAddress,
        ownerContact,
        propertyAmount,
        propertyImages,
        additionalDetails,
        OwnerName,
        availability
    })
    
    await property.save();

    res.status(200).json({
        message:"Property created successfully",
        success:true,
        property
    })
   } catch (error) {
    return res.status(500).json({
        message:"Error in creating property",
        success:false,
        error:error 
    })
   }
}

export const getOwnerProperties = async (req,res)=>{
    try {
        const {ownerId} = req.params;
        const properties = await PropertyModel.find({ownerId});
        res.status(200).json({
            message:"Properties fetched successfully",
            success:true,           
             properties
        })
    } catch (error) {
         res.status(500).json({
            message:"Error in fetching properties",
            success:false,
            error:error
        })
    }
}

export const deleteProperty= async(req,res)=>{
    try{
        const {propertyId}= req.params;
        // Delete all bookings associated with this property
        await BookingModel.deleteMany({propertyId});
        // Delete the property
        await PropertyModel.findByIdAndDelete(propertyId);
       return res.status(200).json({
                 message:"Property deleted successfully",
                 success:true
             })
    }catch(error){
         res.status(500).json({
            message:"Error in deleting property",
            success:false,
            error:error
        })
    }
}

export const updatePropertyDetails= async(req,res)=>{

    try{
        const {propertyId}= req.params;
        const editFormData= req.body;
         const updatedProperty= await PropertyModel.findByIdAndUpdate(propertyId,editFormData,{new:true});
        if(!updatedProperty){
            return res.status(404).json({
                message:"Property not found",
                success:false
            })
        }
        return res.status(200).json({
            message:"Property details updated successfully",
            success:true,
            property:updatedProperty
        })
    }
    catch(error){
         res.status(500).json({
            message:"Error in updating property details",
            success:false,
            error:error
        })
    }
}

export const registerBooking= async(req,res)=>{
    try{
        const {propertyId,ownerId,userId,tenantName,phoneNumber,bookingStatus} = req.body;
        const newBooking= new BookingModel({
            propertyId,
            ownerId,
            userId,
            tenantName,
            phoneNumber,
            bookingStatus
        });
        await newBooking.save();
        return res.status(200).json({
            message:"Booking registered successfully",
            success:true,
            booking:newBooking
        })

    }catch(error){
         res.status(500).json({
            message:"Error in registering booking",
            success:false,
            error:error
        })
    }
}

export const getOwnerBookings= async(req,res)=>{
    try{
        const {ownerId}= req.params;
        const bookings= await BookingModel.find({ownerId}).populate('propertyId').populate('userId');
        return res.status(200).json({
            message:"Bookings fetched successfully",
            success:true,
            bookings
        })
    } catch(error){
         res.status(500).json({
            message:"Error in fetching bookings",
            success:false,
            error:error
        })
    }
}

export const changebookingStatus= async(req,res)=>{

try{
    const {bookingId}= req.params;
    const {bookingStatus}= req.body;

    const BookingData= await BookingModel.findByIdAndUpdate(bookingId,{bookingStatus: bookingStatus},{new: true});

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

export const getMyDetails =async(req,res)=>{
    const {ownerId}=req.params;
    try {
        const owner= await userModel.findOne({_id:ownerId},{password:0})
        return res.status(200).json({message:"Owner Details Fetched", owner});
    } catch (error) {
       console.error("Error while fetching OwnerDetails", error); 
       return res.status(200).json({message:"Error While Fetching Owner Details"});
    }
}