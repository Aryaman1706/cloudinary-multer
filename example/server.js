const express = require("express");
const multer = require("multer");
const Joi = require("joi");
const cloudinary = require("cloudinary").v2;
const cloudinaryStorage = require("../lib/config/storage");

cloudinary.config({
  cloud_name: "XXXXXXXXX",
  api_key: "XXXXXXXXX",
  api_secret: "XXXXXXXXX",
});

const validator = (body) => {
  /**
   * req.body would be passed as a parameter(body) here
   * Order of req.body is very important for validating.
   * Make sure that file is the LAST FIELD in req.body.
   * example:-
        req.body: {
            email: "test_email@mail.com",
            username: "test username"
            file: {FILE}
        }
   */
  const schema = Joi.object({
    email: Joi.string().email().required(),
    username: Joi.string().max(40).required(),
  });
  const { error } = schema.validate(body);
  if (error) return error;
  return false;
};

const storage = cloudinaryStorage({
  cloudinary: cloudinary,
  validator: validator,
});

const upload = multer({
  storage: storage,
});

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    return res.json({ body: req.body, file: req.file });
  } catch (error) {
    console.log("Server Error\n", error);
    return res.status(500).json({ error });
  }
});

app.listen(5000, console.log("Server started on port 5000"));
