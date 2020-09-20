const NodeGeocoder = require('node-geocoder');

const options = {
  provider: "google",
  httpAdapter: "https",
  apiKey: "AIzaSyB3uSV2cBSZWz47yAcg_TmcMo3oqlirvm8",
  formatter: null
};

const geocoder = NodeGeocoder(options);

module.exports = geocoder;
