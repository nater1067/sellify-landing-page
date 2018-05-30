const express = require('express');
const app = express();
const path = require('path');
const moment = require('moment');

const rp = require('request-promise-native');

const sendEvent = ({event_name, productId, prospectId, additionalInfo}) => {
  return {
    method: 'POST',
    uri: 'http://localhost:8081/events',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      event_name,
      productId,
      prospectId,
      additionalInfo,
      reportedTime: moment().format("YYYY-MM-DDTHH:mm:ss.SSS")
    }),
  };
};

app.use(function (req, res, next) {
  console.log('Time:', Date.now());
  next()
});

app.post('/buyGadget', (req, res) => {
  console.info("buying gadget x!");

  const options = sendEvent({
    event_name: "prospect_clicked_buy",
    productId: 123,
    prospectId: "abc",
    additionalInfo: {
      "product_name": "Gadget X"
    },
  });

  rp(options)
    .then(function (parsedBody) {
      console.log(parsedBody);
      res.send("purchased!");
      // POST succeeded...
    })
    .catch(function (err) {
      console.error(err);
      res.send("failed!");
      // POST failed...
    });

});

app.use('/', function (req, res, next) {
  console.log('Time:', Date.now());
  const options = sendEvent({
    event_name: "prospect_reached_landing_page",
    productId: 123,
    prospectId: "abc",
    additionalInfo: {
      "landing_page_host": req.headers.host,
      "landing_page_url": req.url,
      "user-agent": req.headers["user-agent"],
    },
  });

  rp(options)
    .then(function (parsedBody) {
      console.log(parsedBody);
      // res.send("purchased!");
      // POST succeeded...
    })
    .catch(function (err) {
      console.error(err);
      console.error("failed to send analytics to sellify")
      // POST failed...
    });

  return express.static(path.join(__dirname, 'public'))(req, res, next)
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));