import mongoose from 'mongoose';

const PropertyModel= mongoose.Schema({

    ownerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"UserSchema",
        required:[true,"Please enter the owner ID"]
    },

   propertyType:{
    type:String,
    required:[true,"Please enter the property type"]
    },

    propertyAdType:{
    type:String,
    required:[true,"Please enter the property type"]
    },

      propertyAddress:{
    type:String,
    required:[true,"Please enter the property address"]
    },

    ownerContact:{
    type:String,
    required:[true,"Please enter the owner contact number"]
    },

    propertyAmount:{
    type:Number,
    required:[true,"Please enter the property amount"],
    default:0
    },
    
    propertyImages:{
    type:String,
    required:[true,"Please enter the property images"]
    },

    additionalDetails:{
    type:String,
    required:[true,"Please enter the additional details"]
    },

    OwnerName:{
    type:String,
    required:[true,"Please enter the owner name"]
    },
    availability:{
    type:Boolean,
    default:true
    }

});

export default mongoose.model("PropertySchema",PropertyModel);