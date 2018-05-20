const demoRadio = document.querySelector("#demo-data");
const mainRadio = document.querySelector("#score-data");
const tableScore = document.querySelector("#table-score");
const scoreChart = document.querySelector("#scoreChart").getContext('2d');

const urlsEnd = ['rsschool-demo.json', 'users.json', 'rsschool.json'];

let usersArr = [];
let demoDataArr = [];
let demoRounds;
let mainRounds;
let mainDataArr = [];

let mainTable;
let demoTable;

let requests = urlsEnd.map(val => fetch(`https://olegkoleda.github.io/${val}`));
// get json files from .github.io
Promise.all(requests)
  .then(responses => Promise.all(responses.map(r => r.json())))
  .then(users => {
      [demoDataArr, usersArr, mainDataArr] = users;
      
      demoRounds = demoDataArr.puzzles;
      mainRounds = mainDataArr.puzzles;

      demoDataArr = demoDataArr.rounds;
      mainDataArr = mainDataArr.rounds;       
    });


const showDemoScore = function () {
    mainRadio.checked = false;
    clearChart();
    demoTable = makeOneDataObj(usersArr, demoDataArr);
    createTable(demoTable, demoRounds);
    setChartLabels(demoRounds);
}

const showMainScore = function () {
    demoRadio.checked = false;
    clearChart()
    mainTable = makeOneDataObj(usersArr, mainDataArr);
    createTable(mainTable, mainRounds);
    setChartLabels(mainRounds);
}

const addToChart = function (event) {
    let target = event.target;
    if (target.tagName.toUpperCase() == 'INPUT') {
        if (config.data.datasets.length >= 10) {target.checked = false;}
        let datasetObj = {};
        Object.assign(datasetObj, target.dataset);
        (target.checked) ? addChartDataset(datasetObj) : removeChartDataset(datasetObj); 
    }  
}

// add handlers on radio and table
demoRadio.addEventListener("click", showDemoScore);
mainRadio.addEventListener("click", showMainScore);
tableScore.addEventListener("click", addToChart);


function makeOneDataObj(usersObj, dataObj) {
    
    usersObj.users.forEach(element => {
        element.rounds = []; 
        for (let i = 0; i < dataObj.length; i++) {
            let time = (dataObj[i].solutions[element.uid]) ? dataObj[i].solutions[element.uid].time.$numberLong : 150;
            let code = (dataObj[i].solutions[element.uid]) ? dataObj[i].solutions[element.uid].code : "";
            element.rounds.push([time, code]);
        }
        element.finalScore = element.rounds.reduce((allTime, roundTime) => allTime += +roundTime[0], 0);
    });

    return usersObj;
}

//draw table 

function createTable(usersObj, roundsObj) {
    tableScore.innerHTML = "";
    //create thead
    let thead = document.createElement("thead");
    let tr = document.createElement("tr");
    tr.innerHTML = `<td>Display name</td>`;
    roundsObj.forEach(item => {
        let td = document.createElement("td");
        td.innerHTML = item.name;
        tr.appendChild(td);
    });
    tr.innerHTML += `<td>Total time</td><td>Comparison</td>`;
    thead.appendChild(tr);
    tableScore.appendChild(thead);

    //add users and scores
    usersObj.users.forEach( (item, i) => {
        let tr = document.createElement("tr");
        tr.innerHTML = `<td>${item.displayName}</td>`;
            item.rounds.forEach(rouns => {
                let td = document.createElement("td");
                td.classList.add("tooltip");
                td.innerHTML += `
                ${rouns[0]}
                <span class="tooltiptext">${rouns[1]}</span>`;
                tr.appendChild(td);
            });

        tr.innerHTML += `<td>${item.finalScore}</td>`;

        let td = document.createElement("td");
        let checkbox = document.createElement("INPUT");
        checkbox.setAttribute("type", "checkbox");
        checkbox.setAttribute("data-name", `${item.displayName}`);
        checkbox.setAttribute("data-id", `${item.uid}`);

        item.rounds.forEach((rouns, i) => {
            checkbox.setAttribute(`data-round-${i}`, `${rouns[0]}`);
        });

        td.appendChild(checkbox);
        tr.appendChild(td);
        tableScore.appendChild(tr);
    });
}


// Line Chart

let config = {
    type: "line",
    data: {
        labels: [],
        datasets: []
    }
}

let myLineChart = new Chart(scoreChart, config);

// set labels
function setChartLabels(roudsName) {
    let chartLabels = roudsName.map(round => round.name);
    config.data.labels = chartLabels;
    myLineChart.update();
}

function addChartDataset(datasetObj) {
    let chartColor = `rgb(${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)})`;
    let chartData = {
        label: "",
        data: [],
        fill: false,
        borderColor: chartColor,
        backgroundColor: chartColor
    };
    //get name
    let keys = Object.keys(datasetObj);
    chartData.label = datasetObj[keys.shift()];
    //get id
    chartData.id = datasetObj[keys.shift()];

    for (let item of keys){
        chartData.data.push(+datasetObj[item]);
    }

    config.data.datasets.push(chartData);
    myLineChart.update();

}

function removeChartDataset(datasetObj) {

    let keys = Object.keys(datasetObj);
    //remove name
    keys.shift();
    //get id
    let removeId = datasetObj[keys.shift()];

    config.data.datasets.forEach((item, i, arr) => {
        if (item.id === removeId) {
            arr.splice(i, 1);
        }
    });
    myLineChart.update();
}

function clearChart() {
    config.data.datasets = [];
    myLineChart.update();
}