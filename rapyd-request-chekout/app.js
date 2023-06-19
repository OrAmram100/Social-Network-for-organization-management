
const express = require('express');
const os = require('os');

const makeRequest = require('./utilities').makeRequest;

const { v4: uuidv4 } = require('uuid');

const app = express();

app.set('json spaces', 4);
const port = 3001;

// Get the network interfaces of the current machine
const interfaces = os.networkInterfaces();

// Find the IP address for the current machine
const addresses = [];
for (const iface of Object.values(interfaces)) {
  for (const addr of iface) {
    if (addr.family === 'IPv4' && !addr.internal) {
      addresses.push(addr.address);
    }
  }
}

// Use the first IP address found as the base URL for your requests
const baseUrl = `http://${addresses[0]}:3000`;

app.listen(port , ()=>{
    console.log(`server is running on port ${port}`);
})

app.get('/checkout/:amount/:country/:currency', async (req, res) => {

    try {
        const amount = req.params.amount;
        const country = req.params.country;
        const currency = req.params.currency;

        const body = {
            amount,
            complete_checkout_url: `${baseUrl}/successPayment`,
            cancel_checkout_url: `${baseUrl}/failedPayment`,
            country,
            currency,
            requested_currency: 'USD',
            merchant_reference_id: uuidv4(),
            payment_method_types_include: [],
            payment_method_type_categories:['card']
          };
        const result = await makeRequest('POST', '/v1/checkout', body);
        res.redirect(result.body.data.redirect_url);
    } catch (error) {
        res.json(error);
    }

})