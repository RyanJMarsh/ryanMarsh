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

let polygon;
let country;

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
  const info = JSON.parse($("#dropdown").val());
  country = {
    "name": info.name,
    "cca2": info.cca2,
    "cca3": info.cca3
  };
  //borders
  const latlngs = getCountryBordersFromCca3(country.cca3);
  polygon = L.polygon(latlngs, { color: "red" }).addTo(map);
  map.fitBounds(polygon.getBounds());
  //capital
  

};


populateDropdown();
$("#dropdown").on("change keyup", selectFromDropdown);
map.locate({ setView: true, maxZoom: 16 });
