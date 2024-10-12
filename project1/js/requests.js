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
      cca3: cca3,
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
          if (country.name == countryData.name) {
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

function getLatlngsByName() {
  
}