const express   = require('express');
const app       = express();

/**
 * HTTP request logger middleware for node.js
 * this module will give extra result in the terminal/cmd
 * like follow:
 * GET /products/special 200 40.417 ms - 30
 */
const morgan    = require('morgan');

const productRoutes = require('./api/routes/products');
const orderRoutes   = require('./api/routes/orders');

app.use(morgan('dev'));

//Routes which should handle requests
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

//error handling for unknown routes
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

//handling error message
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;