// eslint-disable-next-line
const validator = (body) => {
  return false;
};

function CloudinaryStorage(opts) {
  this.cloudinary = opts.cloudinary || null;
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
    const uploadStream = this.cloudinary.uploader.upload_stream(
      { ...this.uploadOptions },
      (err, result) => {
        if (err) throw new Error(err);
        cb(null, result);
      }
    );
    file.stream.pipe(uploadStream);
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
      await this.cloudinary.uploader.destroy(req.file.public_id, {
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
