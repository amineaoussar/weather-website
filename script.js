const apiKey = "31f31939399a4976a9e42034261303";
let city = "beni mellal";


/* Logic Variabels*/
let accData = "1";
let tempreture;
let humidity;
let precipitation;
let windspeed;
let date;
let today;
let dayNum =0;
let xAxe = 45;
let yAxe = 350;

/*ID Variables */

const mainContainerID = document.getElementById("main-container");
const loadingItemID = document.getElementById("loading-screen");
const graphID = document.getElementById("data-graph");

const ctx = graphID.getContext('2d');

const navButtons = document.querySelectorAll(".nav-buttons");

const tempID = document.getElementById("tempreture");
const humidID = document.getElementById("humidity");
const precipID = document.getElementById("precipitation");
const dateID = document.getElementById("main-title");
const windspID = document.getElementById("windspeed");

const navDaysID = document.querySelectorAll(".nav-buttons");
const imgID = document.getElementById("img");

const navTimeID = document.querySelectorAll(".right-data");

const titleID = document.getElementById("header-title");


titleID.textContent = `Weather in ${city}`;

/*FUNCTIONS */
/*fetch data from the API */
async function getWeatherData() {
    try{
        const data = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=7`);
        const jsData = await data.json();
        return jsData;
        
        
    }
    catch(error){
        console.error("faillure", error);

    }
    
}
/*determine the day*/
function wichDay(date){

    date = String(date).slice(0,10);
    let dateObj = new Date(date);
    let dayName;
    
    switch (dateObj.getDay()) {
        case 0:
            dayName = "Sunday";
            break;
        case 1:
            dayName = "Monday";
            break;
        case 2:
            dayName = "Tuesday";
            break;
        case 3:
            dayName = "Wednesday";
            break;
        case 4:
            dayName = "Thursday";
            break;
        case 5:
            dayName = "Friday";
            break;
        case 6:
            dayName = "Saturday";
            break;
        default:
            dayName = "Unknown";
    }
    return dayName;
}

/*asign tempreture and hours to the right side and draw data graph*/
function asignTime(timeData){

    let curantTime = String(accData.location.localtime);
    curantTime = curantTime.slice(11,13);
    curantTime = Number(curantTime)+1;
    let timeIndex = curantTime;
    


    /*Graph of tempreture */

    ctx.beginPath();
    ctx.strokeStyle = 'rgb(169, 35, 35)';
    ctx.lineWidth = 3;
   

    for(let i =0;i<8;i++){
        timeIndex = curantTime +i*3;
         
        if(timeIndex>=24){
            timeIndex = timeIndex - 24;
            dayNum =1;

        }

       
        navTimeID[i].textContent = `${Math.round(timeData[dayNum].hour[timeIndex].temp_c) }°`;
        navTimeID[i+8].textContent = `${Math.round(timeData[dayNum].hour[timeIndex].humidity)}%`;
        navTimeID[i+16].textContent = `${timeIndex}:00`; 

        ctx.lineTo(xAxe +100*i,yAxe-5*Math.round(timeData[dayNum].hour[timeIndex].temp_c));
    }

    ctx.stroke();
    /*Graph of humidity */
    ctx.beginPath();
    ctx.strokeStyle = 'rgb(18, 153, 171)';
    ctx.lineWidth = 3;
   

    for(let i =0;i<8;i++){
        timeIndex = curantTime +i*3;


         if(timeIndex>=24){
            timeIndex = timeIndex - 24;
            dayNum =1;

        }
        
        
        ctx.lineTo(xAxe +100*i,yAxe-2.5*Math.round(timeData[dayNum].hour[timeIndex].humidity));
    }

    ctx.stroke();
    


}
/*loading screen while the data is fitching */
function loadingScreen(){
    if (accData ==="1") {
        mainContainerID.style.display = "none";
        loadingItemID.style.display = "block";
        loadingItemID.style.visibility = "visible";
    } else {
        loadingItemID.style.display = "none";
        loadingItemID.style.visibility = "hidden";
        mainContainerID.style.display = "flex";
    }
}
/*draw graph grads */
function drawGraph(){

    ctx.beginPath();
    ctx.strokeStyle = 'rgb(60, 0, 201)';
    ctx.lineWidth = 2;
    /*Axes*/
    ctx.moveTo(xAxe,yAxe);
    ctx.lineTo(xAxe+700,yAxe);
    ctx.moveTo(xAxe,yAxe);
    ctx.lineTo(xAxe,yAxe-330);
    /* gradual points*/
    for(let i =0; i<8;i++){
        ctx.moveTo(xAxe +i*100,yAxe);
        ctx.lineTo(xAxe+ i*100,yAxe-5);

    }
    for(let i = 1 ;i<6;i++){
        ctx.moveTo(xAxe,yAxe - i*50);
        ctx.lineTo(xAxe-5,yAxe-i*50);
    }
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = 'rgb(60, 0, 201)';
    ctx.lineWidth = 2;
    /*Axes*/
    ctx.moveTo(xAxe+700, yAxe);
    ctx.lineTo(xAxe + 700, yAxe-330);
    /* gradual points 2*/
    for(let i = 1 ;i<6;i++){
        ctx.moveTo(xAxe + 700,yAxe - i*50);
        ctx.lineTo(xAxe +705,yAxe-i*50);
    }
    ctx.stroke();

}
/* Main */
async function start() {

    //loadingScreen();
    accData = await getWeatherData();
    
    /*assign data from the API */
    tempreture = Math.round(accData.current.temp_c);
    humidity = accData.current.humidity;
    precipitation = accData.current.precip_mm;
    date = accData.location.localtime;
    windspeed = accData.current.wind_kph;
    forecast = accData.forecast;

    tempID.textContent = `${tempreture}°`;
    humidID.textContent = `${humidity}%`;
    precipID.textContent = `${precipitation} mm`;
    windspID.textContent = `${windspeed}k/h`;

    today = wichDay(date);
    dateID.textContent = `Today is ${today} the ${date.slice(0,10)}`;
    drawGraph();

    asignTime(forecast.forecastday);
    
    loadingScreen();
    
}

/*this is were the code start */
start();