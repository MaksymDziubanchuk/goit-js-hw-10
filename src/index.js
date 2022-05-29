import { fetchCountries } from './fetchCountries';
import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput() {
  if (refs.input.value.trim()) {
    fetchCountries(refs.input.value.trim())
      .then(countries => processingData(countries))
      .catch(error => {
        Notiflix.Notify.failure('Oops, there is no country with that name');
      });

    return;
  }
  cleanArea();
}

function processingData(countries) {
  if (countries.length >= 10) {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
    return;
  }
  if (countries.length >= 2 && countries.length < 10) {
    const markup = countries
      .map(country => {
        return `<li>
            <p class='name--small'><img src="${country.flags.svg}" alt="" width="30"> 
            <b>${country.name}</b></p>
          </li>`;
      })
      .join('');
    refs.countryList.innerHTML = markup;
    refs.countryInfo.innerHTML = '';
    return;
  }
  const markup = countries
    .map(country => {
      return `<li>
            
            <p class='name'><img src="${country.flags.svg}" alt="" width="30"> <b>${country.name}</b></p>
            
          </li>`;
    })
    .join('');
  refs.countryList.innerHTML = markup;
  const descrMarkup = countries
    .map(country => {
      return `
    <p class='desc'><b>Capital</b>: ${country.capital}</p>
    <p class='desc'><b>Population</b>: ${country.population}</p>
    <p class='desc'><b>Languages</b>: ${country.languages
      .map(obj => {
        return obj.name;
      })
      .join(', ')}</p>
        `;
    })
    .join('');
  refs.countryInfo.innerHTML = descrMarkup;
}

function cleanArea() {
  refs.countryInfo.innerHTML = '';
  refs.countryList.innerHTML = '';
}
