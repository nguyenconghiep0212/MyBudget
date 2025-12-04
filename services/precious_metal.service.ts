import { showAlert } from '@/utils/helper';
import axios from 'axios';

const fetchGoldPriceSJC = async () => {
  try {
    const response = await axios.get(`https://sjc.com.vn/GoldPrice/Services/PriceService.ashx`, {
      headers: {
        Accept: 'application/json',
      },
    });
    if (response.status === 200) {
      const result = response.data;
      return result;
    }
  } catch (error: any) {
    console.error('Error fetching gold price SJC:', error);
    showAlert('Network Error', 'Please check your Wifi/4G connection and try again.');
  } finally {
  }
};

const fetchGoldPricePNJ = async (zone = 11) => {
  try {
    const response = await axios.get(
      `https://edge-api.pnj.io/ecom-frontend/v1/get-gold-price?zone=${zone}`,
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
    console.error('Error fetching gold price SJC:', error);
    showAlert('Network Error', 'Please check your Wifi/4G connection and try again.');
  } finally {
  }
};

async function getGoldPriceByMonth() {
  try {
    const response = await axios.get(
      `https://24h.24hstatic.com/ajax/box_bieu_do_gia_vang/index/sjc/0/0?is_template_page=1`,
      {
        headers: {
          Accept: 'application/json',
        },
      },
    );
    if (response.status === 200) {
      const result = extractChartObject(response.data);
      return result;
    } else {
      throw new Error(JSON.stringify(response));
    }
  } catch (error) {
    console.error('Error fetching monthly gold price:', error);
    showAlert('Network Error', 'Please check your Wifi/4G connection and try again.');
  }

  function extractChartObject(htmlString: string) {
    // Regular expression to match the Highcharts initialization
    const regex = /\$\('#div_bieu_do_gia_vang'\)\.highcharts\(([\s\S]*?\}\s*\]\s*\}\s*)\);/;
    const match = htmlString.match(regex);
    if (match && match[1]) {
      // Return the matched JSON string and parse it into an object
      const chartObjectString = match[1].trim();
      const result = eval(`(${chartObjectString})`); // Use eval to convert string to object
      return result;
    }

    return null; // Return null if no match is found
  }
}

export {
  // fetchGoldPriceVNAppMob,
  // refreshApiKey,
  getGoldPriceByMonth,
  fetchGoldPriceSJC,
  fetchGoldPricePNJ,
};
