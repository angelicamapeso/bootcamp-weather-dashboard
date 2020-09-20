//Search button event listener
document.getElementById('search-city').addEventListener('submit', submitSearch);

/***** Handling user input *****/
//when search submitted
function submitSearch(event) {
  event.preventDefault();
  resetSearchError();
  
  const userInput = getUserInput();

  if (userInput) {
    startGettingWeatherData(userInput);
  } else {
    document.getElementById('city-name').value = '';
    showSearchError('Please enter a city name');
  }
}

function getUserInput() {
  let userInput = document.getElementById('city-name').value;
  userInput = userInput.replace(/\s/g,'');
  return userInput;
}

//errors
function resetSearchError() {
  document.getElementById('city-name').classList.remove('border-danger');
  document.getElementById('error').textContent = '';
}

function showSearchError(message) {
  document.getElementById('city-name').classList.add('border-danger');
  document.getElementById('error').textContent = message;
}

/***** Getting weather data *****/
function startGettingWeatherData(cityName) {
  const apiKey = '8364edf40aaaa47bca43e4b4901faf72';
  getFiveDayForecast(cityName, apiKey);
}

//returns current day forecast, and next 5 days
function getFiveDayForecast(cityName, apiKey) {
  const fiveDayForecastURL = getFiveDayForecastURL(cityName, apiKey);

  fetch(fiveDayForecastURL)
    .then(function(response){
      return response.json();
    })
    .then(function(days){
      console.log(days);
      if (days.cod != 200) {
          showSearchError(properlyCapitalize(days.message));
      } else {
        const weatherObj = getWeatherObject(cityName,
          days.list,
          days.city.coord.lat, days.city.coord.lon);
        console.log(weatherObj);
        getUVIndex(weatherObj, apiKey);
      }
    });
}

function getWeatherObject(cityName, dayList, lat, lon) {
  const currentDate = new Date();
  const currentDateMilliseconds = Math.floor(currentDate.getTime()/1000.0);

  let weatherObj =
  {
    cityName: properlyCapitalize(cityName),
    coord:
    {
      lat: '',
      lon: '',
    },
    currentDay: {},
    next5Days: [],
  };

  for (day of dayList) {
    if(currentDateMilliseconds > day.dt) {
      weatherObj.currentDay = day;
    } else {
      let listDate = new Date(day.dt_txt);
      if (listDate.getHours() === 12
        && listDate.getDate() != currentDate.getDate()) {
        weatherObj.next5Days.push(day);
      }
    }
  }
  if (Object.keys(weatherObj.currentDay).length === 0) {
    weatherObj.currentDay = dayList[0];
  }
  if (weatherObj.next5Days.length < 5) {
    weatherObj.next5Days.push(dayList[dayList.length - 1]);
  }
  weatherObj.coord.lat = lat;
  weatherObj.coord.lon = lon;

  return weatherObj;
}

//get uv index of the current day
function getUVIndex(weatherObj, apiKey) {
  const weatherData = weatherObj;
  const uvIndexURL = getUVIndexURL(
    weatherObj.coord.lat,
    weatherObj.coord.lon,
    apiKey);

  fetch(uvIndexURL)
    .then(function(response){
      return response.json();
    })
    .then(function(data){
      weatherData.currentDay['uvIndex'] = data.value;

      displayInformation(weatherData, weatherData.cityName);
    });
}

//getting URL queries
function getFiveDayForecastURL(cityName, apiKey) {
  return 'http://api.openweathermap.org/data/2.5/forecast?'
   + `q=${cityName}`
   + '&units=imperial'
   + `&appid=${apiKey}`;
}

function getUVIndexURL(lat, lon, apiKey) {
  return 'http://api.openweathermap.org/data/2.5/uvi?'
   + `lat=${lat}&lon=${lon}`
   + `&appid=${apiKey}`;
}

/***** Display functions *****/
function displayInformation(weatherObj, cityName) {
  displayOverviewCard(weatherObj.currentDay , cityName);
}

function displayOverviewCard(currentDay, cityName) {
  const displayDiv = document.getElementById('display-info');

  displayDiv.innerHTML =
    `<div class="card-body">
      <h2 class="d-inline-block mr-3">${cityName} ${formatDate(currentDay.dt_txt)}</h2>
      <img class="d-inline-block" src="http://openweathermap.org/img/wn/${currentDay.weather[0].icon}@2x.png" alt="${currentDay.weather[0].description}">
      <p>Temperature: ${currentDay.main.temp} &#176;F</p>
      <p>Humidity: ${currentDay.main.humidity}&#37;</p>
      <p>Wind Speed: ${currentDay.wind.speed} MPH</p>
      <p>UV Index: <span id="current-uv-index" class="bg-danger py-1 px-2 text-white rounded">${currentDay.uvIndex}</span></p>
    </div>`;
}

/***** Formatting functions *****/
function formatDate(date) {
  const newDate = new Date(date);
  return `(${newDate.getMonth() + 1}/${newDate.getDate()}/${newDate.getFullYear()})`;
}

function properlyCapitalize(str) {
  let copy = str.toString().toLowerCase();
  return copy.charAt(0).toUpperCase() + copy.slice(1);
}
//on page load
  //grab the search object from local storage
  //display the overview info from current (make another fetch)
  //display search history
  //display 5 day forecast

  //if none
    //center text- enter city to see weather

//when city clicked in search history
  //if selection isn't current
    //make another fetch
    //display search history
    //display overview card
    //display 5 day forecast



