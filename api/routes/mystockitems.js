const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const checkAuth = require("../middleware/check-auth");

const Store = require("../models/store");
const User = require("../models/user");

const multer = require("multer");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    if (!file.originalname.match(/\.(jpeg|jpg|png)$/)) {
      var err = new Error();
      err.code = "filetype";
      return cb(err);
    } else {
      cb(null, Date.now() + "_" + file.originalname);
      //cb (null,  file.originalname);
    }
  }
});

var upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 }
}).single("myfile");

router.post("/upload", function (req, res) {
  upload(req, res, function (err) {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        res.json({
          success: false,
          message: "File size is too large. Max limit is 10MB"
        });
      } else if (err.code === "filetype") {
        res.json({
          success: false,
          message: "File type is invalid. Must be .png/.jpeg/.jpg"
        });
      } else {
        console.log(err);
        res.json({
          success: false,
          message: "File was not able to be uploaded"
        });
      }
    } else {
      if (!req.file) {
        res.json({ success: false, message: "No file was selected" });
      } else {
        console.log(req.file.path);
        res.json({
          success: true,
          message: "File was uploaded!",
          savedfilename: req.file.path
        });
      }
    }
  });
});

//Submit api for saving a store item
//Source = Web
//User = store user
router.post("/", (req, res, next) => {
  if (req.body.Mode === 1) {
    const id = req.body.StoreId;

    Store.update(
      { _id: id },
      {
        $set: {
          Stock: req.body.Stock
        }
      }
    )
      .exec()
      .then(result => {
        res.status(200).json({
          message: "Store Updated with Stocks",
          messagecode: 1
        });
      })
      .catch(err => {
        res.status(500).json({
          error: err
        });
      });
  } else {
  }
});

router.post("/Update", (req, res, next) => {
  if (req.body.Mode === 2) {
    const id = req.body.StoreId;

    Store.update(
      { _id: id },
      {
        $set: {
          Stock: req.body.Stock
        }
      }
    )
      .exec()
      .then(result => {
        res.status(200).json({
          message: "Stock Items Updated",
          messagecode: 1
        });
      })
      .catch(err => {
        res.status(500).json({
          error: err
        });
      });
  } else {
  }
});

router.post("/SingleUpdate", (req, res, next) => {
  const id = req.body.StoreId;

  Store.updateOne(
    {
      "StoreId": mongoose.Schema.Types.ObjectId(req.body.StoreId),
      "Stock.itemid": req.body.itemid
    },
    {
      "$set": {
        "Stock.$.itemname": req.body.itemname,
        "Stock.$.itemcategory": req.body.itemcategory,
        "Stock.$.mrp": req.body.mrp,
        "Stock.$.discount": req.body.discount,
        "Stock.$.weight": req.body.weight,
        "Stock.$.expirydate": req.body.expiry,
        "Stock.$.quantity": req.body.stockqty,
        "Stock.$.status": req.body.status
      }
    }
  )
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Stock Items Updated",
        messagecode: 1
      });
    })
    .catch(err => {
      //console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

//Update single stock item availability or unavailability
router.post("/stockupdate", (req, res, next) => {
  //console.log(req.body);
  Store.updateOne(
    {
      "StoreId": mongoose.Schema.Types.ObjectId(req.body.StoreId),
      "Stock.itemid": req.body.itemid
    },
    {
      "$set": {
        "Stock.$.status": req.body.status
      }
    }
  )
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Stock Availability Status Updated",
        messagecode: 1
      });
    })
    .catch(err => {
      //console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

//Update single stock MRP or Selling Price from Store Admin/User Billing Portal
router.post("/billingupdates", (req, res, next) => {
  //console.log(req.body);
  Store.updateOne(
    {
      "StoreId": mongoose.Schema.Types.ObjectId(req.body.StoreId),
      "Stock.itemid": req.body.itemid
    },
    {
      "$set": {
        "Stock.$.mrp": req.body.mrp
      }
    }
  )
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Stock Item Updated",
        messagecode: 1
      });
    })
    .catch(err => {
      //console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

//Update single stock item availability or unavailability
router.post("/quantityupdate", (req, res, next) => {
  //console.log(req.body);
  let qty = Number(req.body.quantity);
  //First we need to get the existing quantity data for the specified product

  //NOTE: Here ITEM ID is nothing PRODUCT CODE
  Store.findOneAndUpdate(
    { "_id": req.body.StoreId },
    { $inc: { "Stock.$[elem].quantity": -qty } },
    { arrayFilters: [{ "elem.productcode": req.body.itemid }] }
  )
    .exec()
    .then(stockdata => {
      
      //The below code will execute check if the quantity is less than or equal to 5 and if it is less than equal to 5, then the status will be made InActive
      Store.findOneAndUpdate(
        { "_id": req.body.StoreId },
        { $set: { "Stock.$[elem].status": 'Online InActive' } },
        { arrayFilters: [{ "elem.quantity": { $lte: 5 } }] }
      )
      .exec()    

      res.status(200).json({
        message: 'success'
      });
    })
    .catch(err => {
      // console.log(err);
      res.status(500).json({ error: err });
    });
});

//Update single stock item after addition or modification from order review
//Here the quantity can be either + or -
router.post("/quantitymodify", (req, res, next) => {
  //console.log(req.body);
  let qty = Number(req.body.quantity);
  console.log('Quantity = ' + qty);
  //First we need to get the existing quantity data for the specified product

  //NOTE: Here ITEM ID is nothing PRODUCT CODE
  Store.findOneAndUpdate(
    { "_id": req.body.StoreId },
    { $inc: { "Stock.$[elem].quantity": -qty } },
    { arrayFilters: [{ "elem.productcode": req.body.itemid }] }
  )
    .exec()
    .then(stockdata => {
      
      //The below code will execute check if the quantity is less than or equal to 5 and if it is less than equal to 5, then the status will be made InActive
      Store.findOneAndUpdate(
        { "_id": req.body.StoreId },
        { $set: { "Stock.$[elem].status": 'Online InActive' } },
        { arrayFilters: [{ "elem.quantity": { $lte: 5 } }] }
      )
      .exec()    

      res.status(200).json({
        message: 'success'
      });
    })
    .catch(err => {
      // console.log(err);
      res.status(500).json({ error: err });
    });
});

//Update single stock item availability or unavailability
router.post("/statusupdate", (req, res, next) => {
  //let qty = Number(req.body.quantity);
  //Updating the status of the product if quantity is less than 5
  Store.findOneAndUpdate(
    { "_id": req.body.StoreId },
    { $set: { "Stock.$[elem].status": 'Online InActive' } },
    { arrayFilters: [{ "elem.itemid": req.body.itemid }] }
  )
    .exec()
    .then(resultset => {
      //console.log(resultset);
      res.status(200).json({
        message: 'success'
      });
    })
    .catch(err => {
      //console.log(err);
      res.status(500).json({ error: err });
    });
});

//Update single stock MRP or Selling Price from In Store App
//note - batch no column will be saved for selling price
router.post("/instoreupdates", (req, res, next) => {
  //console.log(req.body);
  Store.updateOne(
    {
      "StoreId": mongoose.Schema.Types.ObjectId(req.body.StoreId),
      "Stock.itemid": req.body.itemid
    },
    {
      "$set": {
        "Stock.$.productcode": req.body.productcode,
        "Stock.$.itemname": req.body.itemname,
        "Stock.$.itemcategory": req.body.itemcategory,
        "Stock.$.mrp": req.body.mrp,
        "Stock.$.costprice": req.body.costprice,
        "Stock.$.sellingprice": req.body.sellingprice,
        "Stock.$.discount": req.body.discount,
        "Stock.$.quantity": req.body.quantity,
        "Stock.$.weight": req.body.weight,
        "Stock.$.expirydate": req.body.expirydate,
        "Stock.$.status": req.body.status
      }
    }
  )
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Stock Item Updated",
        messagecode: 1
      });
    })
    .catch(err => {
      //console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

//Update single stock MRP or Selling Price from In Store App
router.post("/kiranaupdates", (req, res, next) => {
  //console.log(req.body);
  Store.updateOne(
    {
      "StoreId": mongoose.Schema.Types.ObjectId(req.body.StoreId),
      "Stock.itemid": req.body.itemid
    },
    {
      "$set": {
        "Stock.$.productcode": req.body.productcode,
        "Stock.$.itemname": req.body.itemname,
        "Stock.$.itemcategory": req.body.itemcategory,
        "Stock.$.mrp": req.body.mrp,
        "Stock.$.costprice": req.body.costprice,
        "Stock.$.sellingprice": req.body.sellingprice,
        "Stock.$.discount": req.body.discount,
        "Stock.$.quantity": req.body.quantity,
        "Stock.$.weight": req.body.weight,
        "Stock.$.expirydate": req.body.expirydate,
        "Stock.$.status": req.body.status
      }
    }
  )
    .exec()
    .then(result => {
      //console.log('success');
      res.status(200).json({
        message: "Stock Item Updated",
        messagecode: 1
      });
    })
    .catch(err => {
      //console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

//Getting stock details of logged in user based on store Id
//Source = Web
//User = Kitchen user
router.get("/:storeId", checkAuth, (req, res, next) => {
  //console.log(req.params.storeId);
  const id = req.params.storeId;
  Store.find({
    _id: id
  })
    .exec()
    .then(doc => {
      if (doc) {
        res.status(200).json({
          count: doc.length,
          selectedStore: doc
        });
      } else {
        res.status(404).json({
          message: "No Records Found !"
        });
      }
    })
    .catch(err => {
      // console.log(err);
      //res.status(500).json({ error: err });
    });
});

router.get("/", (req, res, next) => {
  Store.find()
    .exec()
    .then(docs => {
      if (docs) {
        res.status(200).json({
          count: docs.length,
          allStores: docs
        });
      } else {
        res.status(404).json({
          message: "No Records Found !"
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

//Update all stock items with request
router.patch("/", (req, res, next) => {
  const id = req.body.storeId;
  Store.update(
    { _id: id },
    {
      $set: {
        Stock: req.body.Stock
      }
    }
  )
    .exec()
    .then(result => {
      //console.log(result);
      res.status(200).json({
        message: "Stock Updated Successfully",
        messagecode: "2" //2 = update
      });
    })
    .catch(err => {
      //console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.patch("/:storeId", (req, res, next) => {
  const id = req.params.storeId;
  Store.update(
    { _id: id },
    {
      $set: {
        Stock: []
      }
    }
  )
    .exec()
    .then(result => {
      //console.log(result);
      res.status(200).json({
        message: "Stock Deleted Successfully",
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

module.exports = router;
