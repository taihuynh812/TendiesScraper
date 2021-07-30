// companyProfiles.then(data => {
//     const sorted = []
//     for(let i = data.length - 1; i >= 0; i--){
//         if (data[i].name){
//             sorted.push(data[i])
//         }
//     }

//     const svg = d3.select("#companies-container")
//             .selectAll('.company-container')
//             .data(sorted)
//             .enter()
//                 .append("div")
//                     .attr('class', 'company-container')

//     const details = d3.selectAll('.company-container').data(sorted)    

//     details.append('div').text(d => {return "Company: " + d.name}).attr("class", "company-name")
//     details.append('div').text(d => {return "Ticker: " + d.ticker}).attr("class", "company-ticker")
//     details.append('div').text(d => {return "Market Capitalization: " + d.marketCapitalization}).attr("class", "company-markcap")
//     details.append('div').text(d => {return "Industry: " + d.industry}).attr("class", "company-industry")
//     details.append('div').text(d => {return "Exchange: " + d.exchange}).attr("class", "company-exchange")
//     details.append('div').text(d => {return "Country: " + d.country}).attr("class", "company-country")

// })