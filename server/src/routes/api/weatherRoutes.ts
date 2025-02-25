import { Router } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
//recieving object {cityName = cityName}
router.post('/', async (req, res) => {
  // TODO: GET weather data from city name
  const city = req.body.cityName
  try {
  const forecast = await WeatherService.getWeatherForCity(city);
  res.status(201).json(forecast)
  // TODO: save city to search history
  await HistoryService.addCity(city)
  } catch (err) {
    res.status(404).json({message: "City not found."})
  }
  
});

// TODO: GET search history
router.get('/history', async (_req, res) => {
  try {
  const searchHistory = await HistoryService.getCities()
  res.status(201).json(searchHistory)
  } catch (err) {
    res.status(404).json({message: "History not found."})
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req, res) => {
  try {
  await HistoryService.removeCity(req.params.id)
  res.status(200).end()
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete city from history'})
  }
});

export default router;
