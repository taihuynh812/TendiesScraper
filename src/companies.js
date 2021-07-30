import { companyProfiles } from "../fetch_tickers";
import './companies.scss'

companyProfiles.then(data => {
    console.log(data)
    const svg = d3.select("#companies-container")
            .selectAll('.company-container')
            .data(data)
            .enter()
                .append("div")
                    .attr('class', 'company-container')

    const details = d3.selectAll('.company-container').data(data)    

    details.append('div').text(d => {return d.name}).attr("class", "company-name")
    details.append('div').text(d => {return d.ticker}).attr("class", "company-ticker")
    details.append('div').text(d => {return d.marketCapitalization}).attr("class", "company-markcap")
    details.append('div').text(d => {return d.industry}).attr("class", "company-industry")
    details.append('div').text(d => {return d.exchange}).attr("class", "company-exchange")

})