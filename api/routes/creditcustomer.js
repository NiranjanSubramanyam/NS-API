const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const CreditCustomer = require('../models/creditcustomer');
const checkAuth = require('../middleware/check-auth');

router.post('/', (req, res, next) => {
    const user = new CreditCustomer({
        _id: new mongoose.Types.ObjectId(),
        customername: req.body.customername,
        mobileno: req.body.mobileno,
        completeaddress: req.body.completeaddress,
        aadharno: req.body.aadharno,
        storeid: req.body.storeid,
        status: 1 // 1 = Active, 2 = InActive
    });
    user
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Customer Created',
                messagecode: '1'
            });
        })
        .catch(err => {
            // console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.post('/checkexists', (req, res, next) => {
    CreditCustomer.find({ mobileno: req.body.mobileno })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(200).json({
                    error: 'Customer exists',
                    status: '1' //user exists
                });
            } else {
                return res.status(200).json({
                    message: 'Customer does not exist',
                    status: '0' //user does not exist
                });
            }
        })
});

router.get('/', (req, res, next) => {
    CreditCustomer.find()
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                customers: docs
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

router.get('/getcustomers/:storeId', (req, res, next) => {
    console.log(req.params.storeId);
    const id = req.params.storeId;
    CreditCustomer.find({
        "storeid": id
    })
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json({
                    count: doc.length,
                    mycustomerdata: doc
                });
            } else {
                res.status(404).json({
                    message: 'No Records Found !'
                });
            }
        })
        .catch(err => {
            // console.log(err);
            res.status(500).json({ error: err });
        });
});

router.get('/getpaymenthistory/:customerid', (req, res, next) => {
    console.log(req.params.customerid);
    const id = req.params.customerid;
    CreditCustomer.find({
        "_id": id
    })
        .exec()
        .then(docs => {
            if (docs) {
                res.status(200).json({
                    count: docs.length,
                    paymentdetails: docs.map(doc => {
                        return {
                            paymenthistory: doc.paymenthistory
                        }
                    })
                });
            } else {
                res.status(404).json({
                    message: 'No Records Found !'
                });
            }
        })
        .catch(err => {
            // console.log(err);
            res.status(500).json({ error: err });
        });
});

router.get('/getcustomerhistory/:customerid', (req, res, next) => {
    console.log(req.params.customerid);
    const id = req.params.customerid;
    CreditCustomer.find({
        "_id": id
    })
        .exec()
        .then(docs => {
            if (docs) {
                res.status(200).json({
                    count: docs.length,
                    customerhistory: docs 
                });
            } else {
                res.status(404).json({
                    message: 'No Records Found !'
                });
            }
        })
        .catch(err => {
            // console.log(err);
            res.status(500).json({ error: err });
        });
});

router.delete('/:customerId', (req, res, next) => {
    CreditCustomer.remove({ _id: req.params.customerId })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Customer deleted"
            });
        })
        .catch(err => {
            // console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.post('/updatecustomer', (req, res, next) => {
    console.log(req.body);
    CreditCustomer.find({ _id: req.body.customerid })
        .exec()
        .then(user => {
            const id = user[0]._id;
            CreditCustomer.update({ _id: id }, {
                $set:
                    {
                        customername: req.body.customername,
                        mobileno: req.body.mobileno,
                        completeaddress: req.body.completeaddress,
                        status: req.body.status,
                        aadharno: req.body.aadharno
                    }
            })
                .exec()
                .then(result => {
                    console.log(result);
                    res.status(200).json({
                        message: 'Store Customer Updated Successfully',
                        messagecode: 2 //2 = update
                    });
                })
                .catch(err => {
                    // console.log(err);
                    res.status(500).json({
                        error: err
                    });
                });
        })
});

router.post('/customercredits/', (req, res, next) => {
    const id = req.body.customerid;
    
    CreditCustomer.update({ _id: id }, { $set: 
        {
            customercredits: req.body.CustomerCredits,
            currentcredit: req.body.currentcredit
        }
     })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Updated'
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

router.post('/updatebalancepaid/', (req, res, next) => {
    const id = req.body.customerid;
    
    CreditCustomer.update({ _id: id }, { $set: 
        {
            paymenthistory: req.body.paymenthistory,
            lastpaiddate: req.body.lastpaiddate,
            currentcredit: req.body.currentcredit,
            creditpaidtilldate: req.body.creditpaidtilldate
        }
     })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Updated'
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

router.patch("/:creditid", (req, res, next) => {
    const id = req.params.creditid;
    CreditCustomer.update(
      { _id: id },
      {
        $set: {
            customercredits: [],
            currentcredit: 0,
            creditpaidtilldate: '',
            lastpaiddate: '',
            paymentmode: ''
        }
      }
    )
      .exec()
      .then(result => {
        //console.log(result);
        res.status(200).json({
          message: "Deleted Successfully",
          messagecode: "2"
        });
      })
      .catch(err => {
        //console.log(err);
        res.status(500).json({
          error: err
        });
      });
  });

//Delete all in DB. 
//HIGH RISK ACTION
router.delete('/', (req, res, next) => {
    CreditCustomer.remove()
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'All Deleted'
            });
        })
        .catch(err => {
            // console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;