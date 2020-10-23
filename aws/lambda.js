const https = require("https");

const headers = {
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
};

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
  const { country, start, end } = event;
  try {
    const results = await getData();
    const countryData = results[country];
    if (country && start && end) {
      const daysInfo = countryData.filter(
        (day) => day.date >= start && day.date <= end
      );
      const response = {
        statusCode: 200,
        headers: headers,
        body: daysInfo,
      };
      return response;
    } else {
      const dayInfo = countryData.filter((day) => day.date === start);
      const response = {
        statusCode: 200,
        headers: headers,
        body: dayInfo,
      };
      return response;
    }
  } catch (error) {
    const response = {
      statusCode: 500,
      headers: headers,
      body: JSON.stringify(error),
    };
    return response;
  }
};
