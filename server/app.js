require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require("axios");
const app = express();

app.use(function (req, res, next) {
  const allowedOrigins = ['http://localhost:3000'];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, UPDATE');
  next();
});

app.use(bodyParser.json());

app.enable('trust proxy');

app.get('/', (req, res) => {
  res.send('Hello');
});

app.post('/api/fetchStockData', async (req, res) => {
    try {
        const { stockSymbol, date } = req.body;

        if (!stockSymbol || !date) {
            return res.status(400).json({ error: "Both 'stockSymbol' and 'date' are required." });
        }

        const formattedDate = new Date(date).toISOString().split('T')[0];

        const apiKey = process.env.POLYGON_API_KEY; 
        if (!apiKey) {
            return res.status(500).json({ error: "Polygon API key not found. Make sure you have set the 'POLYGON_API_KEY' environment variable." });
        }

        const apiUrl = `https://api.polygon.io/v2/aggs/ticker/${stockSymbol}/range/1/day/${formattedDate}/${formattedDate}?apiKey=${apiKey}`;

        const response = await axios.get(apiUrl);

        const tradeStats = response.data.results.length > 0 ? response.data.results[0] : null;

        if (!tradeStats) {
            return res.status(404).json({ error: `No trade statistics found for stock '${stockSymbol}' on date '${formattedDate}'` });
        }

       
        const requiredFields = {
            stockSymbol: tradeStats.T,
            date: tradeStats.t,
            openPrice: tradeStats.o,
            highPrice: tradeStats.h,
            lowPrice: tradeStats.l,
            closePrice: tradeStats.c,
            volume: tradeStats.v,
        };

        res.status(200).json(requiredFields);
    } catch (error) {
        console.error("Error fetching stock data:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}`));
