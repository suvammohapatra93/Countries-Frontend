const countriesContainer = document.querySelector(".countries-container");
const filterByRegion = document.querySelector(".filter-by-region");
const searchInput = document.querySelector(".search-container input");
const sortBy = document.querySelector(".sort-by");
const themeChanger = document.querySelector(".theme-changer");
const loadingIndicator = document.querySelector(".loading");

let allCountriesData = [];
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

// Fetching country data
function fetchCountries() {
  loadingIndicator.style.display = "block";
  fetch("https://restcountries.com/v3.1/all")
    .then((res) => res.json())
    .then((data) => {
      allCountriesData = data;
      renderCountries(data);
    })
    .catch((error) => {
      console.error("Fetch error:", error);
      countriesContainer.innerHTML = "<p>Error loading countries.</p>";
    })
    .finally(() => {
      loadingIndicator.style.display = "none";
    });
}

fetchCountries();

// Render countries
function renderCountries(data) {
  countriesContainer.innerHTML = "";
  data.forEach((country) => {
    const countryCard = document.createElement("a");
    countryCard.classList.add("country-card");
    countryCard.href = `country.html?name=${country.name.common}`; // Link to country details
    countryCard.innerHTML = `
      <img src="${country.flags.svg}" alt="${country.name.common} flag" />
      <div class="card-text">
          <h3 class="card-title">${country.name.common}</h3>
          <p><b>Population: </b>${country.population.toLocaleString(
            "en-IN"
          )}</p>
          <p><b>Region: </b>${country.region}</p>
          <p><b>Capital: </b>${country.capital?.[0]}</p>
          <button class="favorite-btn">${
            favorites.includes(country.name.common)
              ? "Remove from Favorites"
              : "Add to Favorites"
          }</button>
      </div>
    `;

    countryCard
      .querySelector(".favorite-btn")
      .addEventListener("click", (event) => {
        event.stopPropagation(); // Prevents triggering the country link
        toggleFavorite(country.name.common);
      });

    countriesContainer.append(countryCard);
  });
}

// Toggle favorite country
function toggleFavorite(countryName) {
  if (favorites.includes(countryName)) {
    favorites = favorites.filter((name) => name !== countryName);
  } else {
    favorites.push(countryName);
  }
  localStorage.setItem("favorites", JSON.stringify(favorites));
  renderCountries(allCountriesData); // Re-render to update favorite buttons
}

// Filter by region
filterByRegion.addEventListener("change", () => {
  const selectedRegion = filterByRegion.value;
  const filteredCountries = allCountriesData.filter(
    (country) => country.region === selectedRegion
  );
  renderCountries(filteredCountries);
});

// Sort countries
sortBy.addEventListener("change", (e) => {
  const sortedCountries = [...allCountriesData];
  if (e.target.value === "population") {
    sortedCountries.sort((a, b) => b.population - a.population);
  } else {
    sortedCountries.sort((a, b) => a.name.common.localeCompare(b.name.common));
  }
  renderCountries(sortedCountries);
});

// Search functionality
searchInput.addEventListener("input", (e) => {
  const filteredCountries = allCountriesData.filter((country) =>
    country.name.common.toLowerCase().includes(e.target.value.toLowerCase())
  );
  renderCountries(filteredCountries);
});

// Theme changer
themeChanger.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// Initial fetch
fetchCountries();
