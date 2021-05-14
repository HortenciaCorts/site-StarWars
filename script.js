/* MENU */
//Pegando as informações do HTML
const btnMenu = document.getElementById('btn-menu');
const nav = document.querySelector('#nav');
const container = document.getElementById('container');
const icon = $('svg:first');
//Função para abrir o menu do mobile e tablete
function openMenu(){
    //Adicionar a classe active no nav e container
    nav.classList.toggle('active');
    container.classList.toggle('active');
    //Se a classe active estiver ativa então iremos mudar o icone do menu
    //E caso ela venha a fechar iremos mudar novamente para o icone inicial
    if(nav.classList.contains('active')){
        icon.replaceWith(feather.icons['x'].toSvg());
    }else if(!nav.classList.contains('active')){
        icon.replaceWith(feather.icons['align-justify'].toSvg());
    }
}
//Ao clicar no botão de menu é acionado a função openMenu
btnMenu.addEventListener('click', openMenu);


/* BUSCANDO INFORMAÇÕES DA API EXTERNA */
const personagensContador = document.getElementById('personagens');
const luasContador = document.getElementById('luas');
const planetasContador = document.getElementById('planetas');
const navesContador = document.getElementById('naves');

preencherContadores();
preencherTabela();

google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(desenharGrafico);

async function desenharGrafico() {
    const response = await swapiGet("vehicles/");
    const vehiclesArray = response.data.results;
    console.log(vehiclesArray);

    const dataArray = [];
    dataArray.push(["Veículos", "Passageiros"]);
    vehiclesArray.forEach(vehicle => {
        dataArray.push([vehicle.name, Number(vehicle.passengers)]);
    });

  var data = google.visualization.arrayToDataTable(dataArray);

  var options = {
    title: 'Maiores veículos',
    legend: "none"
  };

  var chart = new google.visualization.PieChart(document.getElementById('piechart'));

  chart.draw(data, options);
}

function preencherContadores(){
    Promise.all([
        swapiGet("people/"), 
        swapiGet("vehicles/"),
        swapiGet("planets/"),
        swapiGet("starships/")
    ]).then(function(results) {
        personagensContador.innerHTML = results[0].data.count;
        luasContador.innerHTML = results[1].data.count;
        planetasContador.innerHTML = results[2].data.count;
        navesContador.innerHTML = results[3].data.count;
  });
}

async function preencherTabela(){
    const response = await swapiGet('films/');
    console.log(response);
    const tableData = response.data.results;
    console.log(tableData);
    tableData.forEach(film => {
        $('#filmsTable').append(`<tr>
        <td>${film.title}</td>
        <td>${moment(film.release_date).format('DD/MM/YYYY')}</td>
        <td>${film.director}</td>
        <td>${film.episode_id}</td>
        </tr>`);
    })
}

function swapiGet(param){
    return axios.get(`https://swapi.dev/api/${param}`)
}
