import mongoose from 'mongoose';

const bookingModel= mongoose.Schema({

propertyId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"PropertySchema",
    required:[true,"Please enter the property ID"]
},
ownerId:{
type:mongoose.Schema.Types.ObjectId,
ref:"UserSchema",
required:[true,"Please enter the owner ID"]

},
userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"UserSchema",
    required:[true,"Please enter the user ID"]
},
tenantName:{
    type:String,
    required:[true,"Please enter the tenant name"]
},
phoneNumber:{
    type:String,
    required:[true,"Please enter the phone number"]
},
bookingStatus:{
    type:String,
    enum:["pending","confirmed","cancelled"],
    default:"pending"
}




},{
    strict:false
});

export default mongoose.model("BookingSchema",bookingModel);