import React, { useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

function App() {
  const [stockSymbol, setStockSymbol] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSymbolChange = (e) => {
    setStockSymbol(e.target.value);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Show loader while fetching data

    try {
      const response = await axios.post('http://localhost:5000/api/fetchStockData', {
        stockSymbol: stockSymbol,
        date: selectedDate,
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      setStockData(response.data);
      setLoading(false); // Hide loader after data is received
    } catch (error) {
      console.error(error.message);
      setLoading(false); // Hide loader on error
    }
  };

  return (
    <div className="App bg-gradient-to-r from-indigo-500 to-blue-500 min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">Stock Data Fetcher</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-6 ">
            <label className="block text-gray-800 font-semibold mb-2">Stock Symbol:</label>
            <input
              type="text"
              value={stockSymbol}
              onChange={handleSymbolChange}
              className="w-full border border-gray-300 rounded py-2 px-3 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-indigo-500"
              placeholder="Enter stock symbol..."
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-800 font-semibold mb-2">Date:</label>
            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              className="w-full border border-gray-300 rounded py-2 px-3 text-gray-800 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            className={`w-full bg-indigo-500 text-white font-semibold py-2 px-4 rounded ${
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-600'
            }`}
            disabled={loading}
          >
            {loading ? 'Fetching...' : 'Fetch Data'}
          </button>
        </form>

        {loading && <div className="text-center mt-4 text-gray-800">Loading...</div>}

        {stockData && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-center mb-4">Stock Data for {format(new Date(stockData.date), 'dd MMM yyyy')}</h2>
            <p className="text-gray-800">Open Price: {stockData.openPrice}</p>
            <p className="text-gray-800">High Price: {stockData.highPrice}</p>
            <p className="text-gray-800">Low Price: {stockData.lowPrice}</p>
            <p className="text-gray-800">Close Price: {stockData.closePrice}</p>
            <p className="text-gray-800">Volume: {stockData.volume}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
