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

const otherIcon = L.ExtraMarkers.icon({
  prefix: "fa",
  icon: "fa-times",
  markerColor: "red",
  shape: "square"
})

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
  $("#currencyModal").on("hidden.bs.modal", function () {
    $("#toConvert").val(1);
  });

  map.locate({ setView: true, maxZoom: 16 });

  function populateDropdown() {
    $.ajax({
      dataType: "json",
      url: "./data/getAllNamesCodesFromJSON.php",
      async: false,
      success: function (data) {
        countryList = data.sort((a, b) => a.name.localeCompare(b.name));
        $.ajax({
          dataType: "json",
          url: "./data/getCapitalsData.php",
          async: false,
          success: function (data) {
            if (data.status.name == "ok") {
              countryList.forEach((country) => {
                data.data.data.forEach((countryData) => {
                  if (country.cca3 == countryData.iso3) {
                    country.capital = countryData.capital;
                  }
                });
              });
              $.each(countryList, function (i, p) {
                $("#dropdown").append(
                  $(`<option id=${p.name}></option>`)
                    .val(JSON.stringify(p))
                    .html(p.name)
                );
              });
            } else {
              alert(data.status.name);
            }
          },
          error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
          },
        });
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
      },
    });
  }

  function onLocationFound(e) {
    $.ajax({
      dataType: "json",
      url: "./data/getCountryNameFromCoords.php",
      data: {
        lat: e.latitude,
        lng: e.longitude,
      },
      success: function (data) {
        if (data.status.name == "ok") {
          const countryName = data.data;
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
            capitalMarker = L.marker(e.latlng, { icon: otherIcon })
              .addTo(map)
              .bindPopup(`${countryName.name}`)
              .openPopup();
          }
        } else {
          alert(data.status.name);
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
      },
    });
  }

  function onLocationError(e) {
    country = {
      name: "United Kingdom",
      cca2: "GB",
      cca3: "GBR",
      capital: "London",
    };

    selectCountry();
  }

  function onMapClick(e) {
    $.ajax({
      dataType: "json",
      url: "./data/getCountryNameFromCoords.php",
      data: {
        lat: e.latlng.lat,
        lng: e.latlng.lng,
      },
      success: function (data) {
        if (data.status.name == "ok") {
          const countryName = data.data;
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
            capitalMarker = L.marker(e.latlng, { icon: otherIcon })
              .addTo(map)
              .bindPopup(`${countryName.name}`)
              .openPopup();
          }
        } else {
          alert(data.status.name);
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
      },
    });
  }

  function selectFromDropdown() {
    const info = JSON.parse($("#dropdown").val());

    country = {
      name: info.name,
      cca2: info.cca2,
      cca3: info.cca3,
      capital: info.capital,
    };

    selectCountry();
  }

  function convertCurrency() {
    const num = $("#toConvert").val();
    const rate = $("#currencyExchange").val();
    $("#currencyExchangeResult").val(numeral(num * rate).format("0,0.00"));
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
    $.ajax({
      dataType: "json",
      url: "./data/getBorderByCodeFromJSON.php",
      data: {
        cca3: country.cca3,
      },
      success: function (data) {
        if (data.type == "Polygon") {
          const latlngs = L.GeoJSON.coordsToLatLngs(data.coordinates, 1, false);
          polygon = L.polygon(latlngs, { color: "red" }).addTo(map);
          map.fitBounds(polygon.getBounds());
        } else {
          const latlngs = L.GeoJSON.coordsToLatLngs(data.coordinates, 2, false);
          polygon = L.polygon(latlngs, { color: "red" }).addTo(map);
          map.fitBounds(polygon.getBounds());
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
      },
    });

    //capital
    const capName = `${country.capital} ${country.name}`.replace(/ /g, "+");
    $.ajax({
      dataType: "json",
      url: "./data/getLatlngByNameData.php",
      data: {
        name: capName,
      },
      success: function (data) {
        if (data.status.name == "ok") {
          const capitalLatlngs = data.data;
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
        } else {
          alert(data.status.name);
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
      },
    });
    //info modal
    $.ajax({
      dataType: "json",
      url: "./data/getCountryInfoFromCodeData.php",
      data: {
        cca3: country.cca3,
      },
      success: function (data) {
        if (data.status.name == "ok") {
          const countryInfo = data.data;
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

          //borders modal
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
          $.ajax({
            dataType: "json",
            url: "./data/getListOfCurrencies.php",
            success: function (data) {
              if (data.status.name == "ok") {
                const list = data.data;
                let currencies = [];
                const listValues = Object.values(list);
                currency.forEach((item) => {
                  for (let i = 0; i < listValues.length; i++) {
                    if (
                      listValues[i]
                        .toLowerCase()
                        .includes(item.name.toLowerCase())
                    ) {
                      currencies.push(Object.keys(list)[i]);
                    }
                  }
                });
                if (currencies.length == 0) {
                  console.log("No currency information available");
                } else {
                  $.ajax({
                    dataType: "json",
                    url: "./data/getCurrencyRates.php",
                    data: {
                      currencies: currencies.join(),
                    },
                    success: function (data) {
                      if (data.status.name == "ok") {
                        const rates = data.data.rates;
                        $.each(currencies, function (i, p) {
                          $("#currencyExchange").append(
                            $("<option></option>").val(rates[p]).html(p)
                          );
                        });
                        const rate = $("#currencyExchange").val();
                        $("#currencyExchangeRate").html(rate);
                      } else {
                        alert(data.status.name);
                      }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                      console.log(textStatus, errorThrown);
                    },
                  });
                }
                $("#dropdown").val(JSON.stringify(country));
              } else {
                alert(data.status.name);
              }
            },
            error: function (jqXHR, textStatus, errorThrown) {
              console.log(textStatus, errorThrown);
            },
          });
        } else {
          alert(data.status.name);
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
      },
    });
    //weather modal
    $.ajax({
      dataType: "json",
      url: "./data/getWeatherDataFromCoords.php",
      data: {
        capital: capName,
      },
      success: function (data) {
        if (data.status.name == "ok") {
          const weatherInfo = data.data;
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
        } else {
          alert(data.status.name);
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
      },
    });

    //airport markers
    $.ajax({
      dataType: "json",
      url: "./data/getAirportsByCca2.php",
      data: {
        cca2: country.cca2,
      },
      success: function (data) {
        if (data.status.name == "ok") {
          const airportsList = data.data;
          airportsList.forEach((airport) => {
            const airportMark = L.marker(
              [airport.latitude, airport.longitude],
              {
                icon: airportIcon,
              }
            );
            airportMark.bindTooltip(`${airport.name}`, {
              direction: "top",
              sticky: true,
            });
            airportsMarks.push(airportMark);
          });
          airports.addLayers(airportsMarks);
        } else {
          alert(data.status.name);
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
      },
    });

    //city markers
    $.ajax({
      dataType: "json",
      url: "./data/getCitiesByCca2.php",
      data: {
        cca2: country.cca2,
      },
      success: function (data) {
        if (data.status.name == "ok") {
          const citiesList = data.data;
          citiesList.forEach((city) => {
            const cityMark = L.marker([city.latitude, city.longitude], {
              icon: cityIcon,
            });
            cityMark.bindTooltip(`${city.name}`, {
              direction: "top",
              sticky: true,
            });
            citiesMarks.push(cityMark);
          });
          cities.addLayers(citiesMarks);
        } else {
          alert(data.status.name);
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
      },
    });

    //news modal
    const countryName = `${country.name}`.replace(/ /g, "+");
    $.ajax({
      dataType: "json",
      url: "./data/getNewsByCountry.php",
      data: {
        name: countryName,
      },
      success: function (data) {
        if (data.status.name == "ok") {
          const news = data.data.articles;
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
        } else {
          alert(data.status.name);
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
      },
    });
  }
});
