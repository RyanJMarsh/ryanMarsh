const infoBtn = L.easyButton("fa-info fa-xl", function (btn, map) {
  $("#infoModal").modal("show");
  if (marker.length) {
    marker.forEach((mark) => {
      map.removeLayer(mark);
    });
    marker = [];
  }
});
const weatherBtn = L.easyButton("fa-cloud fa-xl", function (btn, map) {
  $("#weatherModal").modal("show");
  if (marker.length) {
    marker.forEach((mark) => {
      map.removeLayer(mark);
    });
    marker = [];
  }
});

const airportBtn = L.easyButton(
  "fa-plane-departure fa-xl",
  function (btn, map) {
    if (airportMarkersShown) {
      if (marker.length) {
        marker.forEach((mark) => {
          map.removeLayer(mark);
        });
        marker = [];
      }
      airportMarkersShown = false;
    } else {
      airports.forEach((airport) => {
        const airportMark = L.marker([airport.latitude, airport.longitude]);
        marker.push(airportMark);
        map.addLayer(airportMark);
        airportMark.bindPopup(`${airport.name}`);
      });
      airportMarkersShown = true;
    }
  }
);

const newsBtn = L.easyButton("fa-newspaper fa-xl", function (btn, map) {
  $("#newsModal").modal("show");
  if (marker.length) {
    marker.forEach((mark) => {
      map.removeLayer(mark);
    });
    marker = [];
  }
});

const borderBtn = L.easyButton("fa-road-barrier fa-xl", function (btn, map) {
  $("#borderModal").modal("show");
  if (marker.length) {
    marker.forEach((mark) => {
      map.removeLayer(mark);
    });
    marker = [];
  }
});

const currencyBtn = L.easyButton("fa-coins fa-xl", function (btn, map) {
  $("#currencyModal").modal("show");
  if (marker.length) {
    marker.forEach((mark) => {
      map.removeLayer(mark);
    });
    marker = [];
  }
});
