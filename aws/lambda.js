const https = require("https");

function getData() {
  return new Promise((resolve, reject) => {
    https
      .get(
        "https://fherherand.github.io/covid-19-data-update/timeseries.json",
        (res) => {
          let body = "";
          res.on("data", (chunk) => {
            body += chunk;
          });
          res.on("end", () => {
            resolve(JSON.parse(body));
          });
        }
      )
      .on("error", (e) => {
        reject(JSON.parse(e));
      });
  });
}

exports.handler = async (event) => {
  try {
    const results = await getData();
    const response = {
      statusCode: 200,
      body: results,
    };
    return response;
  } catch (error) {
    const response = {
      statusCode: 500,
      body: error,
    };
    return response;
  }
};
