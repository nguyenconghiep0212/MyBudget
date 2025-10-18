import * as FileSystem from 'expo-file-system/legacy';
import { BudgetEvent, MonthlyBudget } from '@/types/budget';
import { Gold } from '@/types/budget';

const expenseFileName = 'expense_data.json';
const goldFileName = 'gold_data.json';
const monthlyBudgetFileName = 'monthly_budget_data.json';

async function InitFiles() {
  await Promise.all([
    CheckAndCreateFile(expenseFileName),
    CheckAndCreateFile(goldFileName),
    CheckAndCreateFile(monthlyBudgetFileName),
  ]);

  // CheckAndCreateFile(expenseFileName);
  // CheckAndCreateFile(goldFileName);
  // CheckAndCreateFile(monthlyBudgetFileName);

  CopyFileToExternalStorage(expenseFileName);
  CopyFileToExternalStorage(goldFileName);
  CopyFileToExternalStorage(monthlyBudgetFileName);
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

async function CopyFileToExternalStorage(fileName: string) {
  // Copy the file to the external storage (Downloads folder)
  const filePath = `${FileSystem.documentDirectory}${fileName}`;
  const externalFilePath = `${FileSystem.documentDirectory}../Downloads/${fileName}`;
  await FileSystem.copyAsync({
    from: filePath,
    to: externalFilePath,
  });
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
};
