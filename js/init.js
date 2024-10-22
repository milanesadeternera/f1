/*https://github.com/jolpica/jolpica-f1/blob/main/docs/README.md
*/
const BASE_URL = "https://api.jolpi.ca";
const COUNTRY={
    "British" : "gb",
    "Austrian": "at",
    "Italian": "it",
    "German": "de",
    "American": "us",
    "French": "fr",
    "Swiss": "ch",
    "Dutch": "nl",
    "Monegasque": "mc",
    "Spanish": "es",
    "Mexican": "mx",
    "Canadian":"ca",
    "Japanese": "jp",
    "Thai": "th",
    "Australian":"au",
    "Danish":"dk",
    "Argentinian":"ar",
    "New Zealander":"nz",
    "Chinese": "cn",
    "Finnish": "fi",
};
document.addEventListener("DOMContentLoaded",()=>{

})

//showSpinner
function showSpinner(){
    document.getElementById("spinner").style.display="";
}
//hideSpinner
function hideSpinner(){
    document.getElementById("spinner").style.display="none";
}
//
function getFlag(country){
    let code = COUNTRY[country].toUpperCase();
    console.log(country, code)

    return `https://flagsapi.com/${code}/flat/64.png`;
}

let getJsonData = async function (url){
    let result = {};
    return await fetch(url)
    .then(response => {
        if(response.ok){
            return response.json();
        }else{
            throw Error(response.statusText);
        }
    })
    .then(function(response){
        result.status = "ok";
        result.data = response;
        return result;
    })
    .catch(function(error){
        result.status = 'error';
        result.data = error;
        return result;
    })
}

//Drive Standings
async function driveStandings(year = new Date().getFullYear()){
    const DRIVE_STANDINGS=`/ergast/f1/${year}/driverstandings/`;

    let data = await getJsonData(BASE_URL+DRIVE_STANDINGS);
    if(data.status != "ok"){
        //error en la request
        console.log("error")
    }
    let table = data.data.MRData.StandingsTable.StandingsLists[0];
    return table;
}
//Constructor Standings
async function constructorStandings(year = new Date().getFullYear()){
    const CONSTRUCTOR_STANDINGS=`/ergast/f1/${year}/constructorstandings/`;

    let data = await getJsonData(BASE_URL+CONSTRUCTOR_STANDINGS);
    if(data.status != "ok"){
        //error en la request
        console.log("error")
    }
    let table = data.data.MRData.StandingsTable.StandingsLists[0];
    return table;
}