import { sortedTickers } from '../fetch_tickers';

sortedTickers.then(data => {
    console.log(data)
    const width = 1500
    const height = 600   
    const margin = {top: 50, bottom: 50, left: 50, right: 50}

    var svg = d3.select('#d3-container')
        .append('svg')
        .attr('class', 'svg-box')
        .attr("width", width - margin.right)
        .attr("height", height)
        .attr('viewbox', [0,0,width, height])

    const x = d3.scaleBand()
        .domain(d3.range(data.length))
        .range([margin.left, width - margin.right - margin.left])
        .padding(0.1)

    const y = d3.scaleLinear()
        .domain([0, Math.ceil(data[data.length - 1].mention/10) * 10])
        .range([height - margin.bottom, margin.top])

    var span = d3.select('body').append('span')
        .attr("class", "tooltip-donut")
        .style("opacity", 0)

    svg.append('g')
        .selectAll('rect')
        .data(data)
        .join('rect')
            .attr('class', "bar")
            .style("fill", "rgba(123, 87, 255)")
            .attr("x", (d,i) => x(i))
            .attr("y", (d,i) => y(d.mention))
            .attr("height", d => y(0) - y(d.mention))
            .attr("width", x.bandwidth())
            .on("mouseover", function(d) {
                d3.select(event.currentTarget).transition()
                    .duration("50")
                    .attr("opacity", ".85")
                span.transition().duration(50).style("opacity", "1")
                let displayText = d.ticker + ": " + d.mention
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

    function xAxis(g){
        g.call(d3.axisBottom(x).tickFormat(i => data[i].ticker))
        .attr("transform", `translate(0, ${height - margin.bottom + 10})`)
        .attr("font-size", "20px")
        .attr("class", "d3-axes")
        
    }

    function yAxis(g){
        g.call(d3.axisLeft(y).ticks(null, data.format))
        .attr('transform', `translate(${margin.left, margin.left})`)
        .attr('font-size', "14px")
        .attr("class", "d3-axes")
    }

    svg.append("g").call(yAxis)
    svg.append("g").call(xAxis)







})

