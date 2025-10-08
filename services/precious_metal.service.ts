import axios from 'axios';
import * as FileSystem from 'expo-file-system/legacy';

let API_KEY: string =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NjEyMDc3NTUsImlhdCI6MTc1OTkxMTc1NSwic2NvcGUiOiJnb2xkIiwicGVybWlzc2lvbiI6MH0.C9WZYVeWGEwdC86qOMbcyl4EAc26SIR2q25b8lABWNE';
const api_key_file = 'vnappmob_key.txt';

export enum GOLD_BRAND {
  SJC = 'sjc',
  DOJI = 'doji',
  PNJ = 'pnj',
}

// Function to fetch gold price
const fetchGoldPrice = async (brand: GOLD_BRAND) => {
  try {
    console.log('call =============');
    const API_KEY = await getFile(api_key_file);
    const response = await axios.get(`https://vapi.vnappmob.com/api/v2/gold/${brand}`, {
      headers: {
        Authorization: `Bearer ${API_KEY?.replaceAll('"', '')}`,
        Accept: 'application/json',
      },
      // params: {
      //   date_from: new Date('2025-09-24'),
      //   date_to: new Date(), // Pass the date as a query parameter
      // },
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
    return res;
  } catch (error) {
    console.error(error);
  }
}
async function getAllFiles() {
  if (FileSystem.documentDirectory) {
    const files = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory);
    console.log('All files: ' + JSON.stringify(files));
  }
}
async function RemoveFile(fileName: string) {
  try {
    if (fileName) {
      const path = `${FileSystem.documentDirectory}${fileName}`;
      const res = await FileSystem.getInfoAsync(path);
      if (res.exists) FileSystem.deleteAsync(path);
    }
  } catch (error) {
    console.error('Unable to delete file: ' + error);
  }
}

export { fetchGoldPrice, refreshApiKey, getFile, setFile, getAllFiles, RemoveFile };
