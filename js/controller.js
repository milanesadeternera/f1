let pageContent="";

document.addEventListener("DOMContentLoaded",async()=>{
    //Creo el history dropdown
    makeDropdown();
    //Tabla de cuerpo.
    pageContent = document.getElementById("mainTable");
    //cargo por defecto la tabla de pilotos
    driverStandingsController();

    //addEvent al dropdown
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    dropdownItems.forEach(item => {
        item.addEventListener('click', function (event) {
            let value = this.getAttribute("value");
            changeSeason(value);
        });
    });
})

//Evento de cambio de pestaña.
document.getElementById('nav-tab').addEventListener('shown.bs.tab', async function (event){
    changeTab(event.target.id)
});

//Function que controla el cambio de contenido
async function changeTab(tab){
    showSpinner();
    document.getElementById("mainTable").innerHTML="";
    let data = "";
    switch(tab){
        case "nav-pilotos-tab":
            driverStandingsController();
        break;
        case "nav-constructores-tab":
            constructorStandingsController();
        break;
        case "nav-calendar-tab":
            calendarController();
        break;
    }
}

async function makeDropdown(){
    console.log("makeDropdown()")
    let dropdown = document.getElementById("historyDropdown");
    //Ya sé que la primera temporada fue en 1950
    for(let i=parseInt(new Date().getFullYear()); i>=1950 ; i--){
        content = `<li><a class="dropdown-item" value="${i}" href="#">${i}</a></li>`;
        dropdown.insertAdjacentHTML("beforeend", content);
    }

}

async function changeSeason(year){
    console.log("cambio temporada", year);
    SEASON = year;
    //pestaña activa
    document.getElementById("dropName").innerText = year; 
    changeTab(document.querySelector('.nav-link.active').id)
}

//Campeonato pilotos
async function driverStandingsController(){
    console.log("driveStandingsController():", SEASON);
    //show spiner clear content.
    showSpinner();
    pageContent.innerHTML = "";

    //recupero data y armo contenido
    let data = await driveStandings();
    let content = driverStandingsContent(data);

    hideSpinner()
    pageContent.appendChild(content);
}
//Resultado piloto
async function driverDetailController(driverId){
    console.log("dirverDetailController()", driverId);
    showSpinner();
    //Porque tengo que limpiar esto no se (?)
    pageContent.innerHTML = "";

    let season = await seasonResult(SEASON);
    let driver = await getDriver(SEASON, driverId);
    let content = await driverDetailContent(season, driver);

    hideSpinner();
    pageContent.appendChild(content);
}

//campeonato constructores
async function constructorStandingsController(){
    console.log("constructorStandigsController():");
    //show spinner y borro contenido
    showSpinner();

    //recupero data y armo contenido
    let data = await constructorStandings()
    let content = await constructorStandingsContent(data);

    hideSpinner();
    pageContent.appendChild(content);
}

//Calendario
async function calendarController(year = SEASON){
    console.log("calendarController()", year);
    showSpinner();

    let data = await getCalendar();
    let content = await calendarContent(data);
    hideSpinner();
    pageContent.appendChild(content);
}

//Carrera
async function roundDetailController(roundId){
    console.log("roundDetailController():", roundId);
    showSpinner();
    //Porque tengo que limpiar esto no se (?)
    pageContent.innerHTML = "";

    let season = await seasonResult(SEASON);

    //tengo sprint?
    let sprint = await getSprint(roundId);

    let content = await roundDetailContent(season, roundId, sprint);

    hideSpinner();
    pageContent.appendChild(content,sprint);
}

