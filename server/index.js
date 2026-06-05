import e from "express";
import mongoose from "mongoose";
import env from 'dotenv'

import authRouter from "./routes/auth.js";


env.config();
const app = e();
const PORT = 3000;  
const URI = process.env.MONGO_URI

app.use(e.json());
app.use('/auth', authRouter);



mongoose.connect(URI, {
    appName: 'URI'
}).then(() => console.log('DB connected successfully!')).catch(err => console.log(err));



app.get('/', (req, res) => {
    res.json({
        server: `expense-splitter`,
        status: 'healthy'
    });
})



app.listen(PORT, () => {
    console.log(`expense-splitter server listening on port ${PORT}`);
})

