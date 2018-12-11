const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// const categoryRoutes = require("./api/routes/categories");
// const storiesRoutes = require("./api/routes/stories");

const userRoutes = require('./api/routes/user');
const myStoreRoutes = require('./api/routes/mystore');
const myStockItemsRoutes = require('./api/routes/mystockitems');
const commonRoutes = require('./api/routes/common');
const myStoreTimingRoutes = require('./api/routes/mystoretiming');
const myStoreOfferRoutes = require('./api/routes/mystoreoffer');
const manageStoreRoutes = require('./api/routes/managestore');
const globalOffersRoutes = require('./api/routes/globaloffers');
const websiteSettingsRoutes = require('./api/routes/websitesettings');
const customerAddressRoutes = require('./api/routes/customeraddresses');
const paymentProcessingRoutes = require('./api/routes/paymentprocessing');
const myordersRoutes = require('./api/routes/myorders');
const forgotPasswordRoutes = require('./api/routes/forgotpassword');
const advertisementRoutes = require('./api/routes/advertisements');
const messageRoutes = require('./api/routes/messageprocessing');
const tempOrderRoutes = require('./api/routes/temporders');
const emailNotificationRoutes = require('./api/routes/emailnotifications');
const deliveryFeeRoutes = require('./api/routes/mystoredeliveryfee');
const customerorderRoutes = require('./api/routes/customerorders');
const serviceZoneRoutes = require('./api/routes/servicezones');
const getorderlogs = require('./api/routes/getlogs');
const orderLogRoutes = require('./api/routes/orderlogs');
const instoreOrderRoutes = require('./api/routes/instoreorders');
const storeUserRoutes = require('./api/routes/storeusers');
const skuMasterRoutes = require('./api/routes/skudata');
const notificationRoutes = require('./api/routes/notifications');
const creditCustomerRoutes = require('./api/routes/creditcustomer');
const helpRoutes = require('./api/routes/help');
const loospackRoutes = require('./api/routes/loosepacks');
const modifiedOrderRoutes = require('./api/routes/modifiedorders');
const storeInvoiceRoutes = require('./api/routes/storeinvoice');
const customerRoutes = require('./api/routes/customer');

//mongodb details
//username - nsubramanyam@mindboard.com
//password - ssNTS123!555
//DB Username - ns-dbadmin
//DB Password - tq4QdRCKU6djjcZg
mongoose
  .connect(
    'mongodb+srv://ns-dbadmin:tq4QdRCKU6djjcZg@nsapi-uat-bkp9b.mongodb.net/nsapi-uat?retryWrites=true',
    { useNewUrlParser: true }
  )
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(() => {
    console.log("Connection failed");
  });

app.use(morgan("dev"));
app.use('/uploads', express.static('uploads'));
app.use('/stores', express.static('stores'));
app.use('/advertisements', express.static('advertisements'));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

// app.use("/api/categories", categoryRoutes);
// app.use("/api/stories", storiesRoutes);

//Request will come here first and then redirect to its own .js pages
app.use('/user', userRoutes);
app.use('/mystore', myStoreRoutes);
app.use('/mystockitems', myStockItemsRoutes);
app.use('/common', commonRoutes);
app.use('/mystoretiming', myStoreTimingRoutes);
app.use('/mystoreoffer', myStoreOfferRoutes);
app.use('/managestore', manageStoreRoutes);
app.use('/globaloffers', globalOffersRoutes);
app.use('/websitesettings', websiteSettingsRoutes);
app.use('/customeraddresses', customerAddressRoutes);
app.use('/paymentprocessing', paymentProcessingRoutes);
app.use('/myorders', myordersRoutes);
app.use('/forgotpassword', forgotPasswordRoutes);
app.use('/advertisements', advertisementRoutes);
app.use('/messageprocessing', messageRoutes);
app.use('/temporders', tempOrderRoutes);
app.use('/emailnotifications', emailNotificationRoutes);
app.use('/mystoredeliveryfee', deliveryFeeRoutes);
app.use('/customerorders', customerorderRoutes);
app.use('/servicezones', serviceZoneRoutes);
app.use('/getlogs', getorderlogs);
app.use('/orderlogs', orderLogRoutes);
app.use('/instoreorders', instoreOrderRoutes);
app.use('/storeusers', storeUserRoutes);
app.use('/skudata', skuMasterRoutes);
app.use('/notifications', notificationRoutes);
app.use('/creditcustomer', creditCustomerRoutes);
app.use('/help', helpRoutes);
app.use('/loosepacks', loospackRoutes);
app.use('/modifiedorders', modifiedOrderRoutes);
app.use('/storeinvoice', storeInvoiceRoutes);
app.use('/customer', customerRoutes);

//If no matching route is found, then redirect to this route and display error accordingly
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

//If error is not caught above, then the below code block will execute to show the error
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;
