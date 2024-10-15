const map = L.map("map").fitWorld();

const tiles = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
  {
    maxZoom: 19,
    noWrap: true,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }
).addTo(map);

let marker;
let polygon;
let country;
let airports;

const infoBtn = L.easyButton("fa-info fa-xl", function (btn, map) {
  $("#infoModal").modal("show");
});
const weatherBtn = L.easyButton("fa-cloud fa-xl", function (btn, map) {
  $("#weatherModal").modal("show");
});

const airportBtn = L.easyButton(
  "fa-plane-departure fa-xl",
  function (btn, map) {
    airports.forEach(airport => {
      L.marker([airport.latitude, airport.longitude])
      .addTo(map)
      .bindPopup(`${airport.name}`)
    })
    /*
    for(let i=0; i<airports.length;i++) {
      L.marker([airports[i].latitude, airports[i].longitude])
      .addTo(map)
      .bindPopup(`${airports[i].name}`);
    }
      */
    
  }
);

const citiesBtn = L.easyButton("fa-city fa-xl", function (btn, map) {
  $("#citiesModal").modal("show");
});

const imagesBtn = L.easyButton("fa-images fa-xl", function (btn, map) {
  $("#imagesModal").modal("show");
});

function populateDropdown() {
  let countryList = getCountryList();
  countryList = getCapitals(countryList);
  $.each(countryList, function (i, p) {
    $("#dropdown").append(
      $("<option></option>").val(JSON.stringify(p)).html(p.name)
    );
  });
}

function selectFromDropdown() {
  if (marker) {
    map.removeLayer(marker);
  }
  if (polygon) {
    map.removeLayer(polygon);
  }

  const info = JSON.parse($("#dropdown").val());

  country = {
    name: info.name,
    cca2: info.cca2,
    cca3: info.cca3,
    capital: info.capital,
  };

  //borders

  const borderLatlngs = getCountryBordersFromCca3(country.cca3);
  polygon = L.polygon(borderLatlngs, { color: "red" }).addTo(map);

  //capital
  const capName = `${country.capital} ${country.name}`.replace(/ /g, "+");

  const capitalLatlngs = getLatlngsByName(capName);
  if (!country.capital) {
    marker = L.marker(capitalLatlngs)
      .addTo(map)
      .bindPopup(`${country.name}`)
      .openPopup();
  } else {
    marker = L.marker(capitalLatlngs)
      .addTo(map)
      .bindPopup(`${country.capital}<br>Capital of ${country.name}`)
      .openPopup();
  }
  map.removeLayer(infoBtn);
  const countryInfo = getCountryInfoFromCca3(country.cca3);
  const languagesArr = Object.values(countryInfo.languages);
  const languages = languagesArr.join(", ");
  const currency = Object.values(countryInfo.currency);
  infoBtn.addTo(map);
  $("#infoFlag").html(`<img src=${countryInfo.flag} height="100">`);
  $("#infoCoat").html(`<img src=${countryInfo.coat} height="100">`);
  $("#infoName").html(country.name);
  $("#infoContinent").html(countryInfo.continent[0]);
  $("#infoPopulation").html(countryInfo.population.toLocaleString());
  $("#infoLanguages").html(languages);
  $("#infoCurrency").empty();
  $.each(currency, function (i, p) {
    $("#infoCurrency").append(`${p.name}, ${p.symbol} <br>`);
  });

  map.removeLayer(weatherBtn);
  weatherBtn.addTo(map);
  const weatherInfo = getWeatherInfo(capitalLatlngs[0], capitalLatlngs[1]);
  const sunrise = new Date(weatherInfo.sunrise * 1000)
    .toISOString()
    .slice(11, -5);
  const sunset = new Date(weatherInfo.sunset * 1000)
    .toISOString()
    .slice(11, -5);
  $("#weatherDesc").html(
    `<img src='http://openweathermap.org/img/w/${weatherInfo.desc_icon}.png'> ${weatherInfo.desc}`
  );
  $("#weatherTemp").html(
    `${Math.round(weatherInfo.temp * 10) / 10}°C but feels like ${
      Math.round(weatherInfo.feels_like + 10) / 10
    }°C`
  );
  $("#weatherHumid").html(`${weatherInfo.humidity}%`);
  $("#weatherSpeed").html(`${weatherInfo.wind_speed}m/s`);
  $("#weatherSunrise").html(`Sunrise: ${sunrise}`);
  $("#weatherSunset").html(`Sunset: ${sunset}`);

  map.removeLayer(airportBtn);
  airportBtn.addTo(map);
  airports = getAirportsByCca2(country.cca2);

  map.removeLayer(citiesBtn);
  citiesBtn.addTo(map);

  map.removeLayer(imagesBtn);
  imagesBtn.addTo(map);

  map.fitBounds(polygon.getBounds());
}

populateDropdown();
$("#dropdown").on("change keyup", selectFromDropdown);
map.locate({ setView: true, maxZoom: 16 });
