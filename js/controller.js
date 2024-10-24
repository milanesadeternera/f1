let pageContent="";

document.addEventListener("DOMContentLoaded",async()=>{
    //Creo el history dropdown
    makeDropdown();
    //Tabla de cuerpo.
    pageContent = document.getElementById("mainTable");
    //cargo por defecto la tabla de pilotos
    data = await driveStandings()
    tablaPilotos(data);

    //addEvent al dropdown
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    dropdownItems.forEach(item => {
        item.addEventListener('click', function (item) {
            console.log(item);
             changeSeason(item.value);
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
            data = await driveStandings()
            tablaPilotos(data);
        break;
        case "nav-constructores-tab":
            data = await constructorStandings()
            tablaConstructors(data);
        break;
        case "nav-calendar-tab":
            data = await getCalendar()
            tablaCalendar(data);
        break;
        case "nav-history-tab":
            //data = await getCalendar()
            history();
        break;
    }
}

async function makeDropdown(){
    console.log("makeDropdown()")
    let dropdown = document.getElementById("historyDropdown");
    //Ya sé que la primera temporada fue en 1950
    for(let i=parseInt(new Date().getFullYear()); i>=1950 ; i--){
        content = `<li><a class="dropdown-item" href="#">${i}</a></li>`;
        dropdown.insertAdjacentHTML("beforeend", content);
    }

}

function changeSeason(year){
    console.log("cambio temporada", year);
}

//Campeonato pilotos
async function driverStandingsController(){}
//Resultado piloto

//campeonato constructores

//Calendario

//Carrera

//history
function history(){

}