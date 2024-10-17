function getCountryList() {
  let countries;
  $.ajax({
    dataType: "json",
    async: false,
    url: "./data/getAllNamesCodesFromJSON.php",

    success: function (data) {
      countries = data.sort((a, b) => a.name.localeCompare(b.name));
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus, errorThrown);
    },
  });
  return countries;
}

function getCountryBordersFromCca3(cca3) {
  let latlngs;
  $.ajax({
    dataType: "json",
    async: false,
    url: "./data/getBorderByCodeFromJSON.php",
    data: {
      cca3
    },
    success: function (data) {
      if (data.type == "Polygon") {
        latlngs = L.GeoJSON.coordsToLatLngs(data.coordinates, 1, false);
      } else {
        latlngs = L.GeoJSON.coordsToLatLngs(data.coordinates, 2, false);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus, errorThrown);
    },
  });
  return latlngs;
}

function getCapitals(countryList) {
  countryList;
  $.ajax({
    dataType: "json",
    async: false,
    url: "./data/getCapitalsData.php",
    success: function ({ data }) {
      countryList.forEach((country) => {
        data.forEach((countryData) => {
          if (country.cca3 == countryData.iso3) {
            country.capital = countryData.capital;
          }
        });
      });
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus, errorThrown);
    },
  });
  return countryList;
}

function getLatlngsByName(name) {
  let latlngs;
  $.ajax({
    dataType: "json",
    async: false,
    url: "./data/getLatlngByNameData.php",
    data: {
      name
    },
    success: function (data) {
      latlngs = data;
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus, errorThrown);
    },
  });

  return latlngs;
}

function getCountryInfoFromCca3(cca3) {
  let countryInfo;
  $.ajax({
    dataType: "json",
    async: false,
    url: "./data/getCountryInfoFromCodeData.php",
    data: {
      cca3
    },
    success: function (data) {
      countryInfo = data.data;
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus, errorThrown);
    },
  })
  return countryInfo;
}

function getWeatherInfo(lat, lng) {
  let weatherInfo;
  $.ajax({
    dataType: "json",
    async: false,
    url: "./data/getWeatherDataFromCoords.php",
    data: {
      lat,
      lng
    },
    success: function (data) {
      weatherInfo = data.data;
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus, errorThrown);
    },
  })
  return weatherInfo;
}

function getAirportsByCca2(cca2) {
  let airports;
  $.ajax({
    dataType: "json",
    async: false,
    url: "./data/getAirportsByCca2.php",
    data: {
      cca2
    },
    success: function (data) {
      airports = data.data;
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus, errorThrown);
    },
  })
  return airports;
}

function getListOfCurrencies() {
  let list;
  $.ajax({
    dataType: "json",
    async: false,
    url: "./data/getListOfCurrencies.php",
    success: function (data) {
      list = data;
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus, errorThrown);
    },
  })
  return list;
}

function getCurrencyRates(currencies) {
  let rates;
  $.ajax({
    dataType: "json",
    async: false,
    url: "./data/getCurrencyRates.php",
    data: {
      currencies
    },
    success: function (data) {
      rates = data.rates;
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus, errorThrown);
    },
  })
  return rates;
}

function getLatestNews(name) {
  let news;
  $.ajax({
    dataType: "json",
    async: false,
    url: "./data/getNewsByCountry.php",
    data: {
      name
    },
    success: function (data) {
      news = data;
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus, errorThrown);
    },
  })
  return news;
};

function getCountryNameFromCoords(lat, lng) {
  let info;
  $.ajax({
    dataType: "json",
    async: false,
    url: "./data/getCountryNameFromCoords.php",
    data: {
      lat,
      lng
    },
    success: function (data) {
      info = data;
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus, errorThrown);
    },
  })
  return info;
}