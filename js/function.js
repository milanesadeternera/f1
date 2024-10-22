document.addEventListener("DOMContentLoaded",()=>{
    //
})




//Evento de cambio de pestaña.
document.getElementById('nav-tab').addEventListener('shown.bs.tab', async function (event){
    //Muestro spinner y borro contenido
    showSpinner();
    document.getElementById("mainTable").innerHTML="";
    let data = "";
    switch(event.target.id){
        case "nav-pilotos":
            data = await driveStandings()
            tablaPilotos(data);
        break;
        case "nav-constructores":
            data = await constructorStandings()
            tablaConstructors(data);
        break;
    }
  });

//tabla pilotos
function tablaPilotos(data){
    let pageContent = document.getElementById("mainTable");
    console.log("tablaPilotos",data);
    data.DriverStandings.forEach(driver => {
        let flag = getFlag(driver.Driver.nationality);
        content = 
        `<li class="list-group-item d-flex justify-content-between align-items-start">
            <div class="ms-2 me-auto">
                <div class="fw-bold">
                    ${driver.Driver.familyName}
                </div>
                ${driver.Constructors[0].name}
            </div>
            <div class="me-2">
                <img src="${flag}" class="nation">
            </div>
            <div class="d-flex flex-column">
            <span class="badge text-bg-primary rounded-pill mb-1">Puntos: ${driver.points}</span>`;
            if(driver.wins > 0){
                content += `<span class="badge text-bg-success rounded-pill">Victorias: ${driver.wins}</span>`;
            }

        content +=`</div>
        </li>`;
        hideSpinner();
        pageContent.insertAdjacentHTML('beforeend', content);
    });
}

//tabla constructores
function tablaConstructors(data){
    let pageContent = document.getElementById("mainTable");
    console.log("tablaConstructor",data);
    data.ConstructorStandings.forEach(team => {
        content = 
        `<li class="list-group-item d-flex justify-content-between align-items-start">
            <div class="ms-2 me-auto">
                <div class="fw-bold">${team.Constructor.name}</div>
                ${team.Constructor.nationality}
                </div>
                <span class="badge text-bg-primary rounded-pill">${team.points}</span>
        </li>`;
    hideSpinner();
    pageContent.insertAdjacentHTML('beforeend', content);
    });
}