import * as FileSystem from 'expo-file-system/legacy';
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
export { getFile, setFile, getAllFiles, RemoveFile };
