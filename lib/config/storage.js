const cloudinary = require("cloudinary").v2;
// const getUri = require("../utils/getDataUri");

const validator = (req, file, cb) => {
  cb(null, true);
};

function CloudinaryStorage(opts) {
  this.cloudinaryConfig = opts.cloudinaryConfig || null;
  this.validator = opts.validator || validator;
}

CloudinaryStorage.prototype._handleFile = async function _handleFile(
  req,
  file,
  cb
) {
  try {
    this.validator(req, file, (err, valid) => {
      if (err || !valid) throw new Error(err || "Validation Failed.");
    });
    if (!this.cloudinaryConfig)
      throw new Error("Invalid Cloundinary Configuration.");
    cloudinary.config(this.cloudinaryConfig);
    const cloudinaryUploadStream = cloudinary.uploader.upload_stream(
      (err, result) => {
        if (err) throw new Error(err);
        file.stream.pipe(cloudinaryUploadStream);
        console.log(result);
        cb(null, { url: result.secure_url });
      }
    );
  } catch (error) {
    console.log("Storage Error\n", error);
    cb(error);
  }
};

CloudinaryStorage.prototype._removeFile = async function _removeFile(
  req,
  file,
  cb
) {
  try {
    if (req.file.public_id) {
      await cloudinary.uploader.destroy(req.file.public_id);
    }
    cb();
  } catch (error) {
    cb();
  }
};

module.exports = function (opts) {
  return new CloudinaryStorage(opts);
};
