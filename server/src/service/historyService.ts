import { v4 as uuidv4 } from 'uuid';
import fs from "fs";
import path from 'path';

// TODO: Define a City class with name and id properties
class City {
  name: string;
  id: string;

  constructor(name:string, id: string) {
    this.name = name;
    this.id = id;
  }
}

// TODO: Complete the HistoryService class
class HistoryService {
  private filePath = path.resolve(__dirname, '../../db/searchHistory.json');
  // TODO: Define a read method that reads from the searchHistory.json file
  private async read() {
    try {
    const data = await fs.promises.readFile(this.filePath, 'utf-8');
    const dataParsed = JSON.parse(data)
    return dataParsed
    } catch (error) {
      console.error('Error reading file.')
      return []
    }
  }
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]) {
    try {
    await fs.promises.appendFile(this.filePath, JSON.stringify(cities))
    } catch (error) {
      console.error('Error writing file')
    }
  }
  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities() {
    return this.read()
  }
  // TODO Define an addCity method that adds a city to the searchHistory.json file
  async addCity(city: string) {
    const citiesArray = await this.getCities()
    const newCity = new City(city, uuidv4())
    citiesArray.push(newCity)
    this.write(citiesArray)
  }
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  // async removeCity(id: string) {}
}

export default new HistoryService();
