// initialize Elements;
const cardsContainer = document.querySelector(".cards-container");
const accordion = document.querySelectorAll(".accordion");
const spinner = document.querySelector(".spinner");
const errorMessage = document.querySelector(".error-message");
const errorMessageText = document.querySelector(".error-message div p");

const getCountries = async () => {
    spinner.classList.toggle('none');
    try {

        let response = await fetch('https://restcountries.eu/rest/v2/all');
        let countriesData = await response.json();

        fillCountryData(countriesData);

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
}

window.addEventListener('load', getCountries);

// Add event listener for accordion to toggle details
accordion.forEach(acc => {
    acc.addEventListener('click', () => {
        acc.classList.toggle('active');

        let panel = acc.nextElementSibling;
        if (panel.style.display === "block") {
            panel.style.display = "none";
        } else {
            panel.style.display = "block";
        }
    });

})