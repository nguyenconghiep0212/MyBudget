import axios from 'axios';

async function fetchVPBankExchangeRate() {
  try {
    const response = await axios.get(`https://www.vpbank.com.vn/uiux-api/api/exchange-rate`, {
      headers: {
        Accept: 'application/json',
      },
    });
    if (response.status === 200) {
      const result = response.data;
      return result;
    }
  } catch (error: any) {
    console.error('Error fetching VPBank exchange rate data:', error);
  } finally {
  }
}
async function fetchBIDVBankExchangeRate() {
  try {
    const response = await axios.get(`https://bidv.com.vn/ServicesBIDV/ExchangeDetailServlet`, {
      headers: {
        Accept: 'application/json',
      },
    });
    if (response.status === 200) {
      const result = response.data;
      return result;
    }
  } catch (error: any) {
    console.error('Error fetching BIDV exchange rate data:', error);
  } finally {
  }
}

async function fetchVietcomBankExchangeRate() {
  try {
    const date = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
    const response = await axios.get(
      `https://www.vietcombank.com.vn/api/exchangerates?date=${date}`,
      {
        headers: {
          Accept: 'application/json',
        },
      },
    );
    if (response.status === 200) {
      const result = response.data;
      return result;
    }
  } catch (error: any) {
    console.error('Error fetching Vietcom exchange rate data:', error);
  } finally {
  }
}

export { fetchVPBankExchangeRate, fetchBIDVBankExchangeRate, fetchVietcomBankExchangeRate };
