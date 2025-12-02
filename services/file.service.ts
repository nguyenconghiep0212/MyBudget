import * as FileSystem from 'expo-file-system/legacy';
import { BudgetEvent, MonthlyBudget, Gold, MergeData } from '@/types/budget';
import * as DocumentPicker from 'expo-document-picker';
import * as Sharing from 'expo-sharing';

const mergeDataFileName = 'merge_data.json';
const mergeContent: MergeData = {
  budgetEvents: [],
  monthlyBudgets: [],
  gold: [],
};

async function InitFiles() {
  await Promise.all([CheckAndCreateFile(mergeDataFileName)]);
  await CheckFileData();
}
const CheckAndCreateFile = async (fileName: string) => {
  try {
    // Check if the file exists
    const filePath = `${FileSystem.documentDirectory}${fileName}`;
    const fileInfo = await FileSystem.getInfoAsync(filePath);

    if (!fileInfo.exists) {
      // If the file does not exist, create it
      const content = ''; // Define the content you want to write
      await FileSystem.writeAsStringAsync(filePath, content);
      console.log('File created:', filePath);
    } else {
      console.log('File already exists:', filePath);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
const CheckFileData = async () => {
  const res = await GetMergeData();
  if (res) {
    mergeContent.budgetEvents = res.budgetEvents;
    mergeContent.gold = res.gold;
    mergeContent.monthlyBudgets = res.monthlyBudgets;
    console.log('mergeContent data: ' + JSON.stringify(mergeContent));
  } else {
    console.error('MergeContent empty');
  }
};

async function SaveExpense(content: BudgetEvent[]) {
  mergeContent.budgetEvents = content;
  SaveMergeData();
}
async function GetExpense() {
  let res: BudgetEvent[] = [];
  const temp = await GetMergeData();
  if (temp) {
    res = temp.budgetEvents;
  }
  return res;
}
async function SaveGold(content: Gold[]) {
  mergeContent.gold = content;
  SaveMergeData();
}
async function GetGold() {
  let res: Gold[] = [];
  const temp = await GetMergeData();
  if (temp) {
    res = temp.gold;
  }
  return res;
}
async function SaveMonthlyBudget(content: MonthlyBudget[]) {
  mergeContent.monthlyBudgets = content;
  SaveMergeData();
}
async function GetMonthlyBudget() {
  let res: MonthlyBudget[] = [];
  const temp = await GetMergeData();
  if (temp) {
    res = temp.monthlyBudgets;
  }
  return res;
}

async function SaveMergeData() {
  console.log('Save merge data: ' + mergeContent);
  await setFile(mergeDataFileName, JSON.stringify(mergeContent));
}
async function GetMergeData() {
  let res: MergeData = {
    budgetEvents: [],
    monthlyBudgets: [],
    gold: [],
  };
  const temp = await getFile(mergeDataFileName);
  if (temp) {
    res = JSON.parse(temp);
  }
  return res;
}
async function setFile(fileName: string, content: string) {
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
    console.log('Read file: ' + fileUri + ' success');
    // console.log('Content: ' + res);
    return res;
  } catch (error) {
    console.error(error);
  }
}
// async function getAllFiles() {
//   if (FileSystem.documentDirectory) {
//     const files = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory);
//     console.log('All files: ' + JSON.stringify(files));
//   }
// }
// async function RemoveFile(fileName: string) {
//   try {
//     if (fileName) {
//       const path = `${FileSystem.documentDirectory}${fileName}`;
//       const res = await FileSystem.getInfoAsync(path);
//       if (res.exists) FileSystem.deleteAsync(path);
//     }
//   } catch (error) {
//     console.error('Unable to delete file: ' + error);
//   }
// }

async function PickExternalFile(): Promise<string> {
  const result = await DocumentPicker.getDocumentAsync({
    type: 'application/json', // Only allow .txt files
    copyToCacheDirectory: true, // Makes it accessible via FileSystem
  });

  if (result.canceled) {
    console.log('User cancelled the picker');
    return '';
  }

  const uri = result.assets[0].uri;

  // Read file content
  const content = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.UTF8,
  });
  return content;
}
async function CopyDataToExternalStorage() {
  await CopyFileToExternalStorage(mergeDataFileName);
}

async function ReadDataFromExternalStorage() {
  try {
    const res = await PickExternalFile();
    const parsed: MergeData = JSON.parse(res);
    const { budgetEvents, gold, monthlyBudgets } = parsed;
    if (!isBudgetEventArray(budgetEvents)) {
      console.error('❌ Parsed data is not a valid BudgetEvent array.');
      return false;
    }
    if (!isGoldArray(gold)) {
      console.error('❌ Parsed data is not a valid Gold array.');
      return false;
    }
    if (!isMonthlyBudgetArray(monthlyBudgets)) {
      console.error('❌ Parsed data is not a valid MonthlyBudget array.');
      return false;
    }
    await SaveExpense(budgetEvents as BudgetEvent[]);
    await SaveGold(gold as Gold[]);
    await SaveMonthlyBudget(monthlyBudgets as MonthlyBudget[]);
    console.log('Merge data: ' + mergeContent);

    // console.log('--------------------SaveExpense: ' + budgetEvents);
    // console.log('--------------------SaveGold: ' + gold);
    // console.log('--------------------SaveMonthlyBudget: ' + monthlyBudgets);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
  function isBudgetEventArray(data: any): data is BudgetEvent[] {
    return Array.isArray(data) && data.every(isBudgetEvent);
  }
  function isBudgetEvent(obj: any): obj is BudgetEvent {
    return (
      typeof obj === 'object' &&
      typeof obj.categoryId === 'number' &&
      typeof obj.id === 'string' &&
      typeof obj.name === 'string' &&
      typeof obj.description === 'string' &&
      typeof obj.amount === 'number' &&
      typeof obj.date === 'string'
    );
  }
  function isGoldArray(data: any): data is Gold[] {
    return Array.isArray(data) && data.every(isGold);
  }
  function isGold(obj: any): obj is Gold {
    return (
      typeof obj === 'object' &&
      typeof obj.id === 'string' &&
      typeof obj.own === 'number' &&
      typeof obj.category === 'number' &&
      typeof obj.priceAtBought === 'number'
    );
  }
  function isMonthlyBudgetArray(data: any): data is MonthlyBudget[] {
    return Array.isArray(data) && data.every(isMonthlyBudget);
  }
  function isMonthlyBudget(obj: any): obj is MonthlyBudget {
    return (
      typeof obj === 'object' &&
      typeof obj.month === 'number' &&
      typeof obj.year === 'number' &&
      typeof obj.amount === 'number' &&
      typeof obj.salary === 'number'
    );
  }
}

async function ResetAllData(): Promise<boolean> {
  let res = false;
  await Promise.all([SaveExpense([]), SaveGold([]), SaveMonthlyBudget([])])
    .then(() => {
      res = true;
    })
    .catch(() => {
      res = false;
    });
  return res;
}

async function CopyFileToExternalStorage(fileName: string) {
  const filePath = `${FileSystem.documentDirectory}${fileName}`;
  const shareAvailable = await Sharing.isAvailableAsync();
  if (shareAvailable) {
    Sharing.shareAsync(filePath);
  }
}
export {
  InitFiles,
  getFile,
  setFile,
  SaveExpense,
  SaveGold,
  SaveMonthlyBudget,
  GetExpense,
  GetGold,
  GetMonthlyBudget,
  GetMergeData,
  ReadDataFromExternalStorage,
  CopyDataToExternalStorage,
  ResetAllData,
};
