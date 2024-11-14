const SerpApi = require("google-search-results-nodejs");
const search = new SerpApi.GoogleSearch("bcb96af40b0631a56d78d19cd9b3868d2b9359c033f18a1c42ba3cfad4ec3603");

const params = {
  q: "LE SSERAFIM",
  tbm: "isch", // 'tbm=isch' enables image search mode
  hl: "en",    // Language
  gl: "us",    // Country
};

search.json(params, (data) => {
  const images = data.images_results.map(image => image.original);
  console.log(images);
});
