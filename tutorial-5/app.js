const express       = require('express');
const app           = express();
const morgan        = require('morgan');
const bodyParser    = require('body-parser');
const mongoose      = require('mongoose');

const productRoutes = require('./api/routes/products');
const orderRoutes   = require('./api/routes/orders');

mongoose.connect(
    'mongodb://dhanyn10:'+
    process.env.MONGODB_PASSWORD +
    '@cluster0-shard-00-00-uisym.mongodb.net:27017,cluster0-shard-00-01-uisym.mongodb.net:27017,cluster0-shard-00-02-uisym.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority',
    {
        useNewUrlParser: true
    }
);

// middleware
app.use(morgan('dev'));

app.use(bodyParser.urlencoded({
    /**
     * true     : allows you to parse extended body with rich data
     * false    : only allows simple body
     */
    extended: false
}));

app.use(bodyParser.json());

// handling Cross Origin Request
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        // below is which kind of headers you want to accept
        'Origin, X-Requested-With, Content-type, Accept, Authorization'
    );
    // check if incoming request method is equals to 'OPTIONS'
    if(req.method === 'OPTIONS')
    {
        res.header(
                'Access-Control-Allow-Methods',
                // below is which kind of methods you want to accept
                'PUT, POST, PATCH, DELETE, GET'
            );
        return res.status(200).json({});
    }
    next();
});

//Routes which should handle requests
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;