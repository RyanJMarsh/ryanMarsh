function selectCountry() {
  
  if (marker.length) {
    marker.forEach((mark) => {
      map.removeLayer(mark);
    });
    marker = [];
  }
  if (capitalMarker) {
    map.removeLayer(capitalMarker)
  }
  if (polygon) {
    map.removeLayer(polygon);
  }

  //borders
  const borderLatlngs = getCountryBordersFromCca3(country.cca3);
  polygon = L.polygon(borderLatlngs, { color: "red" }).addTo(map);

  //capital
  const capName = `${country.capital} ${country.name}`.replace(/ /g, "+");

  const capitalLatlngs = getLatlngsByName(capName);
  if (!country.capital) {
    capitalMarker = L.marker(capitalLatlngs);

    map.addLayer(capitalMarker);
    capitalMarker.bindPopup(`${country.name}`).openPopup();
  } else {
    capitalMarker = L.marker(capitalLatlngs);

    map.addLayer(capitalMarker);
    capitalMarker
      .bindPopup(`${country.capital}<br>Capital of ${country.name}`)
      .openPopup();
  }

  //info modal
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

  //weather modal
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

  //airport modal
  map.removeLayer(airportBtn);
  airportBtn.addTo(map);
  airports = getAirportsByCca2(country.cca2);

  //news modal
  map.removeLayer(newsBtn);
  newsBtn.addTo(map);
  const countryName = `${country.name}`.replace(/ /g, "+");
  const news = getLatestNews(countryName).articles;

  $("#newsArticles").empty();
  for (let i = 0; i < news.length; i++) {
    if (news[i].urlToImage == null) {
      continue;
    } else {
      $("#newsArticles").append(
        `<tr><td><img src='${news[i].urlToImage}' height='100'></td><td>${news[i].title}</br></br><a href='${news[i].url}'>Link to Article</a></td></tr>`
      );
    }
  }

  //border neighbours modal
  map.removeLayer(borderBtn);
  borderBtn.addTo(map);
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
  map.removeLayer(currencyBtn);
  currencyBtn.addTo(map);
  $("#currencyExchange").empty();
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
    $("#currencyExchange").append(
      `<p>Apologies, Currency Exchange Rate Information is unavailable for this particular currency</p>`
    );
  } else {
    const rates = getCurrencyRates(currencies.join());

    const currencyKeys = Object.keys(rates);

    currencyKeys.forEach((key) => {
      $("#currencyExchange").append(
        `<tr><td class='text-center'>${key}</td><td class='text-center'>${rates[key]}</td></tr>`
      );
    });
  }
  
  map.fitBounds(polygon.getBounds());

}
