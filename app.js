// calling express library 
const express = require('express');
// logging APIS
const morgan = require('morgan');
// Connection OF DATABASE with mongoDB
const mongoose = require('mongoose')
    // Declare CORS for connect server of Front-End with Back-End
const Cors = require('cors');
//declare package of dotenv
require('dotenv/config');
// calling app
const app = express();
// get api variables from env files
const api = process.env.API_URL;
// get database variables from env files
const Database = process.env.CONNECTION_STRING;
// get helper 
const jwtAuthorization = require('./helpers/jwt')

const errorhandler = require('./helpers/errorHandler')

//Middlewares Declerations
// Middlewares Library so we use it in App.use()
// parse application/json

// Middlewares actually checking everything going to server before execution
app.use(Cors());
app.options('*', Cors())
app.use(express.urlencoded());
app.use(express.json());
app.use(morgan('tiny'));
app.use(jwtAuthorization())
app.use(errorhandler);

// Define The Routers for GET/POST operations
const productsRouter = require('./routers/products')
const ordersRouters = require('./routers/orders')
const userRouters = require('./routers/users')
const categoryRouters = require('./routers/categories')

// calling The Routers 
app.use(`${api}/products`, productsRouter);
app.use(`${api}/orders`, ordersRouters);
app.use(`${api}/users`, userRouters);
app.use(`${api}/categories`, categoryRouters);


// Database Connection
mongoose.connect(Database, {
    dbName: 'Ecommerce',
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {

    console.log("The Connection of Database is ready");
}).catch((err) => {
    console.log(err);
})

////The Server/////
// listen to specific port 


/// Development use Localhost
// app.listen(3000, () => {
//     console.log("Server is running now at http://localhost:3000");
// })

// production 
var server = app.listen(process.env.PORT || 3000, function() {
    var port = server.address().port
    console.log("Express is now working on port " + port)
})