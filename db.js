const mongoose = require('mongoose');

const mongoURI = `${process.env.MONGO_URL}`

const connectToMongo = ()=>{
    mongoose.connect(mongoURI, (err)=>{
        if(err)
        console.log(Error(err));
        else
          console.log("conn with db set")
    })
}

module.exports = connectToMongo;