$(window).on("load", function () {
  $("#preloader")
    .delay(1000)
    .fadeOut("slow", function () {
      $(this).remove();
    });
});

let airports = new L.MarkerClusterGroup({
  polygonOptions: {
    fillColor: "#fff",
    color: "#000",
    weight: 2,
    opacity: 1,
    fillOpacity: 0.5,
  },
});
let cities = new L.MarkerClusterGroup({
  polygonOptions: {
    fillColor: "#fff",
    color: "#000",
    weight: 2,
    opacity: 1,
    fillOpacity: 0.5,
  },
});
let capitalMarker;
let polygon;
let country;
let airportsMarks = [];
let citiesMarks = [];
let countryList;

// Buttons

const infoBtn = L.easyButton("fa-info fa-xl", function (btn, map) {
  $("#infoModal").modal("show");
});
const weatherBtn = L.easyButton("fa-cloud fa-xl", function (btn, map) {
  $("#weatherModal").modal("show");
});

const newsBtn = L.easyButton("fa-newspaper fa-xl", function (btn, map) {
  $("#newsModal").modal("show");
});

const borderBtn = L.easyButton("fa-border-style fa-xl", function (btn, map) {
  $("#borderModal").modal("show");
});

const currencyBtn = L.easyButton("fa-coins fa-xl", function (btn, map) {
  $("#currencyModal").modal("show");
});

// Icons
const capitalIcon = L.ExtraMarkers.icon({
  prefix: "fa",
  icon: "fa-landmark",
  markerColor: "green",
  shape: "star",
});

const airportIcon = L.ExtraMarkers.icon({
  prefix: "fa",
  icon: "fa-plane",
  iconColor: "black",
  markerColor: "white",
  shape: "square",
});

const cityIcon = L.ExtraMarkers.icon({
  prefix: "fa",
  icon: "fa-city",
  markerColor: "blue",
  shape: "square",
});

$(document).ready(function () {
  const streets = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
    {
      attribution:
        "Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012",
    }
  );

  const satellite = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    {
      attribution:
        "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
    }
  );
  const basemaps = {
    Streets: streets,
    Satellite: satellite,
  };
  const overlayMaps = {
    Airports: airports,
    Cities: cities,
  };

  const map = L.map("map", {
    layers: [streets],
  }).fitWorld();

  const layerControl = L.control.layers(basemaps, overlayMaps).addTo(map);
  populateDropdown();

  infoBtn.addTo(map);
  weatherBtn.addTo(map);
  newsBtn.addTo(map);
  borderBtn.addTo(map);
  currencyBtn.addTo(map);

  map.on("locationfound", onLocationFound);
  map.on("locationerror", onLocationError);
  map.on("click", onMapClick);
  $("#dropdown").on("change keyup", selectFromDropdown);

  $("#toConvert").on("change", convertCurrency);
  $("#toConvert").on("keyup", convertCurrency);
  $("#currencyModal").on("show.bs.modal", convertCurrency);
  $("#currencyModal").on("hidden.bs.modal", function() {
    $("#toConvert").val(1);
  });

  map.locate({ setView: true, maxZoom: 16 });

  function populateDropdown() {
    countryList = getCountryList();
    countryList = getCapitals(countryList);
    $.each(countryList, function (i, p) {
      $("#dropdown").append(
        $(`<option id=${p.name}></option>`).val(JSON.stringify(p)).html(p.name)
      );
    });
  }

  function onLocationFound(e) {
    const countryName = getCountryNameFromCoords(e.latitude, e.longitude);
    if (countryName.is_country) {
      let cca2;
      let cca3;
      let capital;

      for (let i = 0; i < countryList.length; i++) {
        if (countryList[i].name == countryName.name) {
          cca2 = countryList[i].cca2;
          cca3 = countryList[i].cca3;
          capital = countryList[i].capital;
        }
      }

      country = {
        name: countryName.name,
        cca2: cca2,
        cca3: cca3,
        capital: capital,
      };

      selectCountry();
    } else {
      if (capitalMarker) {
        map.removeLayer(capitalMarker);
      }
      if (polygon) {
        map.removeLayer(polygon);
      }
      capitalMarker = L.marker(e.latlng)
        .addTo(map)
        .bindPopup(`${countryName.name}`)
        .openPopup();
    }
  }

  function onLocationError(e) {
    alert(e.message);
  }

  function onMapClick(e) {
    const countryName = getCountryNameFromCoords(e.latlng.lat, e.latlng.lng);

    let cca2;
    let cca3;
    let capital;

    for (let i = 0; i < countryList.length; i++) {
      if (countryList[i].name == countryName.name) {
        cca2 = countryList[i].cca2;
        cca3 = countryList[i].cca3;
        capital = countryList[i].capital;
      }
    }

    country = {
      name: countryName.name,
      cca2: cca2,
      cca3: cca3,
      capital: capital,
    };
    if (country.cca3) {
      selectCountry();
    } else {
      if (capitalMarker) {
        map.removeLayer(capitalMarker);
      }
      if (polygon) {
        map.removeLayer(polygon);
      }
      capitalMarker = L.marker(e.latlng)
        .addTo(map)
        .bindPopup(`${countryName.name}`)
        .openPopup();
    }
  }

  function selectFromDropdown() {
    if ($("#dropdown").val() == "Select a Country...") {
      if (capitalMarker) {
        map.removeLayer(capitalMarker);
      }
      if (polygon) {
        map.removeLayer(polygon);
      }
      map.locate({ setView: true, maxZoom: 16 });
    } else {
      const info = JSON.parse($("#dropdown").val());

      country = {
        name: info.name,
        cca2: info.cca2,
        cca3: info.cca3,
        capital: info.capital,
      };

      selectCountry();
    }
  }


  function convertCurrency() {
    const num = $("#toConvert").val();
    const rate = $("#currencyExchange").val();
    $("#currencyExchangeResult").val(numeral(num*rate).format("0,0.00"))
  }

  function selectCountry() {
    if (airportsMarks.length) {
      airports.removeLayers(airportsMarks);
      airportsMarks = [];
    }

    if (capitalMarker) {
      map.removeLayer(capitalMarker);
    }
    if (polygon) {
      map.removeLayer(polygon);
    }

    //borders
    const borderLatlngs = getCountryBordersFromCca3(country.cca3);
    polygon = L.polygon(borderLatlngs, { color: "red" }).addTo(map);
    map.fitBounds(polygon.getBounds());

    //capital
    const capName = `${country.capital} ${country.name}`.replace(/ /g, "+");

    const capitalLatlngs = getLatlngsByName(capName);
    if (!country.capital) {
      capitalMarker = L.marker(capitalLatlngs, { icon: capitalIcon });

      map.addLayer(capitalMarker);
      capitalMarker.bindTooltip(`${country.name}`, {
        direction: "top",
        sticky: true,
      });
    } else {
      capitalMarker = L.marker(capitalLatlngs, { icon: capitalIcon });

      map.addLayer(capitalMarker);
      capitalMarker.bindTooltip(
        `${country.capital}<br>Capital of ${country.name}`,
        { direction: "top", sticky: true }
      );
    }

    //info modal

    const countryInfo = getCountryInfoFromCca3(country.cca3);

    const languagesArr = Object.values(countryInfo.languages);
    const languages = languagesArr.join(", ");
    const currency = Object.values(countryInfo.currency);

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

    //weather modal
    const weatherInfo = getWeatherInfo(capName);

    $("#weatherModalTitle").html(`${country.capital}, ${country.name}`);

    $("#dayOneCondition").html(`${weatherInfo.dayOne.condition}`);
    $("#dayOneIcon").attr("src", `${weatherInfo.dayOne.icon}`);
    $("#dayOneMaxTemp").html(`${weatherInfo.dayOne.maxTemp}`);
    $("#dayOneMinTemp").html(`${weatherInfo.dayOne.minTemp}`);

    $("#dayTwoDate").html(
      `${dayjs(weatherInfo.dayTwo.date).format("ddd DD MMM")}`
    );
    $("#dayTwoIcon").attr("src", `${weatherInfo.dayTwo.icon}`);
    $("#dayTwoMaxTemp").html(`${weatherInfo.dayTwo.maxTemp}`);
    $("#dayTwoMinTemp").html(`${weatherInfo.dayTwo.minTemp}`);

    $("#dayThreeDate").html(
      `${dayjs(weatherInfo.dayThree.date).format("ddd DD MMM")}`
    );
    $("#dayThreeIcon").attr("src", `${weatherInfo.dayThree.icon}`);
    $("#dayThreeMaxTemp").html(`${weatherInfo.dayThree.maxTemp}`);
    $("#dayThreeMinTemp").html(`${weatherInfo.dayThree.minTemp}`);

    //airport markers

    const airportsList = getAirportsByCca2(country.cca2);
    airportsList.forEach((airport) => {
      const airportMark = L.marker([airport.latitude, airport.longitude], {
        icon: airportIcon,
      });
      airportMark.bindTooltip(`${airport.name}`, {
        direction: "top",
        sticky: true,
      });
      airportsMarks.push(airportMark);
    });
    airports.addLayers(airportsMarks);

    //city markers

    const citiesList = getCitiesByCca2(country.cca2);
    citiesList.forEach((city) => {
      const cityMark = L.marker([city.latitude, city.longitude], {
        icon: cityIcon,
      });
      cityMark.bindTooltip(`${city.name}`, { direction: "top", sticky: true });
      citiesMarks.push(cityMark);
    });
    cities.addLayers(citiesMarks);

    //news modal

    const countryName = `${country.name}`.replace(/ /g, "+");
    const news = getLatestNews(countryName).articles;

    $("#newsArticles").empty();
    for (let i = 0; i < news.length; i++) {
      if (news[i].urlToImage == null) {
        continue;
      } else {
        $("#newsArticles").append(
          `<table class="table table-borderless">
              <tr>
                <td rowspan="2" width="50%">
                  <img class="img-fluid rounded" src="${news[i].urlToImage}">
                </td>
                <td>
                  <a href="${news[i].url}" class="fw-bold fs-6 text-black" target="_blank">${news[i].title}</a>
                </td>
              </tr>
              <tr>                       
                <td class="align-bottom pb-0">              
                <p class="fw-light fs-6 mb-1">${news[i].source.name}</p>              
                </td>    
              </tr>
            </table>
            <hr>`
        );
      }
    }
    //`<tr><td><img src='${news[i].urlToImage}' height='100'></td><td>${news[i].title}</br></br><a href='${news[i].url}'>Link to Article</a></td></tr>`
    //border neighbours modal

    $("#borderCountries").empty();
    for (let i = 0; i < countryInfo.borders.length; i++) {
      for (let j = 0; j < countryList.length; j++) {
        if (countryList[j].cca3 == countryInfo.borders[i]) {
          $("#borderCountries").append(
            $("<tr class='text-center'></tr>").html(
              `${countryList[j].name}, ${countryList[j].cca3}`
            )
          );
        }
      }
    }

    //currency modal

    $("#currencyExchange").empty();
    $("#currencyExchangeRate").empty();
    const list = getListOfCurrencies();
    let currencies = [];
    const listValues = Object.values(list);
    currency.forEach((item) => {
      for (let i = 0; i < listValues.length; i++) {
        if (listValues[i].toLowerCase().includes(item.name.toLowerCase())) {
          currencies.push(Object.keys(list)[i]);
        }
      }
    });
    if (currencies.length == 0) {
      console.log("No currency information available");
    } else {
      const rates = getCurrencyRates(currencies.join());

      $.each(currencies, function (i, p) {
        $("#currencyExchange").append(
          $("<option></option>").val(rates[p]).html(p)
        );
      });
      const rate = $("#currencyExchange").val();
      $("#currencyExchangeRate").html(rate);
    }
    $("#dropdown").val(JSON.stringify(country));
  }

  // AJAX Requests

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
        cca3,
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
        name,
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
        cca3,
      },
      success: function (data) {
        countryInfo = data.data;
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
      },
    });
    return countryInfo;
  }

  function getWeatherInfo(capital) {
    let weatherInfo;
    $.ajax({
      dataType: "json",
      async: false,
      url: "./data/getWeatherDataFromCoords.php",
      data: {
        capital,
      },
      success: function (data) {
        weatherInfo = data.data;
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
      },
    });
    return weatherInfo;
  }

  function getAirportsByCca2(cca2) {
    let airports;
    $.ajax({
      dataType: "json",
      async: false,
      url: "./data/getAirportsByCca2.php",
      data: {
        cca2,
      },
      success: function (data) {
        airports = data.data;
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
      },
    });
    return airports;
  }

  function getCitiesByCca2(cca2) {
    let cities;
    $.ajax({
      dataType: "json",
      async: false,
      url: "./data/getCitiesByCca2.php",
      data: {
        cca2,
      },
      success: function (data) {
        cities = data.data;
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
      },
    });
    return cities;
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
    });
    return list;
  }

  function getCurrencyRates(currencies) {
    let rates;
    $.ajax({
      dataType: "json",
      async: false,
      url: "./data/getCurrencyRates.php",
      data: {
        currencies,
      },
      success: function (data) {
        rates = data.rates;
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
      },
    });
    return rates;
  }

  function getLatestNews(name) {
    let news;
    $.ajax({
      dataType: "json",
      async: false,
      url: "./data/getNewsByCountry.php",
      data: {
        name,
      },
      success: function (data) {
        news = data;
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
      },
    });
    return news;
  }

  function getCountryNameFromCoords(lat, lng) {
    let info;
    $.ajax({
      dataType: "json",
      async: false,
      url: "./data/getCountryNameFromCoords.php",
      data: {
        lat,
        lng,
      },
      success: function (data) {
        info = data;
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
      },
    });
    return info;
  }
});
