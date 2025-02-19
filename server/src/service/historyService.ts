import { v4 as uuidv4 } from 'uuid';
import fs from "fs";
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
  // TODO: Define a read method that reads from the searchHistory.json file
  private async read() {
    const data = await fs.readFile('../../db/searchHistory.json', 'utf-8',  (error, data) =>
    error ? console.error(error) : data)
    return data
  }
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  // private async write(cities: City[]) {}
  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  // async getCities() {}
  // TODO Define an addCity method that adds a city to the searchHistory.json file
  // async addCity(city: string) {}
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  // async removeCity(id: string) {}
}

export default new HistoryService();
