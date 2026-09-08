const API_BASE_URL = "https://pokeapi.co/api/v2/pokemon";

const form = document.getElementById("search-form");
const input = document.getElementById("search-input");
const button = document.getElementById("search-button");
const feedback = document.getElementById("feedback");
const cardContainer = document.getElementById("card-container");
const sprite = document.getElementById("pokemon-sprite");
const nameEl = document.getElementById("pokemon-name");
const idEl = document.getElementById("pokemon-id");
const typesEl = document.getElementById("pokemon-types");
const statsEl = document.getElementById("pokemon-stats");
const heightEl = document.getElementById("pokemon-height");
const weightEl = document.getElementById("pokemon-weight");
const experienceEl = document.getElementById("pokemon-experience");
const abilitiesEl = document.getElementById("pokemon-abilities-list");

form.addEventListener("submit", handleSearch);

async function handleSearch(event) {
  event.preventDefault();

  const query = input.value.trim().toLowerCase();
  if (!query) {
    showFeedback("Digite um nome ou número de Pokémon.", "error");
    return;
  }

  await searchPokemon(query);
}

async function searchPokemon(query) {
  setLoading(true);
  cardContainer.hidden = true;

  try {
    const response = await fetch(`${API_BASE_URL}/${query}`);

    if (response.status === 404) {
      throw new Error(`Pokémon "${query}" não encontrado. Verifique o nome ou número.`);
    }

    if (!response.ok) {
      throw new Error(`Erro ao buscar dados (status ${response.status}).`);
    }

    const data = await response.json();
    renderPokemon(data);
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

function renderPokemon(pokemon) {
  sprite.src = pokemon.sprites.front_default ?? "";
  sprite.alt = pokemon.name;

  nameEl.textContent = pokemon.name;
  idEl.textContent = `#${String(pokemon.id).padStart(3, "0")}`;

  typesEl.innerHTML = "";
  pokemon.types.forEach((typeInfo) => {
    const li = document.createElement("li");
    li.textContent = typeInfo.type.name;
    typesEl.appendChild(li);
  });

  heightEl.textContent = `${(pokemon.height / 10).toFixed(1)} m`;
  weightEl.textContent = `${(pokemon.weight / 10).toFixed(1)} kg`;
  experienceEl.textContent = pokemon.base_experience ?? "N/A";
  abilitiesEl.textContent = pokemon.abilities
    .map((abilityInfo) => abilityInfo.ability.name.replace("-", " "))
    .join(", ");

  statsEl.innerHTML = "";
  pokemon.stats.forEach((statInfo) => {
    const dt = document.createElement("dt");
    dt.textContent = statInfo.stat.name.replace("-", " ");

    const dd = document.createElement("dd");
    dd.textContent = statInfo.base_stat;

    statsEl.appendChild(dt);
    statsEl.appendChild(dd);
  });

  cardContainer.hidden = false;
}

function showFeedback(message, type = "") {
  feedback.textContent = message;
  feedback.className = type;
}

function setLoading(isLoading) {
  button.disabled = isLoading;
  button.textContent = isLoading ? "Buscando..." : "Buscar";
  if (isLoading) {
    showFeedback("Buscando Pokémon...", "loading");
  }
}
