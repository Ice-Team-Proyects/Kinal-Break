import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    
    name:{
        type:String,
        required:true
    },

    category:{
        type:String,
        enum:["desayunos","almuerzos","bebidas","snacks"],
        required:true
    },

    description:{
        type:String
    },

    price:{
        type:Number,
        required:true
    },
    
    isActive:{
        type:Boolean,
        default:true
    },

    photo:{
        type:String,
        required:true
    },

    allowAccompaniments:{
        type:Boolean,
        default:false
    },

    accompaniments:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Accompaniment"
        }
    ],

    isDeleted:{
        type:Boolean,
        default:false
    }

},{
    timestamps:true
});

export default mongoose.model("Product", productSchema);