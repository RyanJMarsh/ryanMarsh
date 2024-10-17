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

let marker = [];
let capitalMarker;
let polygon;
let country;
let airports;
let countryList;
let airportMarkersShown = false;

function populateDropdown() {
  countryList = getCountryList();
  countryList = getCapitals(countryList);
  $.each(countryList, function (i, p) {
    $("#dropdown").append(
      $("<option></option>").val(JSON.stringify(p)).html(p.name)
    );
  });
}

function onLocationFound(e) {
  const countryName = getCountryNameFromCoords(e.latitude, e.longitude);
  let cca2;
  let cca3;
  let capital;
  for (let i = 0; i < countryList.length; i++) {
    if (countryList[i].name == countryName) {
      cca2 = countryList[i].cca2;
      cca3 = countryList[i].cca3;
      capital = countryList[i].capital;
    }
  }

  country = {
    name: countryName,
    cca2: cca2,
    cca3: cca3,
    capital: capital,
  };

  selectCountry();
}

function onLocationError(e) {
  alert(e.message);
}

function selectFromDropdown() {
  if ($("#dropdown").val() == "Select a Country...") {
    if (marker.length) {
      marker.forEach((mark) => {
        map.removeLayer(mark);
      });
      marker = [];
    }
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

$(document).ready(function () {
  populateDropdown();
  $("#loading").hide();
  map.on("locationfound", onLocationFound);
  map.on("locationerror", onLocationError);
  $("#dropdown").on("change keyup", selectFromDropdown);
  map.locate({ setView: true, maxZoom: 16 });
});
