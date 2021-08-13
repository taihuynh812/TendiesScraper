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
    container.append("div").attr("class", "company-price")  
    
    const profile = d3.selectAll('.company-profile').data(sorted)
    profile.append('div').text(d => {return "Company: " + d.name}).attr("class", "company-name")
    profile.append('div').text(d => {return "Ticker: " + d.ticker}).attr("class", "company-ticker")
    profile.append('div').text(d => {return "Market Capitalization: " + (d.marketCapitalization).toLocaleString() + " million"}).attr("class", "company-markcap")
    profile.append('div').text(d => {return "Industry: " + d.finnhubIndustry}).attr("class", "company-industry")
    profile.append('div').text(d => {return "Exchange: " + d.exchange}).attr("class", "company-exchange")
    profile.append('div').text(d => {return "Country: " + d.country}).attr("class", "company-country")


    var margin = 20, width = 500, height = 300
    var radius = Math.min(width, height) / 2 - margin

    const new_data = recommends.map(function(d){
        if (d){
            return [
                { key: 'Strong Sell', value: d.strongSell},
                { key: 'Sell', value: d.sell},
                { key: 'Hold', value: d.hold},
                { key: 'Buy', value: d.buy},
                { key: 'Strong Buy', value: d.strongBuy},
            ]
        } else {
            return [
                { key: 'Strong Sell', value: 0},
                { key: 'Sell', value: 0},
                { key: 'Hold', value: 0},
                { key: 'Buy', value: 0},
                { key: 'Strong Buy', value: 0},
            ]
        }
    })

    var color = d3.scaleOrdinal()
        .domain(["Strong Sell", "Sell", "Hold", "Buy", "Strong Buy"])
        .range(["#C50000", "#FF4E4E", "#ffff00", "#63FF57", "#39B500"])

    var pie = d3.pie().value(d => d.value)

    var arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius)

    // bind our data to the divs. add a group to each div.
    const recommendSvg = d3.selectAll('.company-recommend')
        .data(new_data)
        .append('svg')
            .attr('width', width)
            .attr('height', height)
            .style('padding-top', "20px")
            .style("color", "white")
        .append('g')
            .attr('transform', `translate(${width / 2},${height / 2})`)
            .attr('class', "pie-chart")

    var span = d3.select('body').append('span')
        .attr("class", "tooltip-donut")
        .style("opacity", 0)
    // draw the pie chart in each group
    // by creating one path for each slice
    recommendSvg.selectAll('path')
        .data(d => pie(d))
        .join('path')
            .attr('d', arc)
            .attr('fill', d => color(d.data.key))
            .attr('stroke', 'black')
            .attr('stroke-width', '1px')
            .attr('opacity', 0.7)
            .on("mouseover", function(d) {
                d3.select(event.currentTarget).transition()
                    .duration("50")
                    .attr("opacity", ".85")
                span.transition().duration(50).style("opacity", "1")
                let displayText = d.data.key + ": " + d.data.value
                span.html(displayText)
                    .style('left', (d3.event.pageX + 5) + "px")
                    .style('top', (d3.event.pageY - 5) + "px")
            })
            .on("mouseout", function(d){
                d3.select(event.currentTarget).transition()
                    .duration("50")
                    .attr("opacity", "1")
                span.transition().duration(50).style("opacity", "0")
            })

    recommendSvg.append("circle")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", 60)
        .attr("fill", "#092543");


    const legendG = recommendSvg.selectAll('.legend')
        .data(d => d)
        .enter().append("g")
        .attr("transform", function(d,i){
            return "translate(" + (width - 370) + "," + ((i * 2) * 10) + ")";
        })
        .attr("class", "legend")
        .style("color", "white")

        
    legendG.append("rect")
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill", function(d, i){
            return color(i)
        })
        .attr("class", "legend-box")

    legendG.append('text')
        .text(d => d.key)
        .attr('x', 10)
        .attr('y', 11)
        .style("fill", "white")
        .attr("class", "legend-text")
})