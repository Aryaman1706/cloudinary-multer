const getUri = (file) => {
  return new Promise((resolve, reject) => {
    const chunks = [];
    file.stream.setEncoding("base64");
    file.stream.on("readable", () => {
      let chunk;
      while ((chunk = file.stream.read()) != null) {
        chunks.push(chunk);
      }
    });
    file.stream.on("end", () => {
      const uri = `data:${file.mimetype};base64,${chunks.join("")}`;
      resolve(uri);
    });
    file.stream.on("error", (error) => {
      reject(error);
    });
  });
};

module.exports = getUri;
