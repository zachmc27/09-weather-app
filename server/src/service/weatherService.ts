import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: string;
  lon: string;
}
// TODO: Define a class for the Weather object
// Used in build forecast array, should hold details about the forecast that are obtained from the returned object of weather data
class Weather {
  city?: string;
  date?: string;
  icon: string;
  iconDescription?: string;
  tempF: number;
  windSpeed: number;
  humidity: number;

  constructor(
    city: string,
    date: string,
    icon: string,
    iconDescription: string,
    tempF: number,
    windSpeed: number,
    humidity: number,
  ) {
    this.city = city;
    this.date = date;
    this.icon = icon;
    this.iconDescription = iconDescription;
    this.tempF = tempF;
    this.windSpeed = windSpeed;
    this.humidity = humidity
  }
};

// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  baseURL: string;
  apiKey: string;
  cityName: string;

  constructor () {
    this.baseURL = process.env.API_BASE_URL || "https://api.openweathermap.org";
    this.apiKey = process.env.API_KEY || "4e17607d5f47c14c70e2d3678b4ccd60";
    this.cityName = ""
  }
  // TODO: Create fetchLocationData method
  //enter the city into geocode api to return object containing lat and lon
  //wait then save lat and lon into locationData and return locationData
  private async fetchLocationData(query: string) {
    let locationData: Coordinates = {
      lat: '',
      lon: ''
    }
    const geoQuery = this.buildGeocodeQuery(query)

    const geocode = await fetch(geoQuery);
    
    if (!geocode.ok) {
      throw new Error(`Error:${geocode.statusText}`)
    }

    const geocodeParsed = await geocode.json()
    
    locationData = {
      lat: geocodeParsed[0].lat,
      lon: geocodeParsed[0].lon
    }

    return locationData
  };
  // TODO: Create destructureLocationData method
  //destructure locationData into individual variables of lat and lon
  private destructureLocationData(locationData: Coordinates): Coordinates {
    const { lat, lon } = locationData
    let coordinates = {
      lat,
      lon
    }
    
    return coordinates
  }
  // TODO: Create buildGeocodeQuery method
  //make URL
  private buildGeocodeQuery(query: string): string {
    return `${this.baseURL}/geo/1.0/direct?q=${query}&limit=1&appid=${this.apiKey}`
  }
  // TODO: Create buildWeatherQuery method
  //make url
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}&units=imperial`
  }
  // TODO: Create fetchAndDestructureLocationData method
  //put fetchLocationData and destructureLocationData functions into this one. Needs to wait for first to start the second.
  private async fetchAndDestructureLocationData() {
    const locationData = await this.fetchLocationData(this.cityName)
    
    const coordinates = this.destructureLocationData(locationData)

    return coordinates

  }
  // TODO: Create fetchWeatherData method
  //put lat and lon for desired location into an api call URL, save response into a variable and return the variable
  private async fetchWeatherData(coordinates: Coordinates) {
    const weatherQuery = this.buildWeatherQuery(coordinates)
   try {
   const fetchedWeather = await fetch(weatherQuery)
   const weatherData = await fetchedWeather.json()
    return weatherData
   } catch (err) {
    throw new Error(`Error:err` )
   }
  }

  // TODO: Build parseCurrentWeather method
  //make weather class
  private parseCurrentWeather(response: any) {
    const dateOnly = response.list[0].dt_txt.split(" ")
    try {
    const weather = new Weather(
      response.city.name,
      dateOnly[0],
      response.list[0].weather[0].icon,
      response.list[0].weather[0].description,
      response.list[0].main.temp,
      response.list[0].wind.speed,
      response.list[0].main.humidity
    )

    return weather
  } catch (err) {
    throw new Error('Invalid weather data.')
  }
  }
  // TODO: Complete buildForecastArray method
  //api call then put the response data into weatherData array
  private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
    let forecastArray = [currentWeather]
    
    const futureDays = weatherData.filter((item) => {
      return item.dt_txt.includes('12:00:00')
    })

    const futureDaysWeather = futureDays.map((item) => {
      const dateOnly = item.dt_txt.split(" ")
      const weatherOfDay = new Weather(
        this.cityName,
        dateOnly[0],
        item.weather[0].icon,
        item.weather[0].description,
        item.main.temp,
        item.wind.speed,
        item.main.humidity
      )
      return weatherOfDay
    })
      forecastArray = forecastArray.concat(futureDaysWeather)
      return forecastArray

  }
  // TODO: Complete getWeatherForCity method
  // all private methods above will be used in this function
  async getWeatherForCity(city: string) {
    this.cityName = city
    const coordinates = await this.fetchAndDestructureLocationData();
    console.log('Fetched Coordinates:', coordinates);
    const weatherData = await this.fetchWeatherData(coordinates);
    const currentWeather = await this.parseCurrentWeather(weatherData);
    console.log('Fetched current weather:', currentWeather)
    const forecast = await this.buildForecastArray(currentWeather, weatherData.list)
    console.log('Fetched forecast:', forecast)

    return forecast
  }
}

export default new WeatherService();
