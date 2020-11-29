const express = require("express");
const multer = require("multer");
const Joi = require("joi");
const cloudinaryStorage = require("../lib/config/storage");

const validator = (body) => {
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
  unsignedName: "",
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
