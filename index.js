const express = require('express')
const app = express()
const path = require('path')

const rp = require('request-promise-native')

// app.get('/', (req, res) => res.send('Hello World!'))

app.post('/buyGadget', (req, res) => {
  console.info("buying gadget x!");

  // curl -d 'hello from zsh!' -X POST localhost:8080/events

  var options = {
    method: 'POST',
    uri: 'http://localhost:8080/events',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      event_name: "prospect_clicked_buy",
      productId: 123,
      prospectId: "abc"
    }),
    // json: true // Automatically stringifies the body to JSON
  };

  rp(options)
    .then(function (parsedBody) {
      console.log(parsedBody)
      res.send("purchased!");
      // POST succeeded...
    })
    .catch(function (err) {
      console.error(err)
      res.send("failed!");
      // POST failed...
    });

})

app.use('/', express.static(path.join(__dirname, 'public')))

app.listen(3000, () => console.log('Example app listening on port 3000!'))