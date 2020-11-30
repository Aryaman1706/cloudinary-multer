# Cloudinary-Multer

[cloudinary-multer](https://www.npmjs.com/package/cloudinary-multer)

A custom multer storage engine to upload assets to cloudinary.

### Installation

cloudinary-multer can be installed easily via [npm](https://www.npmjs.com/)

`npm install cloudinary-multer`

## Usage

#### Cloudinary Configuration

```javascript
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "XXXXXXXXX",
  api_key: "XXXXXXXXX",
  api_secret: "XXXXXXXXX",
});
```

#### Storage Engine

```javascript
const cloudinaryStorage = require("cloudinary-multer");

const storage = cloudinaryStorage({
  cloudinary: cloudinary,
});

const upload = multer({
  storage: storage,
});
```

### Options

Custom Storage Engine has 4 options namely:-

1. `cloudinary` (required)

The cloudinary library instance to be used for uploading assets.
Configuration options can be found [here](https://cloudinary.com/documentation/node_integration#configuration)

**Example**:-

```javascript
cloudinary.config({
  cloud_name: "XXXXXXXXX",
  api_key: "XXXXXXXXX",
  api_secret: "XXXXXXXXX",
});
```

2. `validator` (optional)

Since `req.body` is not available prior to the multer middleware, it seemed to be a good idea to include a validator to validate the request body.
`validator` is supposed to be function that would return false for valid body and an error message/true otherwise.

**The order of fields in req.body is very important. Make sure that the field of type "file" must be last. All other fields that need to be validated should be on top.**

**Example**:-

```javascript
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
```

3. `uploadOptions` (optional)

These are the options that needed to be applied to upload methord in cloudinary.
Know that the methord used under the hood is `upload_stream`.
More information can be found [here](https://www.npmjs.com/package/cloudinary) and [here](https://cloudinary.com/documentation/image_upload_api_reference).

4. `destroyOptions` (optional)

These are the options that needed to be applied to upload methord in cloudinary.
More information can be found [here](https://cloudinary.com/documentation/image_upload_api_reference#destroy_method).

### Usage in Route

```javascript
app.post("/upload", upload.single("file"), async (req, res) => {});
```

**A simple complete example of the same could be found [here](https://github.com/Aryaman1706/cloudinary-multer/blob/master/example/server.js)**.

## Working

cloudinary-multer a simple custom storage engine to directly upload assets to [cloudinary](https://cloudinary.com/).
`_handleFile` function in multer storage engine gives the file data in form of a readable stream (`file.stream`).
This file stream is then uploaded directly to cloudinary if the validation is successfull.
Uploading the stream directly is a great advantage as the file is not stored in your disk/server unlike traditional diskStorage(stores file in your disk) and memoryStorage(stores file as buffer in server memory).

## Contributing

Feel free to report a bug, suggest a change etc. You are welcome to raise an issue and/or create a pull request.
Before making any major upgrade, kindly raise an issue to discuss further.
Make sure to run `npm run format` and `npm run lint` before commiting your changes/generating a PR.

## Read Further

- [Multer npm](https://www.npmjs.com/package/multer)
- [Multer Custom Storage Engine](https://github.com/expressjs/multer/blob/master/StorageEngine.md)
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Cloudinary npm](https://www.npmjs.com/package/cloudinary)

## License

[MIT](https://opensource.org/licenses/MIT)
