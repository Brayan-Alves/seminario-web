const API_BASE_URL = "https://restcountries.com/v3.1/name";

const form = document.getElementById("search-form");
const input = document.getElementById("search-input");
const button = document.getElementById("search-button");
const feedback = document.getElementById("feedback");
const resultsContainer = document.getElementById("results-container");

form.addEventListener("submit", handleSearch);

async function handleSearch(event) {
  event.preventDefault();

  const query = input.value.trim();
  if (!query) {
    showFeedback("Digite o nome de um país.", "error");
    return;
  }

  await searchCountries(query);
}

async function searchCountries(query) {
  setLoading(true);
  resultsContainer.hidden = true;

  try {
    const response = await fetch(`${API_BASE_URL}/${encodeURIComponent(query)}`);

    if (response.status === 404) {
      throw new Error(`Nenhum país encontrado para "${query}". Verifique o nome digitado.`);
    }

    if (!response.ok) {
      throw new Error(`Erro ao buscar dados (status ${response.status}).`);
    }

    const countries = await response.json();
    renderCountries(countries);
    showFeedback("");
  } catch (error) {
    if (error instanceof TypeError) {
      showFeedback("Falha de conexão. Verifique sua internet e tente novamente.", "error");
    } else {
      showFeedback(error.message, "error");
    }
  } finally {
    setLoading(false);
  }
}

function renderCountries(countries) {
  resultsContainer.innerHTML = "";

  countries.forEach((country) => {
    const card = document.createElement("article");
    card.className = "country-card";

    const flag = document.createElement("img");
    flag.className = "country-flag";
    flag.src = country.flags?.svg ?? country.flags?.png ?? "";
    flag.alt = country.flags?.alt ?? `Bandeira de ${country.name.common}`;

    const info = document.createElement("div");
    info.className = "country-info";

    const name = document.createElement("h2");
    name.textContent = country.name.common;

    const officialName = document.createElement("p");
    officialName.className = "country-official";
    officialName.textContent = country.name.official;

    const details = document.createElement("dl");
    details.className = "country-details";
    appendDetail(details, "Capital", country.capital?.join(", ") ?? "N/A");
    appendDetail(details, "Região", country.region);
    appendDetail(details, "Sub-região", country.subregion ?? "N/A");
    appendDetail(details, "População", country.population.toLocaleString("pt-BR"));
    appendDetail(details, "Idiomas", country.languages ? Object.values(country.languages).join(", ") : "N/A");

    info.append(name, officialName, details);
    card.append(flag, info);
    resultsContainer.appendChild(card);
  });

  resultsContainer.hidden = false;
}

function appendDetail(dl, label, value) {
  const dt = document.createElement("dt");
  dt.textContent = label;

  const dd = document.createElement("dd");
  dd.textContent = value;

  dl.append(dt, dd);
}

function showFeedback(message, type = "") {
  feedback.textContent = message;
  feedback.className = type;
}

function setLoading(isLoading) {
  button.disabled = isLoading;
  button.textContent = isLoading ? "Buscando..." : "Buscar";
  if (isLoading) {
    showFeedback("Buscando países...", "loading");
  }
}
