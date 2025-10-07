import axios from 'axios';
import * as FileSystem from 'expo-file-system/legacy';

let API_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NjExNTI2MzYsImlhdCI6MTc1OTg1NjYzNiwic2NvcGUiOiJnb2xkIiwicGVybWlzc2lvbiI6MH0.J8heE3Q81VlN4iZ8x3HAzIbio-P9tUT9YED5eOEsSj4';
const retryMax = 3;
let retry = 0;
// Function to fetch gold price
const fetchGoldPrice = async () => {
  try {
    if (retry === retryMax) {
      throw new Error('Max retry reached !!!');
    }
    const response = await axios.get(`https://vapi.vnappmob.com/api/v2/gold/sjc`, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        Accept: 'application/json',
      },
      params: {
        date_from: new Date('2025-09-24'),
        date_to: new Date(), // Pass the date as a query parameter
      },
    });
    if (response.status === 200) {
      const result = response.data.results;
      return result;
    }
  } catch (error: any) {
    console.error('Error fetching gold price:', error);
    if (error.status === 500 || error.status === 403) {
      retry++;
      API_KEY = await refreshApiKey();
    }
    retry = 0;
  } finally {
  }
};
async function setFile(content: string, fileName: string) {
  try {
    const fileUri = `${FileSystem.documentDirectory}${fileName}`;
    await FileSystem.writeAsStringAsync(fileUri, content, {
      encoding: FileSystem.EncodingType.UTF8,
    });
  } catch (error) {
    console.error(error);
  }
}
async function getFile(fileName: string) {
  try {
    const fileUri = `${FileSystem.documentDirectory}${fileName}`;
    const res = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.UTF8,
    });
    console.log('READ: ' + JSON.stringify(res));
  } catch (error) {
    console.error(error);
  }
}
async function getAllFiles() {
  if (FileSystem.documentDirectory) {
    const files = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory);
    console.log(files);
  }
}
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
      return result;
    } else {
      throw new Error(JSON.stringify(response));
    }
  } catch (error) {
    console.error('Error fetching API key:', error);
  } finally {
  }
};

export { fetchGoldPrice, refreshApiKey, getFile, setFile, getAllFiles };
