import mongoose from "mongoose"

const accompanimentsSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true
    },

    price:{
        type:Number,
        default:0
    },

    isActive:{
        type:Boolean,
        default:true
    },

    photo:{
        type:String,
        required:true
    },

    isDeleted:{
        type:Boolean,
        default:false
    }
}, {timestamps:true})

export default mongoose.model("Accompaniment", accompanimentsSchema);