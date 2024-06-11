const ServiceModel = require("../models/ServiceModel");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// this is the getServices for get request
module.exports.getServices = async (req, res) => {
  const _data = await ServiceModel.find({});
  if (_data) {
    return res.send({ code: 200, message: "success", data: _data });
  } else {
    return res.send({ code: 500, message: "Backend Server Error" });
  }
};

//2.1.1 this is the addServices for save request
module.exports.addServices = async (req, res) => {
  try {
    if (!req.headers.authorization) {
      return res.send({
        code: 403,
        message: "Not found Data for matching of credential data",
      });
    }

    const userDetail = await jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );

    // console.log("token getting error", userDetail, 44);
    if (
      userDetail._doc.type !== "ADMIN" &&
      userDetail._doc.type !== "SUBADMIN" &&
      userDetail._doc.type !== "CUSTOMER"
    ) {
      return res.send({ code: 403, message: "Unauthorized data" });
    }

    if (userDetail.iat - new Date().getTime() > 3.6e6) {
      return res.send({ code: 403, message: "Session has been expired" });
    }

    const title = req.body.title;
    const description = req.body.description;
    const imagesUrl = req.file.path;

    // 21.2 also here should mentioned
    const servicetype = req.body.servicetype;
    const amount = req.body.amount;
    const seller = req.body.seller;

    if (
      !title ||
      !description ||
      !imagesUrl ||
      !servicetype ||
      !amount ||
      !seller
    ) {
      return res.send({ code: 400, message: "Bad Request" });
    }

    const newServices = new ServiceModel({
      title: title,
      description: description,
      imageFile: imagesUrl,
      servicetype: servicetype,
      amount: amount,
      seller: seller,
    });

    const success = await newServices.save();
    if (success) {
      return res.send({ code: 200, message: "success" });
    } else {
      return res.send({ code: 500, message: "Backend Server Error" });
    }
  } catch (err) {
    res.send({ code: 500, message: "Internal Server Err." });
  }
};

// UPDATE-PRODUCT AFTER CLICK ON UPDATE BUTTON FOR CHANGE DATA FOR SHOW OUTPUT
// 8.1
module.exports.editProduct = async (req, res) => {
  let newData = {};

  // console.log(req.body, 102);
  // console.log(req.body.title, 103);
  if (req.body.title) {
    newData["title"] = req.body.title;
  } else {
    return alert("data not found");
  }

  if (req.body.description) {
    newData["description"] = req.body.description;
  }
  if (req.body.amount) {
    newData["amount"] = req.body.amount;
  }
  if (req.body.imageFile) {
    newData["imageFile"] = req.body.imageFile;
  }
  if (req.body.servicetype) {
    newData["servicetype"] = req.body.servicetype;
  }
  if (req.body.seller) {
    newData["seller"] = req.body.seller;
  }

  const id = req.body.id;
  // console.log(req.body.id, 136);

  let filter = { _id: id };

  let doc = await ServiceModel.findOneAndUpdate(filter, newData, {
    new: true,
  });

  // console.log(doc, 145);
  if (doc) {
    res.send({ code: 200, message: "data updated success", data: doc });
  } else {
    res.send({
      code: 500,
      message: "Updated data not found from the server",
    });
  }
};

// GET-EDIT_PRODUCT_ById FOR UPDATE
module.exports.getProductById = async (req, res) => {
  // console.log(req.params, 162);
  // console.log(req.query, 163);
  let data = await ServiceModel.findById(req.params.id);

  if (data) {
    res.send({ code: 200, message: "fetch data by id success", data: data });
  } else {
    res.send({
      code: 500,
      message: "fetching data not found from the server",
    });
  }
};

// DELETE SELECTED PRODUCT...
module.exports.deleteProducts = async (req, res) => {
  // console.log(req.body, 185);
  const ids = req.body;
  const response = await ServiceModel.deleteMany({ _id: { $in: ids } });

  if (response) {
    res.send({
      code: 200,
      message: "server data deleted success",
      data: response,
    });
  } else {
    res.send({
      code: 500,
      message: "server delete getting some error",
    });
  }
};

module.exports.getSlider = (req, res) => {
  const url1 =
    "https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";
  const url2 =
    "https://images.pexels.com/photos/1229861/pexels-photo-1229861.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";
  const url3 =
    "https://images.pexels.com/photos/1103970/pexels-photo-1103970.jpeg?auto=compress&cs=tinysrgb&w=600";
  const url4 =
    "https://images.pexels.com/photos/1036936/pexels-photo-1036936.jpeg?auto=compress&cs=tinysrgb&w=600";
  const array = [url1, url2, url3, url4];
  return res.send({ code: 200, message: "success", data: array });
};

module.exports.vehicleSlider = (req, res) => {
  const url3 =
    "https://images.pexels.com/photos/1103970/pexels-photo-1103970.jpeg?auto=compress&cs=tinysrgb&w=600";
  const url4 =
    "https://images.pexels.com/photos/1036936/pexels-photo-1036936.jpeg?auto=compress&cs=tinysrgb&w=600";
  const array = [url3, url4];
  return res.send({ code: 200, message: "success", data: array });
};
