
const app = require('./app');
const connectDatabase = require('./src/config/mongoDb');
const { serverPort } = require('./src/config/secret');



app.listen(serverPort, async () =>{
    console.log(`Server is running at http://localhost:${serverPort}`);
    await connectDatabase();
})