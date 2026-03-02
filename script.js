async function searchCountry(countryName) {
    const countryInfo = document.getElementById('country-info');
    const bordersContainer = document.getElementById('bordering-countries');
    const errorContainer = document.getElementById('error-message');
    const spinner = document.getElementById('loading-spinner');

    try {
        
        countryInfo.innerHTML = "";
        bordersContainer.innerHTML = "";
        errorContainer.innerHTML = "";

        
        spinner.style.display = "block";

        
        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
        if (!response.ok) {
            throw new Error("Country not found");
        }

        const data = await response.json();
        const country = data[0];

        
        countryInfo.innerHTML = `
            <div class="country-card">
                <h2>${country.name.common}</h2>
                <p><strong>Capital:</strong> ${country.capital?.[0] || "N/A"}</p>
                <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
                <p><strong>Region:</strong> ${country.region}</p>
                <img src="${country.flags.svg}" 
                     alt="${country.name.common} flag" 
                     width="150">
            </div>
        `;

        
        if (country.borders) {
            const borderCodes = country.borders.join(",");
            const responseb = await fetch(`https://restcountries.com/v3.1/alpha?codes=${borderCodes}`);

            if (!responseb.ok) {
                throw new Error("Error fetching bordering countries");
            }

            const datab = await responseb.json();

            bordersContainer.innerHTML = `
                <h3>Bordering Countries</h3>
                <div class="border-grid">
                    ${datab.map(border => `
                        <div>
                            <img src="${border.flags.svg}" width="50"><br>
                            ${border.name.common}
                        </div>
                    `).join("")}
                </div>
            `;
        } else {
            bordersContainer.innerHTML = "<p>No bordering countries</p>";
        }

    } catch (error) {
        errorContainer.innerHTML = `
            <div class="error">
                ${error.message}
            </div>
        `;
    } finally {
        
        spinner.style.display = "none";
    }
}



document.getElementById('search-btn').addEventListener('click', () => {
    const country = document.getElementById('country-input').value.trim();
    if (country) {
        searchCountry(country);
    }
});


document.getElementById('country-input').addEventListener('keypress', (e) => {
    if (e.key === "Enter") {
        const country = e.target.value.trim();
        if (country) {
            searchCountry(country);
        }
    }
});