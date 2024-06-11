require("dotenv").config();
const mongoose = require("mongoose");
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Db connected to the mongoose successfully"))
  .catch((err) => console.log("Db connection error", err));

const express = require("express");

const multer = require("multer");
const path = require("path");
const app = express();

// Step-1 When i'll import of this code in render.com than i'll give a port is this and go below Step-2
// const PORT = process.env.PORT_HOST || 8080;
const PORT = process.env.PORT_HOST || 8080;

const cors = require("cors");
const bodyParser = require("body-parser");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/uploads", express.static("uploads"));

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "_" + Date.now() + "_" + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
}).single("images");

// SERVICES CONTROLLER API CALL
// 2.2
const serviceController = require("./controller/servicesController");

app.get("/api/services", serviceController.getServices);

app.post("/api/services", upload, serviceController.addServices);

//C1 CRUD OPERATION
// OUTPUT AFTER ADD PRODUCT for output
app.post("/api/edit-product", serviceController.editProduct);

// THIS SECTION FOR EDIT FILE INTERFACE AFTER CLICK ON EDIT BUTTON
app.get("/api/get-products/:id", serviceController.getProductById);

// THIS IS THE SECTION FOR EDIT
app.post("/delete-products", serviceController.deleteProducts);

// ADMIN CONTROLLER API CALL
const adminController = require("./controller/adminController");

// This api for get data for frontend
app.get("/admin/admins", adminController.getAdmins);

// This api for add data for frontend to backend
app.post("/admin/admins", adminController.addAdmins);

app.post("/admin/loginadmin", adminController.loginAdmin);

// Slider
app.get("/api/slider", serviceController.getSlider);

app.get("/api/vehicleslider", serviceController.vehicleSlider);

// Step-2 and this script code is mention in server >> package.json file
// "scripts": {
//   "test": "echo \"Error: no test specified\" && exit 1",
//   "start": "node index.js",
//   "server": "nodemon index.js",
//   "client": "npm start --prefix ./client",
//   "dev": "concurrently \"npm start\" \"npm run client\""
// },

// Step - 3 and i'll mention of this below two code here. Thats it.
app.use(express.static(path.join(__dirname, "./client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

app.get("/", (req, res) => {
  res.send("Hello Er. Avinash!");
});

app.listen(PORT, () => {
  console.log(`RBVCorporate is running on PORT at http://localhost:${PORT}`);
});
