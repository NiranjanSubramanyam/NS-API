const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
var http = require("http");

const Customer = require('../models/customer');

router.post('/newregistration', (req, res, next) => {
    console.log(req.body);

    //Check if user already exists
    Customer.find({ mobile: req.body.mobile })
        .exec()
        .then(customer => {
            if (customer.length >= 1) {
                return res.status(409).json({
                    error: 'Customer exists',
                    errorcode: 121 //Customer already exists
                });
            } else {
                var options = {
                    "method": "POST",
                    "hostname": "control.msg91.com",
                    "port": null,
                    "path": "/api/sendotp.php?authkey=210040Aq2OQbDep5ad2183c&message=Your+verification+code+is+%23%23OTP%23%23&mobile=" + req.body.mobile + "&sender=NSTEST",
                    "headers": {}
                };
                console.log(req.body.mobile);
                var request = http.request(options, function (response) {
                    var chunks = [];
            
                    response.on("data", function (chunk) {
                        chunks.push(chunk);
                    });
            
                    response.on("end", function () {
                        var body = Buffer.concat(chunks);
                        console.log(body.toString());
                        res.status(200).json({
                            message: body.toString()
                        });
                    });
                });
            
                request.end();
            }
        })
});

router.post('/otpverification', (req, res, next) => {
    console.log(req.body);

    var options = {
        "method": "POST",
        "hostname": "control.msg91.com",
        "port": null,
        "path": "/api/verifyRequestOTP.php?authkey=210040Aq2OQbDep5ad2183c&mobile=" + req.body.mobile + "&otp="+ req.body.otp +"",
        "headers": {}
    };

    var request = http.request(options, function (response) {
        var chunks = [];

        response.on("data", function (chunk) {
            chunks.push(chunk);
        });

        response.on("end", function () {
            var body = Buffer.concat(chunks);
            console.log(body.toString());
            res.status(200).json({
                message: body.toString()
            });
        });
    });

    request.end();

});

router.post('/retryotp', (req, res, next) => {
    console.log(req.body);

    var options = {
        "method": "POST",
        "hostname": "control.msg91.com",
        "port": null,
        "path": "/api/retryotp.php?authkey=210040Aq2OQbDep5ad2183c&mobile=" + req.body.mobile + "&retrytype=text",
        "headers": {}
    };

    var request = http.request(options, function (response) {
        var chunks = [];

        response.on("data", function (chunk) {
            chunks.push(chunk);
        });

        response.on("end", function () {
            var body = Buffer.concat(chunks);
            console.log(body.toString());
            res.status(200).json({
                message: body.toString()
            });
        });
    });

    request.end();

});

router.post('/passwordreset', (req, res, next) => {
    console.log(req.body);

    var options = {
        "method": "POST",
        "hostname": "control.msg91.com",
        "port": null,
        "path": "/api/sendotp.php?authkey=210040Aq2OQbDep5ad2183c&message=Your+password+reset+OTP+is+%23%23OTP%23%23&mobile=" + req.body.mobile + "&sender=NSTEST",
        "headers": {}
    };

    var request = http.request(options, function (response) {
        var chunks = [];

        response.on("data", function (chunk) {
            chunks.push(chunk);
        });

        response.on("end", function () {
            var body = Buffer.concat(chunks);
            console.log(body.toString());
            res.status(200).json({
                message: body.toString()
            });
        });
    });

    request.end();
});

router.post('/sendreceipt', (req, res, next) => {
    console.log(req.body);

    var messageformat = "You%20order%20no%20is%20-" + req.body.orderno + ".%20Your%20total%20bill%20amount%20is%20Rs.%20" + req.body.ordertotal + "%20via%20" + req.body.paymentmode + ".%20For%20more%20details,%20click%20this%20link%20-%20https://neighborhoodstores.in/order.html?orderno="+ req.body.orderno +"";

    var options = {
        "method": "GET",
        "hostname": "api.msg91.com",
        "port": null,
        "path": "/api/sendhttp.php?country=91&sender=NSTORE&route=4&mobiles=" + req.body.mobile + "&authkey=210040Aq2OQbDep5ad2183c&message=" + messageformat + "",
        "headers": {}
    };

    var request = http.request(options, function (response) {
        var chunks = [];

        response.on("data", function (chunk) {
            chunks.push(chunk);
        });

        response.on("end", function () {
            var body = Buffer.concat(chunks);
            console.log(body.toString());
            res.status(200).json({
                message: body.toString()
            });
        });
    });

    request.end();

});

router.post('/admin/reset', (req, res, next) => {
    console.log(req.body);

    var messageformat = "We%20have%20received%20a%20request%20to%20reset%20your%20password.%20Your%20temporary%20password%20is%20" + req.body.temppassword + ".";

    var options = {
        "method": "GET",
        "hostname": "api.msg91.com",
        "port": null,
        "path": "/api/sendhttp.php?country=91&sender=NSTORE&route=4&mobiles=" + req.body.mobile + "&authkey=210040Aq2OQbDep5ad2183c&message=" + messageformat + "",
        "headers": {}
    };

    var request = http.request(options, function (response) {
        var chunks = [];

        response.on("data", function (chunk) {
            chunks.push(chunk);
        });

        response.on("end", function () {
            var body = Buffer.concat(chunks);
            console.log(body.toString());
            res.status(200).json({
                message: body.toString()
            });
        });
    });

    request.end();

});

router.post('/admin/confirmation', (req, res, next) => {

    var messageformat = req.body.message;

    var options = {
        "method": "GET",
        "hostname": "api.msg91.com",
        "port": null,
        "path": "/api/sendhttp.php?country=91&sender=NSTORE&route=4&mobiles=" + req.body.mobile + "&authkey=210040Aq2OQbDep5ad2183c&message=" + messageformat + "",
        "headers": {}
    };

    var request = http.request(options, function (response) {
        var chunks = [];

        response.on("data", function (chunk) {
            chunks.push(chunk);
        });

        response.on("end", function () {
            var body = Buffer.concat(chunks);
            console.log(body.toString());
            res.status(200).json({
                message: body.toString()
            });
        });
    });

    request.end();

});

module.exports = router;