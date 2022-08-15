setTimeout(()=>{
    const contenedorLoader = document.querySelector('.contenedor-loader');
        contenedorLoader.style.opacity = 0;
        contenedorLoader.style.visibility = 'hidden';
        contenedorLoader.style.display = 'none';

        Swal.fire({
            imageUrl: './img/pokeball.png',
            imageHeight: 150,
            title: 'Listo! Pokemon atrapados!',
            text: 'Click en \'Mostrar\' para ver sus datos!'
            })
}, 3000)

let offset = 0;
let limit = 151;

let btnAnt = document.getElementById("btnAnterior");
let btnSig = document.getElementById("btnSiguiente");
let container = document.getElementById("container");
let contenedor = document.getElementById("contenedor");
let btnMostrar = document.getElementById('btnMostrarPoke');

let localStorage_Datos;

let dataPokemon = [];
let local_obj_pokemon = {};
let id_pokemon = 0;
async function obtenerPokemones() {
    try {
        const listaPokemones = await fetch(`https://pokeapi.co/api/v2/pokemon/?offset=0&limit=${limit}`);
        const listaPokemonesData = await listaPokemones.json();

        if(listaPokemones.status === 200){
            const infoPokemonUno = await fetch(listaPokemonesData.results[id_pokemon].url);
            const infoPokemonUnoData = await infoPokemonUno.json();
            // console.log(infoPokemonUnoData)

            //SI QUIERES CONSULTAR TODOS LOS POKEMON (PRO)
            const listaRequests = [];
            for (const result of listaPokemonesData.results) {
                listaRequests.push(fetch(result.url).then((res) => res.json()));
            }
            dataPokemon = await Promise.all(listaRequests);
            console.log(dataPokemon)


            pintarPokemon(dataPokemon);
            getIdPokemon()
        }else{
            console.warn('Algo salio mal')
        }
    } catch (ex) {
        console.error(ex);
    }
}

let visorPokemon = document.getElementById('visorPokemonDatos');
function pintarPokemon(dataPokemon) {

    dataPokemon.forEach((poke) => {
        container.innerHTML += `
    <div class="card-contenedor">
        <div class="cardPokemon">
            <div class="cardPokemon--Datos">
                <span id="pokemonID_${poke.id}" class="id_pokemon">ID#${poke.id}</span>
                <h3 class="cardPokemon--Datos_nombre">${poke.name}</h3>
                <img src="${poke.sprites.front_default}" class="img_pokemon">
            </div>
            <button class="btnMostrar" id="btnMostrarPoke"><i class="fa fa-arrow-left" aria-hidden="true"></i> Mostrar</button>
        </div>
    </div>`;
    });
}

function getImgTipos(types) {
    const typeImg = types.map((type) =>`
    
    <img src="img/tipo_${type.type.name}.jpg" alt="" class="img-tipo" width="65">
    `);
    return typeImg.join("");
}

function getIdPokemon(){
    container.addEventListener('click', (e)=>{
        if(e.target.classList.contains('btnMostrar')){
            setPokemon(e.target.parentElement)
        }
    })
}

let imgVisor = document.getElementById('imgVisor');
function setPokemon(pokemonObj){
    pokemonID = pokemonObj.querySelector('.id_pokemon').textContent
    pokemonID = parseInt(pokemonID.slice(3, 10))
    let pokemonSeleccionado = dataPokemon.find(pokemon => pokemon.id === pokemonID);
    // console.log(pokemonSeleccionado);
    setPokemonData = {
        id: pokemonSeleccionado.id,
        nombre: pokemonSeleccionado.name,
        img: {
            frontDefault: pokemonSeleccionado.sprites.front_default,
            frontShiny: pokemonSeleccionado.sprites.front_shiny,
            backDefault: pokemonSeleccionado.sprites.back_default,
            backShiny: pokemonSeleccionado.sprites.back_shiny
        },
        altura: pokemonSeleccionado.height,
        peso: pokemonSeleccionado.weight,
        estadisticas: {
            hp: pokemonSeleccionado.stats[0].base_stat,
            atk: pokemonSeleccionado.stats[1].base_stat,
            def: pokemonSeleccionado.stats[2].base_stat,
            atk_sp: pokemonSeleccionado.stats[3].base_stat,
            def_sp: pokemonSeleccionado.stats[4].base_stat,
            spd: pokemonSeleccionado.stats[5].base_stat,
        }
    }
    
    // let datosLS = localStorage.setItem(`${pokemonSeleccionado.name}`, JSON.stringify(setPokemonData))

    visorPokemon.innerHTML = `
        <h2 class="Nombre-pokemon">${setPokemonData.nombre}</h2>
        <div class="Fisico-pokemon">
            <span>ALTURA: ${setPokemonData.altura / 10}CM</span>
            <span>PESO: ${setPokemonData.peso / 10} KG</span>
        </div>
        <h4>Estadisticas</h4>
        <div class="Stats-pokemon">
            <ul>
                <span>HP</span>
                <li>${setPokemonData.estadisticas.hp}</li>
            </ul>
            <ul>
                <span>ATK</span>
                <li>${setPokemonData.estadisticas.atk}</li>
            </ul>
            <ul>
                <span>DEF</span>
                <li>${setPokemonData.estadisticas.def}</li>
            </ul>
            <ul>
                <span>ATK ESP</span>
                <li>${setPokemonData.estadisticas.atk_sp}</li>
            </ul>
            <ul>
                <span>DEF ESP</span>
                <li>${setPokemonData.estadisticas.def_sp}</li>
            </ul>
            <ul>
                <span>VEL</span>
                <li>${setPokemonData.estadisticas.spd}</li>
            </ul>
        </div>
        <h3>TIPO</h3>
        <div class="ImgTipo">
        ${getImgTipos(pokemonSeleccionado.types)}
        </div>
        `
    imgVisor.innerHTML = `
    <div class="contenedor-img">
        <div class="img">
            <img class="Img-pokemon" src="${setPokemonData.img.frontDefault}">
        </div>
        <div class="img">
            <img class="Img-pokemon" src="${setPokemonData.img.backDefault}">
        </div>
    </div>
    <button class="btnMostrar" id="shiny">Version Shiny 🌟</button>
    `
    let shiny = document.getElementById('shiny');
    let imgPokemon = document.querySelector('.Img-pokemon')
    shiny.addEventListener('click', ()=>{
        if(imgPokemon.src == `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${setPokemonData.id}.png`){
            let sprites = `
            <div class="contenedor-img">
                <div class="img">
                    
                    <img class="Img-pokemon" src="${setPokemonData.img.frontShiny}">
                </div>
                <div class="img">
                    
                    <img class="Img-pokemon" src="${setPokemonData.img.backShiny}">
                </div>
            </div>
            <button class="btnMostrar" id="shiny">Version Normal</button>
            `
            
            imgVisor.innerHTML = sprites
            
        }else{
            setPokemon()
        }
    })
    console.log(datosLS); 

}

function main(){
    obtenerPokemones();
}
main()