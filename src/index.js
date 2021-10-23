
"use strict"
//Global pokemon object
let PokemonObject = {
    name: "test",
    height: "", 
    weight: "",
    front_pic: "",
    back_pic: "",
    types: [],
    abilities: [],
    namesRelatedToTypesUrls: []
}
/* EVENT LISTENERS */
let userName;
let pokemonName;
let pokemonID;
const abilitysElem = document.getElementById("abilitiesList");
//**** event - enter ****//
const searchUserNameInput = document.getElementById("searchUserName");
searchUserNameInput.addEventListener("keyup", (eve)=>{
    if (eve.keyCode === 13){
        userName = searchUserNameInput.value;
    }
});
const searchByNameInput = document.getElementById("searchByName");
searchByNameInput.addEventListener("keyup", (eve)=>{
    if (eve.keyCode === 13){
        pokemonName = searchByNameInput.value;
        searchByName(pokemonName, userName);
    }
});
const searchInputByNumber = document.getElementById("searchByNumber");
searchInputByNumber.addEventListener("keyup", (eve)=>{
    if (eve.keyCode === 13){
        pokemonID = searchInputByNumber.value;
        searchPokemonByID(pokemonID, userName);
    }
});

//**** event - click ****//

const searchByNameBtn = document.getElementById("searchByName-btn");
searchByNameBtn.addEventListener("click", ()=> {
    pokemonName = searchByNameInput.value;
    searchByName(pokemonName, userName)
});

const searchByNumberBtn = document.getElementById("searchByNumber-btn");
searchByNumberBtn.addEventListener("click", ()=> {
    pokemonID = searchInputByNumber.value;
    searchPokemonByID(pokemonID);
});

// collection event 
const collectionEl = document.getElementById("collection-continer");
const collectionBtnEl = document.getElementById("collection-btn");
collectionBtnEl.addEventListener('click', ()=> {
    userName = searchUserNameInput.value;
    searchCollcetion(userName);
});

// catch
const buttonBtn = document.getElementById("catch-bth");
buttonBtn.addEventListener('click', ()=> {
    userName = searchUserNameInput.value;
    catchPokemon(pokemonID ,userName);
});
// release 
const releaseBtn = document.getElementById("release-bth");
releaseBtn.addEventListener('click', ()=> {
    userName = searchUserNameInput.value;
    releasePokemon(pokemonID ,userName);
});



const imgElem = document.getElementById("pokemonImg");
imgElem.addEventListener("mouseover", changeImgToBack);
imgElem.addEventListener("mouseleave", changeImgToFront);

const typeList = document.getElementById("typeList");


/* IMAGE */
//Changs the pokemon img on mouse leave
function changeImgToFront(event){
    const imgElem = document.getElementById("pokemonImg");
    imgElem.setAttribute("src", PokemonObject.front_pic);
} 
//Changs the pokemon img on mouse over
function changeImgToBack(event){
    const imgElem = document.getElementById("pokemonImg");
    imgElem.setAttribute("src", PokemonObject.back_pic);
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
    imgElem.setAttribute("src", PokemonObject.front_pic);
    imgElem.setAttribute("width",200)
    imgElem.setAttribute("height",200)
    createTypesList (PokemonObject.types);
    createAbilitiesList(PokemonObject.abilities)
}

/*---------- TYPE LISTS ----------*/
//Get an arry of string types, 
//create list elements and append them to the type list section
function createTypesList (typeList) {
    cleanTypesList();

    //Build option elements by typeList array
    const typeListElem = document.getElementById("typeList");
    for (const type of typeList) {
        const currentTypeElem = document.createElement("ol");
        currentTypeElem.textContent = type;
        typeListElem.appendChild(currentTypeElem)
    }
}

//Delete all the elements in the types list
function cleanTypesList() {
    const typeElements = document.querySelectorAll("#typeList>ol");
    typeElements.forEach(typeElem => {
        if (typeElem.id !== "placeholderType") typeElem.remove();  
    });
}

//Get an arry of string abilities, 
///create list elements and append them to the ability list section
function createAbilitiesList(abilityList) {
    cleanAbilitiesList();
    //Build ability elements by abilityList array
    for (const ability of abilityList) {
        const currentAbilityElem = document.createElement("ol");
        currentAbilityElem.textContent = ability;
        currentAbilityElem.classList.add("ability"); 
        abilitysElem.appendChild(currentAbilityElem); //Add to DOM
    }
}
//Delete all the elements in the types list
function cleanAbilitiesList() {
    const abilityElements = document.querySelectorAll("#abilitiesList>ol");
    abilityElements.forEach(abilityElem => abilityElem.remove());
}

/*---------- POKEMON OBJECT ----------*/
//Update pokemon object
function updatePokemonObject(pokemonData) {
    PokemonObject.name = pokemonData.name;
    PokemonObject.height = pokemonData.height;
    PokemonObject.weight = pokemonData.weight;
    PokemonObject.front_pic = pokemonData.front_pic;
    PokemonObject.back_pic = pokemonData.back_pic;
    PokemonObject.types = [];
    PokemonObject.namesRelatedToTypesUrls = [];
    PokemonObject.abilities=[];

    for (let type of pokemonData.types){
        PokemonObject.types.push(type);
    }
    for (let ability of pokemonData.abilities){
        PokemonObject.abilities.push(ability);
    }
}

/*---------- NETWORK ----------*/
//Serch pokemon by ID or Name and update the PokemonObject with the data 

let myLoader = new Image(175, 125);
myLoader.src = "https://media4.giphy.com/media/j2xgBIuAgmrpS/giphy.gif?cid=790b76112168eb7a616d286cbc812ea2bd9fbf4592129b30&rid=giphy.gif&ct=g";
const divLoader = document.getElementById("loader");


// function fetch ///*** pokemon by ID ***///
async function searchPokemonByID(pokemonID, userName) {
    try {
        divLoader.appendChild(myLoader);        //Add loader

        //Sent GET request
        const response = await fetch (`http://localhost:8080/pokemon/get/${pokemonID}`,{
            method:"GET",
            headers: {
                username: userName
            }
        })
        const pokemonAns = await response.json();
        setTimeout(()=>{
            updatePokemonObject(pokemonAns);    //Update PokemonObject
            updatePokemonDom();                 //Update DOM

            divLoader.removeChild(myLoader);
        }, 600);
        
    } catch (error) {
        divLoader.removeChild(myLoader);
        alert ("Your Pokemon not found ,Please try again");
    }
}

// search by name 
async function searchByName(pokemonName ,userName) {
    try {
        divLoader.appendChild(myLoader);        //Add loader
        //Sent GET request http://localhost:8080/pokemon/
        const response = await axios.get(`http://localhost:8080/pokemon/get/${pokemonName}`,{
            headers: {
                    username: userName
                }
        });
        const pokemonAns = await response.data;
        
        setTimeout(()=>{
            updatePokemonObject(pokemonAns);    //Update PokemonObject
            updatePokemonDom();                 //Update DOM

            divLoader.removeChild(myLoader);
        }, 600);

    } catch (error) {
        divLoader.removeChild(myLoader);
        alert ("Your Pokemon not found ,Please try again");
    }
}

// catch pokemon
async function catchPokemon(pokemonID, userName) {
    try {
        divLoader.appendChild(myLoader);        //Add loader

        //Sent GET request
        const response = await fetch (`http://localhost:8080/pokemon/catch/${pokemonID}`,{
            method:"PUT",
            body: JSON.stringify({"pokemon":PokemonObject}),
            headers: {
                "Content-Type": "application/json",
                username: userName
            }
        })
        const pokemonAns = await response.json();
 
        divLoader.removeChild(myLoader);
        
    } catch (error) {
        divLoader.removeChild(myLoader);
        alert ("Your Pokemon not found ,Please try again");
    }
}


// release Pokemon
async function releasePokemon(pokemonID ,userName) {
    try {
        divLoader.appendChild(myLoader);        //Add loader
        //Sent delete request http://localhost:8080/pokemon/release/
        const response = await axios.delete(`http://localhost:8080/pokemon/release/${pokemonID}`,{
            headers: {
                    username: userName
                }
        });
        const pokemonAns = await response.data;
    
        divLoader.removeChild(myLoader);

    } catch (error) {
        divLoader.removeChild(myLoader);
        alert ("Your Pokemon not found ,Please try again");
    }
}


// const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}/`);
// function axios ///*** collection pokemon ***///
async function searchCollcetion(userName) {
    try {
        divLoader.appendChild(myLoader);        //Add loader
        //Sent GET request http://localhost:8080/pokemon/
        const response = await axios.get(`http://localhost:8080/pokemon/`,{
            headers: {
                    username: userName
                }
        });
        const pokemonAns = await response.data;
        collectionToDom(pokemonAns); 
        divLoader.removeChild(myLoader);
        
    } catch (error) {
        divLoader.removeChild(myLoader);
        alert ("Your Pokemon not found ,Please try again");
    }
}

//Add collection to DOM
function collectionToDom(collectionArray) {
    //container element
    const currectCollection = document.createElement("div");
    currectCollection.classList.add("collection");
    
    //close button
    const closeBtn = document.createElement("button");
    closeBtn.classList.add('close-btn')
    closeBtn.textContent = "close❌";
    closeBtn.addEventListener("click", ()=> document.querySelector(".collection").remove());
    currectCollection.appendChild(closeBtn);
    //Create list
    if (collectionArray.length === 0) {
        const emptyMessege = document.createElement("p");
        emptyMessege.textContent = "Youre collectioin is empty";
        currectCollection.appendChild(emptyMessege);
    } else {
        const pokeList = makePokeCollection(collectionArray); //create collection representors
        currectCollection.appendChild(pokeList);     //append to dom
    }
    collectionEl.appendChild(currectCollection);
}
//
function makePokeCollection(collectionArray) {
    const pokeList = document.createElement("ul");
        pokeList.classList.add("poke-list")
        for (let poke of collectionArray) { 
            poke = JSON.parse(poke); //parse info
            const pokeElem = document.createElement("li"); //poke container
            const pokeName = document.createElement("span");
            pokeName.classList.add('collection-item')
            pokeName.textContent = poke.name;
            const pokePic = document.createElement("img");
            pokePic.setAttribute("src", poke.front_pic);
            pokeElem.appendChild(pokeName);
            pokeName.appendChild(pokePic);
            pokeList.appendChild(pokeElem);
        }
    return pokeList;
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

