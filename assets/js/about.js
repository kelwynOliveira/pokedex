const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
let pokeIndex = urlParams.get('id')

// Card Pokemon Model
class Pokemon {
    name;
    number;
    photo;
    types = [];
    type;
    weight;
    height;
    abilities = [];
    stats;
}

// Poke API to Pokemon
function convertPokeApiDetailToPokemon(pokeDetail) {
    const pokemon = new Pokemon()
    
    pokemon.name = pokeDetail.name
    pokemon.number = pokeDetail.id
    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default
    pokemon.types =  pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    pokemon.type = pokemon.types[0]
    pokemon.weight = (pokeDetail.weight * 0.1).toFixed(2)
    pokemon.height = (pokeDetail.height * 0.1).toFixed(2)
    pokemon.abilities = pokeDetail.abilities.map((typeSlot) => typeSlot.ability.name) 

    const stats = pokeDetail.stats.map((typeSlot) => {
        let statName
        switch (typeSlot.stat.name) {
            case "hp": statName = 'HP'; break;
            case "attack": statName = 'ATT'; break;
            case "defense": statName = 'DEF'; break;
            case "special-attack": statName = 'SATT'; break;
            case "special-defense": statName = 'SDEF'; break;
            case "speed": statName = 'SPD'; break;
        }
        value = {
            'name': statName,
            'base_stat': typeSlot.base_stat
        }
        return value
    })

    pokemon.stats = stats

    return pokemon
}

const pokemonCard = document.getElementById('pokemonCard')


function convertPokemonToHTML(pokemon) {
    return `
    <div class="pokemonCard ${pokemon.type}">
    <header class="cardHeader">
      <div class="headerTitle">
        <h1>${pokemon.name}</h1>
        <span>#${pokemon.number}</span>
      </div>
      <img
        src="${pokemon.photo}"
        alt="${pokemon.name}"
      />
    </header>
    <main class="mainCard">
      <ol class="types">
        ${pokemon.types.map((type) => `<li class="${type}">${type}</li>`).join('')}
      </ol>
      <h2 class="subTitle" style="color: var(--${pokemon.type})">About</h2>

      <div class="about">
        <div class="aboutItem">
          <div class="aboutInfo">
            <img src="" alt="" />
            <span>${pokemon.weight} kg</span>
          </div>
          <span class="small">weight</span>
        </div>
        <div class="aboutItem">
          <div class="aboutInfo">
            <img src="" alt="" />
            <span>${pokemon.height} m</span>
          </div>
          <span class="small">height</span>
        </div>
        <div class="aboutItem">
          <ul class="aboutInfo capitalize">
          ${pokemon.abilities.map((ability) => `<li>${ability}</li>`).join('')}
          </ul>
          <span class="small">moves</span>
        </div>
      </div>

      <div class="description">
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic, esse
          distinctio id nemo nisi harum.
        </p>
      </div>

      <h2 class="subTitle" style="color: var(--${pokemon.type})">Base Stats</h2>
      <table class="stats">
      
      ${pokemon.stats.map((stat) => 
        `
        <tr>
          <td style="color: var(--${pokemon.type})">${stat.name}</td>
          <td>${stat.base_stat}</td>
          <td class="width100">
            <div class="statsTotal" style="background-color: #1111">
              <div
                class="statsBar ${pokemon.type}"
                style="width: calc(${stat.base_stat}% / 2)"
              ></div>
            </div>
          </td>
        </tr>`
        ).join('')
    }
        
      </table>
    </main>
  </div>
    `
}

//Taking the API
function loadPokemonInfos(index) {
    const url = `https://pokeapi.co/api/v2/pokemon/${index}/`

    fetch(url)
        .then((response) => response.json())
        .then((jsonBody) => convertPokeApiDetailToPokemon(jsonBody))
        .then((pokemonsDetails) => {
            newHtml = convertPokemonToHTML(pokemonsDetails)
            pokemonCard.innerHTML = newHtml
        })
}

loadPokemonInfos(pokeIndex)