
"use strict"
//Global pokemon object
let PokemonObject = {
    name: "test",
    height: "", 
    weight: "",
    frontImgSrc: "",
    backImgSrc: "",
    typeList: [],
    namesRelatedToTypesUrls: []
}
/* EVENT LISTENERS */
let pokemonName;

const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("keyup", (eve)=>{
    if (eve.keyCode === 13){
        pokemonName = searchInput.value;
        searchPokemon(pokemonName);
    }
});

const searchBtn = document.getElementById("serch-btn");
searchBtn.addEventListener("click", ()=> {
    pokemonName = searchInput.value;
    searchPokemon(pokemonName)
});


const imgElem = document.getElementById("pokemonImg");
imgElem.addEventListener("mouseover", changeImgToBack);
imgElem.addEventListener("mouseleave", changeImgToFront);

const typeList = document.getElementById("typeList");
typeList.addEventListener("change", listNameByType);

const typeListNames = document.getElementById("typeListNames");
typeListNames.addEventListener("change", ()=> {
    pokemonName = typeListNames.value;
    searchPokemon(pokemonName);
});

/* IMAGE */
//Changs the pokemon img on mouse leave
function changeImgToFront(event){
    const imgElem = document.getElementById("pokemonImg");
    imgElem.setAttribute("src", PokemonObject.frontImgSrc);
} 
//Changs the pokemon img on mouse over
function changeImgToBack(event){
    const imgElem = document.getElementById("pokemonImg");
    imgElem.setAttribute("src", PokemonObject.backImgSrc);
} 

/*---------- DOM RELATED ----------*/
//Build the pokimons div based on the PokemonObject
function updatePokemonDom(){
    const nameElem = document.getElementById("name");
    const heightElem = document.getElementById("height");
    const weightElem = document.getElementById("weight");
    const imgElem = document.getElementById("pokemonImg");

    nameElem.textContent = PokemonObject.name;
    heightElem.textContent = PokemonObject.height;
    weightElem.textContent = PokemonObject.weight;
    imgElem.setAttribute("src", PokemonObject.frontImgSrc);
    createTypesList (PokemonObject.typeList);
    cleanNamesList();
}

/*---------- TYPE LISTS ----------*/
//Get an arry of string types, 
//create list elements and append them to the type list section
function createTypesList (typeList) {
    cleanTypesList();

    //Build option elements by typeList array
    const typeListElem = document.getElementById("typeList");
    for (const type of typeList) {
        const currentTypeElem = document.createElement("option");
        currentTypeElem.textContent = type;
        typeListElem.appendChild(currentTypeElem)
    }
}
//Delete all the elements in the types list
function cleanTypesList() {
    const typeElements = document.querySelectorAll("#typeList>OPTION");
    typeElements.forEach(typeElem => {
        if (typeElem.id !== "placeholderType") typeElem.remove();  
    });
}
//Update the names by the type in the type list section
function listNameByType(event) {
    console.log("yes");
    cleanNamesList();
    const typeListElem = document.getElementById("typeList");
    const type = typeListElem.value;
    console.log(type);
    const listIndex = PokemonObject.typeList.indexOf(type);
    const namesUrl = PokemonObject.namesRelatedToTypesUrls[listIndex];
    getType(namesUrl);   
}

function buildNameList(namesArr) {
    //Build option elements by typeList array
    const typeListNames = document.getElementById("typeListNames");
    for (const name of namesArr) {
        const currentNameElem = document.createElement("option");
        currentNameElem.textContent = name;
        typeListNames.appendChild(currentNameElem);
    }
}

//Delete all the elements in the types list
function cleanNamesList() {
    const typeListNames = document.querySelectorAll("#typeListNames>OPTION");
    typeListNames.forEach(nameElem => {
        if (nameElem.id !== "placeholderName") nameElem.remove(); 
    })
}

/*---------- POKEMON OBJECT ----------*/
//Update pokemon object
function updatePokemonObject(pokemonData) {
    PokemonObject.name = pokemonData.name;
    PokemonObject.height = pokemonData.height;
    PokemonObject.weight = pokemonData.weight;
    PokemonObject.frontImgSrc = pokemonData.sprites.front_default;
    PokemonObject.backImgSrc = pokemonData.sprites.back_default;
    PokemonObject.typeList = [];
    PokemonObject.namesRelatedToTypesUrls = [];

    for (let type of pokemonData.types){
        PokemonObject.typeList.push(type.type.name);
        PokemonObject.namesRelatedToTypesUrls.push(type.type.url);
    }
}

/*---------- NETWORK ----------*/
//Serch pokemon by ID or Name and update the PokemonObject with the data 

let myLoader = new Image(250, 200);
myLoader.src = "https://media4.giphy.com/media/j2xgBIuAgmrpS/giphy.gif?cid=790b76112168eb7a616d286cbc812ea2bd9fbf4592129b30&rid=giphy.gif&ct=g";
const divLoader = document.getElementById("loader");

async function searchPokemon(pokemonName) {
    try {
        divLoader.appendChild(myLoader);        //Add loader
        //Sent GET request
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}/`);
        // const data = response;
        const pokemonAns = response.data;
        
        setTimeout(()=>{
            updatePokemonObject(pokemonAns);    //Update PokemonObject
            updatePokemonDom();                 //Update DOM

            searchInput.value = "";
            
            divLoader.removeChild(myLoader);
        }, 1500);
        
    } catch (error) {
       alert ("Can't your pokemon find, pleade try again");
       searchInput.value = "";
    }
}
//Get url and retuen an array of names thet also have the urls type
async function getType(url) {
    const response = await axios.get(url);
    const data = await response;
    const namesByTypeArr = [];
    for (let pokemon of data.data.pokemon) {
        namesByTypeArr.push(pokemon.pokemon.name);
    }
    buildNameList(namesByTypeArr);
}

