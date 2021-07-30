import { companyProfiles } from "../fetch_tickers";
import './companies.scss'

companyProfiles.then(data => {
    const sorted = []
    const recommends = []
    for(let i = data.length - 1; i >= 0; i--){
        if (data[i][0].name){
            sorted.push(data[i][0])
            recommends.push(data[i][1][0])
        }
    }

    const svg = d3.select("#companies-container")
            .selectAll('.company-container')
            .data(sorted)
            .enter()
                .append("div")
                    .attr('class', 'company-container')

    const container = d3.selectAll('.company-container').data(sorted)

    container.append("div").attr("class", "company-profile")    
    container.append("div").attr("class", "company-recommend")    

    
    const profile = d3.selectAll('.company-profile').data(sorted)
    profile.append('div').text(d => {return "Company: " + d.name}).attr("class", "company-name")
    profile.append('div').text(d => {return "Ticker: " + d.ticker}).attr("class", "company-ticker")
    profile.append('div').text(d => {return "Market Capitalization: " + (d.marketCapitalization).toLocaleString() + " million"}).attr("class", "company-markcap")
    profile.append('div').text(d => {return "Industry: " + d.finnhubIndustry}).attr("class", "company-industry")
    profile.append('div').text(d => {return "Exchange: " + d.exchange}).attr("class", "company-exchange")
    profile.append('div').text(d => {return "Country: " + d.country}).attr("class", "company-country")


    var margin = 20, width = 250, height = 250
    var radius = Math.min(width, height) / 2 - margin
    
    console.log(recommends)
    recommends.forEach(data => {
        let dataset
        if (data.strongSell){
            dataset = {strongSell: data.strongSell, sell: data.sell, hold: data.hold, buy: data.buy, strongBuy: data.strongBuy}
        }
        const svg = d3.selectAll(".company-recommend")
            .append("svg")
                .attr("width", width)
                .attr("height", height)
            .append("g")
                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
        
        var color = d3.scaleOrdinal()
            .domain(dataset)
            .range(["#570e00", "#ff2a00", "#ffff00", "#00ff08", "#00570c"])

        var pie = d3.pie()
            .value(function(d) {console.log(d)
                return d.value; })
        var data_ready = pie(d3.entries(dataset))

        svg
            .selectAll('whatever')
            .data(data_ready)
            .enter()
            .append('path')
            .attr('d', d3.arc()
                .innerRadius(0)
                .outerRadius(radius)
            )
            .attr('fill', function(d){ return(color(d.data.key)) })
            .attr("stroke", "black")
            .style("stroke-width", "2px")
            .style("opacity", 0.7)
    })
})