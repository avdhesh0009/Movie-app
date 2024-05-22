
const mongoose =require( "mongoose");
const userModel = require('./userModel');




let favouriteSchema=mongoose.Schema({
    userId:{
        type:String,
        require:true
        
    },
    id:{
        type:String,
        require:true 
    },
    data:{
        type:Object,
        require:true
        
    }
});

const favourite=mongoose.model('favourite',favouriteSchema);
module.exports={favourite};

