import fs from 'fs/promises';

export interface Task {
  id: string;
  text: string;
  completed: boolean;
}

const DATA_PATH = './data.json';

export async function loadData(): Promise<Task[]> {
  try {
    const data = await fs.readFile(DATA_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error loading data: ${err}`);
  }
  return [];
}

export async function saveData(data: Task[]): Promise<void> {
  try {
    await fs.writeFile(DATA_PATH, JSON.stringify(data));
  } catch (err) {
    console.error(`Error saving data: ${err}`);
  }
}
