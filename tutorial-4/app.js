const express       = require('express');
const app           = express();
const morgan        = require('morgan');
const bodyParser    = require('body-parser');

const productRoutes = require('./api/routes/products');
const orderRoutes   = require('./api/routes/orders');

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
        'Origin, X-Requested-With, Content-type, Accept, Authorization'
    );
    if(req.method === 'OPTIONS')
    {
        res.header(
                'Access-Control-Allow-Methods',
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