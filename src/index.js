import fetch from 'node-fetch'

const todayTime = Math.round(new Date().getTime() / 1000)
function yesterdayTime(){
    return Math.round((new Date().getTime() - (36 * 60 * 60 * 1000)) / 1000);
} 

const tickers = {}

export function sortTickers(){
    let sortedTickers = []
    Object.entries(tickers).sort((a,b) => b[1]-a[1]).slice(0,10).forEach(ticker => sortedTickers.push({[ticker[0]]: ticker[1]}))
    return sortedTickers
}

let excludeWords = ["COVID", "DD", "NO", "YES", "WSB", "SHORT", "NYC", "FLOAT", "LONG", "OTM", "ITM", "DFV", "BUY", "SELL", "STOCK", "YTD", "GREAT", "BUT", "WHEN", 
                        "YOU", "WILL", "LOTS", "OF", "LOL", "USA", "YOLO", "OP", "STOP", "TO", "THE", "MOON", "THIS", "NOT", "GAIN", "LOSS", "US", "TV", "RIP",
                        "JPOW", "CEO", "VOTE", "BITCH", "LIKE", 'WTF', "MINOR", "IPO", "APE", "SAVE", "SPAC"
                        ].reduce((acc, a) => (acc[a]="placeholder", acc), {})


const redditUrl = `https://api.pushshift.io/reddit/search/submission/?subreddit=wallstreetbets&sort=desc&sort_type=created_utc&after=${yesterdayTime()}&size=1000`

function isTicker(ticker){    
    let AZ = "$ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    if (excludeWords[ticker.toUpperCase()]) return false
    if (ticker.length < 2 || ticker.length > 5) return false
    for (let i=0; i<ticker.length; i++){
        if(parseInt(ticker[i])) return false
        if(!AZ.includes(ticker[i])) return false
    }
    if (ticker[0] === "$"){
        return ticker.slice(1).toUpperCase()
    } else {
        return ticker
    }
}

function extractTickers(string){
    let stringArr = string.split(" ")
    for (let i=0; i < stringArr.length; i++){
        let word = isTicker(stringArr[i])
        if(word){
            if (!tickers[word]){
                tickers[word] = 1
            } else {
                tickers[word] += 1
            }
        }
    }
}

async function extractFromComments(url, cb){
    const subredditReplies = await fetch(url)
        .then(res => res.json())
        .then(data => {
            if (data[1].data.children.length > 0){
                for (let i=1; i < data[1].data.children.length; i++){
                    if (data[1].data.children[i].data.body){
                        let currentReply = data[1].data.children[i].data.body
                        extractTickers(currentReply)
                        if (currentReply.replies){
                            let repliesWithinReplyArray = currentReply.replies.data.chidlren
                            for (let j=0; j < repliesWithinReplyArray.length; j++){
                                let reply = repliesWithinReplyArray[j].data.body
                                extractTickers(reply)
                            }
                        }
                    }
                }
            }
            return "hello"
        })
        .catch(err => console.log(err))
    return Promise.resolve("Inside extractComments")
}


export async function fetchTickers(cb){
    const subreddit = await fetch(redditUrl)
        .then(res => res.json())
        .then(data => {
            let results = []
            for (let i=0; i < data.data.length; i++){
                let currentPost = data.data[i]
                let currentTitle = currentPost.title
                extractTickers(currentTitle)
                let postCommentsURL = currentPost.full_link.slice(0, currentPost.full_link.length - 1) + ".json"
                postCommentsURL = decodeURI(postCommentsURL)
                postCommentsURL = encodeURI(postCommentsURL)
                results.push(extractFromComments(postCommentsURL))
            }
            return results
        })
        const allPromises = await Promise.all(subreddit)
    return cb()
}





fetchTickers(sortTickers)
    .then(data => window.data = data)

console.log("Inside Index file")



document.addEventListener("DOMContentLoaded", function(e) {
    const data = [
        {name: "1", score: 10},
        {name: "2", score: 20},
        {name: "3", score: 30},
        {name: "4", score: 40}
    ]
    const width = 800;
    const height = 400;
    const margin = { top: 50, bottom: 50, left: 50, right: 50 }
    
        const svg = d3.select('#d3-container')
            .append("svg")
            .attr("height", height - margin.top - margin.bottom)
            .attr("width", width - margin.left - margin.right)
            .attr('viewbox', [0, 0, width, height]);
    
        const x = d3.scaleBand()
            .domain(d3.range(data.length))
            .range([margin.left, width - margin.right])
            .padding(0.1);
    
        const y = d3.scaleLinear()
            .domain([0, 100])
            .range([height - margin.bottom, margin.top])
    
        svg
            .append('g')
            .attr("fill", "royalblue")
            .selectAll('rect')
            .data(data.sort((a, b) => d3.descending(a.score, b.score)))
            .join('rect')
            .attr("x", (d, i) => x(i))
            .attr('y', (d) => y(d.score))
            .attr("height", d => y(0) - y(d.score))
            .attr("width", x.bandwidth())
    
        svg.node()
})