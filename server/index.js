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

app.get('/', (req, res) => {
    res.status(200).json({
        server: `expense-splitter`,
        status: 'healthy'
    });
});


// Central error handling
app.use((err, req, res, next) => {
  // Loggin the error stack on server console
  console.error('[Central Error Handler] : ', err.stack);

  const statusCode = err.statusCode || 500;

  // Send a clean, standardized JSON response to the client
  res.status(statusCode).json({
    status: 'error',
    message: err.message || 'Internal server error',


    // Enabling full stack trace for development mode
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});


app.listen(PORT, () => {
    mongoose.connect(URI, {
        appName: 'URI'
    }).then(() => console.log('DB connected successfully!')).catch(err => console.log(err));
    
    console.log(`expense-splitter server listening on port ${PORT}`);
});

