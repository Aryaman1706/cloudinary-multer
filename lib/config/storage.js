const cloudinary = require("cloudinary").v2;
const getUri = require("../utils/getDataUri");

const validator = (body) => {
  return false;
};

function CloudinaryStorage(opts) {
  this.cloudinary = opts.cloudinary || null;
  this.unsignedName = opts.unsignedName || null;
  this.validator = opts.validator || validator;
  this.uploadOptions = opts.uploadOptions || {};
  this.destroyOptions = opts.destroyOptions || {};
}

CloudinaryStorage.prototype._handleFile = async function _handleFile(
  req,
  file,
  cb
) {
  try {
    const error = this.validator(req.body);
    if (error) throw new Error(error || "Validation Error.");
    if (!this.cloudinary) throw new Error('"cloudinary" is a required field.');
    if (!this.unsignedName)
      throw new Error('"unsignedName" is a required field.');
    cloudinary.config(this.cloudinaryConfig);
    const uri = await getUri(file);
    const result = await cloudinary.uploader.unsigned_upload(
      uri,
      this.unsignedName
    );
    cb(null, result);
  } catch (error) {
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
      await cloudinary.uploader.destroy(req.file.public_id, {
        ...this.destroyOptions,
      });
    }
    cb();
  } catch (error) {
    cb();
  }
};

module.exports = function (opts) {
  return new CloudinaryStorage(opts);
};
