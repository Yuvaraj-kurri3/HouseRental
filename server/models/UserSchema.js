import mongoose from 'mongoose';

const userModel= mongoose.Schema({

name:{
    type:String,
    required:[true,"Please enter your name"]   ,
    set: function(name){
        return name.charAt(0).toUpperCase() + name.slice(1);
    }
},
email:{
    type:String,
    required:[true,"Please enter your email"],
    unique:true
},
password:{
    type:String,
    required:[true,"Please enter your password"]
},
phoneNumber:{
    type:String,
    required:[true,"Please enter your phone number"]
},
type:{
    type:String,
    required:[true,"Please enter your user type"],
}
},{
    strict:false

});

export default mongoose.model("UserSchema",userModel);