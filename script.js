// 'use strict';

const btn = document.querySelector('.btn-country');
const countryContainer = document.querySelector('.country');
const errorEl = document.querySelector('.error');
// ///////////////////////////////////////

const renderCountry = function (data) {
  errorEl.style.display = 'none';
  countryContainer.style.display = 'block';
  const html = `
  <img class="country__img" src="${data[0].flag}" />
  <div class="country__data">
    <h3 class="country__name">${data[0].name}</h3>
    <h4 class="country__region">${data[0].region}</h4>
    <p class="country__row"><span>${(+data[0].population / 1000000).toFixed(
      0
    )}</span> MILLION PEOPLE</p>
    <p class="country__row"><span>${data[0].languages[0].name}</span>LANG</p>
    <p class="country__row"><span>${data[0].currencies[0].name}</span>CUR</p>
  </div>
`;

  countryContainer.innerHTML = html;
};

const renderError = function (err) {
  errorEl.style.display = 'block';
  countryContainer.style.display = 'none';
  errorEl.innerHTML = `<h3>${err.message}</h3>`;
};

const getLocationCoords = function () {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(
      position => {
        resolve(position.coords);
      },
      err => {
        reject(err);
      }
    );
  });
};

const whereAmI = function () {
  getLocationCoords()
    .then(coords => {
      const { latitude, longitude } = coords;
      return fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
      );
    })
    .then(response => response.json())
    .then(data => {
      return data.countryName;
    })
    .then(country => {
      console.log(`your from ${country}`);
      return fetch(
        `https://restcountries.eu/rest/v2/name/${country}?fullText=true`
      );
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Country not found!');
      }
      console.log(response);
      return response.json();
    })
    .then(data => {
      renderCountry(data);
    })
    .catch(err => renderError(err));
};

btn.addEventListener('click', whereAmI);
