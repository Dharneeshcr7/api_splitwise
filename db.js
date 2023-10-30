const mongoose = require('mongoose');

const mongoURI = `${process.env.MONGO_URL}`

const connectToMongo = ()=>{
    mongoose.connect(mongoURI, (err)=>{
        if(err)
        console.log(mongoURI);
        else
          console.log("conn with db set")
    })
}

module.exports = connectToMongo;