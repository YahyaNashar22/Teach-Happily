import mongoose from 'mongoose';

const databaseConnection = () => {
    mongoose.connect(process.env.MONGO_URL).then(() => {
        console.log("Successfully Connected To Database!");
    }).catch((err) => {
        console.error(err)
        console.log("Failed To Connect To Database!");
    })
}

export default databaseConnection;