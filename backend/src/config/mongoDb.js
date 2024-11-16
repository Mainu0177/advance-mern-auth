const { default: mongoose } = require("mongoose")
const { mongoDbUrl } = require("./secret");




const connectDatabase = async (option = {}) =>{
    try {
        await mongoose.connect(mongoDbUrl, option);
        console.log("MongoDb is connected successfully");

        mongoose.connection.on("error", (error) =>{
            console.log("DB connection faild: ", error);
        });
    } catch (error) {
        console.log("Could not connect to DB: ", error.toString())
    }
}

module.exports = connectDatabase;