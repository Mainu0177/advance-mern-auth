const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const createError = require('http-errors');

const router = require('./src/routers/userRouter')
const { errorResponse } = require('./src/helper/responseController');




const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// all routers
app.use('/api/users', router)

// client error handling
app.use((req, res, next) =>{
    next(createError(404, 'Route not found'))
})

// server error handling
app.use((err, req, res, next) =>{
    return errorResponse(res, {
        statusCode: err.status,
        message: err.message
    })
})


module.exports = app;