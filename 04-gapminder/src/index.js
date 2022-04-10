import * as d3 from 'd3'
import allpib from '../data/income_per_person_gdppercapita_ppp_inflation_adjusted.csv'
import lifeEsper from '../data/life_expectancy_years.csv' 
import population from '../data/population_total.csv'  


population.forEach(country => {
    (Object.keys(country)).forEach(key => {
        if (typeof  country[key] == 'string' && key !== 'country') {
          country[key] = strToInt(country[key])
        }
    })
})

let nbPib
allpib.forEach(country => {
    if (typeof country[2021] == 'string') {
        nbPib = strToInt(pays[2021])
        country[2021] = nbPib
    }
})

lifeEsper.forEach(country => {
    if (country[2021] == null) {
        let i = 2021
        do {
            i--
        } while (country[i] == null);
        console.log('en', i, 'le pib de', country['country'],'était de', country[i])
        country[2021] = country[i]
    }
})

//------------------------------------------------------------------------------

const margin = { top: 10, right: 20, bottom: 30, left: 50 }
const width = 1500 - margin.left - margin.right
const height = 600 - margin.top - margin.bottom


d3.select("body")
    .append("div")
    .attr('id', 'graph-stat-country')

const svg = d3.select("#graph-stat-country")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom + 200)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")


svg.append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("height", height)
    .attr("width", width)
    .style("fill", "#141F30")

//------------------------------------------------------------------------------

let maxPib = 0
allpib.forEach(pibByYear => {
    if (pibByYear[2021] > maxPib) {
        maxPib = pibByYear[2021]
    }
})
console.log("le pib / habitant le plus élevé est de : ", maxPib)


let maxLifeLength = 0
lifeEsper.forEach(lifeEsperByYear => {
    if (lifeEsperByYear[2021] > maxLifeLength) {
        maxLifeLength = lifeEsperByYear[2021]
    }
})
console.log("la plus longue espérence de vie est de : ", maxLifeLength, " ans ")


let maxPop = 0
let minPop = 0
population.forEach(country => {
    if (country[2021] > maxPop) {
        maxPop = country[2021]
    }
    if(population[0] == country){
        minPop = country[2021]
    }else if(country[2021] < minPop){
        minPop = country[2021]
    }
})
console.log("Le plus grand nombre de personne réunit dans un pays en 2021 est de :", maxPop, "personnes")
console.log("Le plus petit nombre de personne réunit dans un pays en 2021 est de :", minPop, "personnes")

//------------------------------------------------------------------------------


let x = d3.scaleLinear()
    .domain([0, maxPib * 1.05])
    .range([0, width])
    .nice()

let y = d3.scalePow()
    .exponent(1.7)
    .domain([0, maxLifeLength * 1.05])
    .range([height, 0])
    .nice()

let sqrtScale = d3.scaleSqrt()
    .domain([minPop, maxPop])
    .range([5, 20]);

//------------------------------------------------------------------------------


svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .call(d3.axisBottom(x).tickSize(-height * 1.3).ticks(10))


svg.append("g").call(d3.axisLeft(y)).call(d3.axisLeft(y).tickSize(-width * 1.3).ticks(10))

//------------------------------------------------------------------------------


svg.selectAll(".tick line").attr("stroke", "white").attr("opacity", "0.3")


svg.append("text")
    .attr("text-anchor", "end")
    .attr("x", width / 2 + margin.left)
    .attr("y", height + margin.top + 30)
    .text("PIB par habitant [CHF]");


svg.append("text")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-90)")
    .attr("y", -margin.left + 20)
    .attr("x", -margin.top - height / 2 + 20)
    .text("Espérance de vie")

//---------------------------------------------------------------------------------------------


svg.append('g')
    .selectAll("dot")
    .data(allpib)
    .enter()
    .append("circle")
    .attr("cx", function (d) { return x(d[2021]) })
    .data(lifeEsper)
    .join()
    .attr("cy", function (d) { return y(d[2021]) })
    .data(population)
    .join()
    .attr("r", function (d) { return sqrtScale(d[2021]) })
    .style("fill", "#519CD4")
    .attr("opacity", "0.7")
    .attr("stroke", "black")

//---------------------------------------------------------------------------------------------

function strToInt(str) {

    let number
    let onlyNumber
    if (str.slice(-1) == 'M') {
        onlyNumber = str.substring(0, str.length - 1)
        number = Number(onlyNumber)
        number = number * 1000000
    }
    else if (str.slice(-1) == 'K' || str.slice(-1) == 'k') {
        onlyNumber = str.substring(0, str.length - 1)
        number = Number(onlyNumber)
        number = number * 1000
    }
    return number
}

// EXERCICE 2

let listPays = []

lifeExpectancy.forEach(row => {
    let countryData = {};
    countryData[row['country']] = row['2021']
    istPay.push(countryData)
});

d3.select("body")
    .append("div")
    .attr('id', 'graph')

let margin = { top: 20, right: 20, bottom: 30, left: 50 },
    width = 650 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

let svg = d3.select("#graph")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)

let projection = d3.geoMercator()
    .scale(70)
    .center([0, 20])
    .translate([width / 2, height / 2]);

let aRandomNb = Math.floor(Math.random() * 6);
let aRandomScheme;
switch (aRandomNb) {
    case 0:
        aRandomScheme = d3.schemeOranges;
        break;
    case 1:
        aRandomScheme = d3.schemeGreens;
        break;
    case 2:
        aRandomScheme = d3.schemeReds;
        break;
    case 3:
        aRandomScheme = d3.schemeBlues;
        break;
    case 4:
        aRandomScheme = d3.schemeGreys;
        break;
    case 5:
        aRandomScheme = d3.schemePurples;
        break;
}


let colorScale = d3.scaleThreshold()
    .domain([50, 60, 70, 80, 90, 100])
    .range(aRandomScheme[7]);

d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson").then(function (d) {
    svg.append("g")
        .selectAll("path")
        .data(d.features)
        .join("path")
        .attr("d", d3.geoPath()
            .projection(projection)
        )
        .attr("id", function (d) { return d.properties.name; })
        .attr("fill", function (d) {
            let number = 0;
            istPay.forEach(country => {
                if (typeof country[this.id] != "undefined") {
                    console.log(country[this.id]);
                    number = country[this.id]
                }
            })
            console.log(number);
            return colorScale(number);
        })
})