import * as FileSystem from 'expo-file-system/legacy';
import { BudgetEvent, MonthlyBudget, Gold } from '@/types/budget';
import * as DocumentPicker from 'expo-document-picker';
import * as Sharing from 'expo-sharing';

const expenseFileName = 'expense_data.json';
const goldFileName = 'gold_data.json';
const monthlyBudgetFileName = 'monthly_budget_data.json';

async function InitFiles() {
  await Promise.all([
    CheckAndCreateFile(expenseFileName),
    CheckAndCreateFile(goldFileName),
    CheckAndCreateFile(monthlyBudgetFileName),
  ]);
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

async function SaveExpense(content: BudgetEvent[]) {
  await setFile(expenseFileName, JSON.stringify(content));
}
async function GetExpense() {
  let res: BudgetEvent[] = [];
  const temp = await getFile(expenseFileName);
  if (temp) {
    res = JSON.parse(temp);
  }
  return res;
}
async function SaveGold(content: Gold[]) {
  await setFile(goldFileName, JSON.stringify(content));
}
async function GetGold() {
  let res: Gold[] = [];
  const temp = await getFile(goldFileName);
  if (temp) {
    res = JSON.parse(temp);
  }
  return res;
}
async function SaveMonthlyBudget(content: MonthlyBudget[]) {
  await setFile(monthlyBudgetFileName, JSON.stringify(content));
}
async function GetMonthlyBudget() {
  let res: MonthlyBudget[] = [];
  const temp = await getFile(monthlyBudgetFileName);
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
    console.log('Write file: ' + fileUri + ' success');
    console.log('Content: ' + content);
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
    console.log('Content: ' + res);
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

function CopyExpenseFileToExternalStorage() {
  CopyFileToExternalStorage(expenseFileName);
}
function CopyGoldFileToExternalStorage() {
  CopyFileToExternalStorage(goldFileName);
}
function CopyBudgetFileToExternalStorage() {
  CopyFileToExternalStorage(monthlyBudgetFileName);
}

async function ReadExpenseFileFromExternalStorage() {
  try {
    const res = await PickExternalFile();
    const parsed = JSON.parse(res);
    if (isBudgetEventArray(parsed)) {
      const result: BudgetEvent[] = parsed;
      await SaveExpense(result);
      return true;
    } else {
      console.error('❌ Parsed data is not a valid BudgetEvent array.');
      return false;
    }
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
}
async function ReadGoldFileFromExternalStorage() {
  try {
    const res = await PickExternalFile();
    const parsed = JSON.parse(res);
    if (isBudgetEventArray(parsed)) {
      const result: Gold[] = parsed;
      await SaveGold(result);
      return true;
    } else {
      console.error('❌ Parsed data is not a valid BudgetEvent array.');
      return false;
    }
  } catch (error) {
    console.error(error);
    return false;
  }
  function isBudgetEventArray(data: any): data is Gold[] {
    return Array.isArray(data) && data.every(isBudgetEvent);
  }
  function isBudgetEvent(obj: any): obj is Gold {
    return (
      typeof obj === 'object' &&
      typeof obj.id === 'string' &&
      typeof obj.own === 'number' &&
      typeof obj.category === 'number' &&
      typeof obj.priceAtBought === 'number'
    );
  }
}
async function ReadBudgetFileFromExternalStorage() {
  try {
    const res = await PickExternalFile();
    const parsed = JSON.parse(res);
    if (isBudgetEventArray(parsed)) {
      const result: MonthlyBudget[] = parsed;
      await SaveMonthlyBudget(result);
      return true;
    } else {
      console.error('❌ Parsed data is not a valid BudgetEvent array.');
      return false;
    }
  } catch (error) {
    console.error(error);
    return false;
  }
  function isBudgetEventArray(data: any): data is MonthlyBudget[] {
    return Array.isArray(data) && data.every(isBudgetEvent);
  }
  function isBudgetEvent(obj: any): obj is MonthlyBudget {
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
  GetExpense,
  SaveGold,
  GetGold,
  SaveMonthlyBudget,
  GetMonthlyBudget,
  ReadExpenseFileFromExternalStorage,
  ReadGoldFileFromExternalStorage,
  ReadBudgetFileFromExternalStorage,
  CopyExpenseFileToExternalStorage,
  CopyGoldFileToExternalStorage,
  CopyBudgetFileToExternalStorage,
  ResetAllData,
};
