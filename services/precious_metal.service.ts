import axios from 'axios';
import { getFile, setFile } from './file.service';

let API_KEY: string = '';
const api_key_file = 'vnappmob_key.txt';

export enum GOLD_BRAND {
  SJC = 'sjc',
  DOJI = 'doji',
  PNJ = 'pnj',
}

// Function to fetch gold price
const fetchGoldPrice = async (brand: GOLD_BRAND) => {
  try {
    const temp = await getFile(api_key_file);
    const API_KEY = temp?.replaceAll('"', '');
    const response = await axios.get(`https://vapi.vnappmob.com/api/v2/gold/${brand}`, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        Accept: 'application/json',
      },
    });
    if (response.status === 200) {
      const result = response.data.results;
      return result;
    }
  } catch (error: any) {
    console.error('Error fetching gold price:', error);
  } finally {
  }
};

// Function to fetch gold price
const refreshApiKey = async () => {
  try {
    const response = await axios.get(`https://vapi.vnappmob.com/api/request_api_key?scope=gold`, {
      headers: {
        Accept: 'application/json',
      },
    });
    if (response.status === 200) {
      const result = response.data.results;
      API_KEY = JSON.stringify(result);
      setFile(API_KEY, api_key_file);
    } else {
      throw new Error(JSON.stringify(response));
    }
  } catch (error) {
    console.error('Error fetching API key:', error);
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

export { fetchGoldPrice, refreshApiKey, getGoldPriceByMonth };
