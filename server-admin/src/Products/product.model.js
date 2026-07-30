import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    
    name:{
        type:String,
        required:true
    },

    category:{
        type:String,
        enum:["desayunos","almuerzos","refaccion","bebidas","snacks","complementos"],
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
        required:true,
        default: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80'
    },

    allowAccompaniments:{
        type:Boolean,
        default:false
    },

    accompaniments:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Product"
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