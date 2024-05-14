const { readFile, writeFile } = require('fs/promises');

const tasksFilePath = 'tasks.json';

async function loadData() {
  try {
    const data = await readFile(tasksFilePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    if (err.code === 'ENOENT') {
      return [];
    }
    throw err;
  }
}

async function saveData(tasks) {
  const data = JSON.stringify(tasks, null, 2);
  await writeFile(tasksFilePath, data);
}

module.exports = { loadData, saveData };
