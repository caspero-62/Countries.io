// initialize Elements;
const nav = document.querySelector('nav');
const inputForm = document.querySelector('.input-form');
const search = document.querySelector('#search');
const cardsContainer = document.querySelector(".cards-container");
const accordion = document.querySelectorAll(".accordion");
const spinner = document.querySelector(".spinner");
const errorMessage = document.querySelector(".error-message");
const errorMessageText = document.querySelector(".error-message div p");
let storedCountriesData;

inputForm.style.setProperty('margin-top', `${nav.offsetHeight + 16}px`, null);
console.log(window.getComputedStyle(inputForm).marginTop);

const getCountries = async () => {
    
    spinner.classList.toggle('none');
    try {

        let response = await fetch('https://restcountries.eu/rest/v2/all');
        let countriesData = await response.json();

        fillCountryData(countriesData);

        storedCountriesData = countriesData;

        setTimeout(() => {
            spinner.classList.toggle('none');
        }, 2000)

    } catch (err) {

        spinner.classList.toggle('none');

        errorMessageText.innerHTML = err;

        errorMessage.classList.toggle('none');

        setTimeout(() => {
            errorMessage.classList.toggle('none')
        }, 3000);

    }
}


// Fill Country data into cards.
const fillCountryData = (countriesData) => {


    // Get necessary data to be displayed 
    countriesData.map(country => {
        const {
            name, 
            flag, 
            capital, 
            languages, 
            population, 
            region, 
            timezones, 
            currencies, 
            nativeName,
            callingCodes
        } = country;

        let languageNames = languages.map(lan => lan.name).join(", ");

        let currencyCodes = currencies.map(curr => curr.code).join(", ");

        // Format population Numbers
        let formattedNumber = new Intl.NumberFormat('en-US');
        
        // create card Element
        let card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${flag}" alt="country-flag" class="card-image">

            <div class="card-content">

                <div class="country-name">
                    <p>${name} | ${nativeName}</p>
                </div>

                <div class="accordion">
                    <p>See Details</p>
                    <i class="fas fa-caret-down"></i>
                    <i class="fas fa-caret-up"></i>
                </div>
                <div class="panel">
                    <table>
                        <tr>
                            <td>Capital</td>
                            <td>${capital}</td>
                        </tr>
                        <tr>
                            <td>Region</td>
                            <td>${region}</td>
                        </tr>
                        <tr>
                            <td>Population</td>
                            <td>${formattedNumber.format(population)}</td>
                        </tr>
                        <tr>
                            <td>Language(s)</td>
                            <td>${languageNames}</td>
                        </tr>
                        <tr>
                            <td>Currency(ies)</td>
                            <td>${currencyCodes}</td>
                        </tr>
                        <tr>
                            <td>Country Code</td>
                            <td>+${callingCodes[0]}</td>
                        </tr>
                        <tr>
                            <td>TimeZones</td>
                            <td>${timezones[0]}</td>
                        </tr>
                    </table>
                </div>
            </div>
        `;

        cardsContainer.appendChild(card);

    })
};

// Search for specific Country
const searchCountry = () => {
    let searchValue = search.value.toLowerCase();

    let searchResult = storedCountriesData.filter((country) => {
        const { name } = country;
        return name.toLowerCase().includes(searchValue);
    });

    cardsContainer.innerHTML = '';

    fillCountryData(searchResult);
};

window.addEventListener('load', getCountries);

// Event Listener for card accordions
cardsContainer.addEventListener('click', (evt) => {
    if(evt.target.className === 'accordion') {
        let panel = evt.target.nextElementSibling;
        const up = evt.target.querySelector('.fa-caret-up');
        const down = evt.target.querySelector('.fa-caret-down');

        if (panel.style.maxHeight) {
            panel.style.maxHeight = null;
            up.style.display = 'none';
            down.style.display= 'block';
            panel.classList.toggle('drop');
        } else {
            panel.style.maxHeight = `${panel.scrollHeight + 5}px`;
            up.style.display = 'block';
            down.style.display= 'none';
            setTimeout(() => {
                panel.classList.toggle('drop');
            }, 500);
        }
    } else {
        null;
    }
});

search.addEventListener('keyup', searchCountry);