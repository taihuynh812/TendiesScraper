import fetch from 'node-fetch'
import { fetchProfile, fetchRecommend, fetchPrice } from './src/action/fetch_ticker';

const todayTime = Math.round(new Date().getTime() / 1000)
function yesterdayTime(){
    return Math.round((new Date().getTime() - (36 * 60 * 60 * 1000)) / 1000);
} 

const tickers = {}

function sortTickers(){
    let sortedTickers = []
    let top10 = Object.entries(tickers).sort((a,b) => b[1]-a[1]).slice(0,10)
    top10.sort((a,b) => a[1]-b[1]).forEach(ticker => sortedTickers.push({ticker: ticker[0], mention: parseInt(ticker[1])}))
    return sortedTickers
}


let excludeWords = ["COVID", "DD", "NO", "YES", "WSB", "SHORT", "NYC", "FLOAT", "LONG", "OTM", "ITM", "DFV", "BUY", "SELL", "STOCK", "YTD", "GREAT", "BUT", "WHEN", 
        "YOU", "WILL", "LOTS", "OF", "LOL", "USA", "YOLO", "OP", "STOP", "TO", "THE", "MOON", "THIS", "NOT", "GAIN", "LOSS", "US", "TV", "RIP", "SEC", "CHINA",
        "JPOW", "CEO", "VOTE", "BITCH", "LIKE", 'WTF', "MINOR", "IPO", "APE", "SAVE", "SPAC", "DO", "DONT", "PLACE", "YOUR", "MY", "MINE", "PORN", "WEDGE", "EV",
        "JOB", "IN", "OUT", "JAIL", "AND", "IRL", "IS", "ETF", "DOW", "DIA", "MOVE", "CNN", "THANK", "FUCK", "FK", "GAMMA", "LETS", "IT", "THEY", "ETORO", "TRUST",
        "FOMO", "RAPE", "RAPED", "PUT", "CALL", "COVER", "BOYS", "MOASS", "GONNA", "FOR", "MLB", "LOAD", "MISS", "HF", "FUND", "ONLY", "WIFE", "OP"
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

async function fetchTickers(cb){
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

async function fetchCompanies(){
    const sorted = await fetchTickers(sortTickers)
    const firstFive = sorted.slice(0, 5)
    const lastFive = sorted.slice(5)
    const tickers = []
    const companies = []

    firstFive.map((company, i) => {
        tickers.push([fetchProfile(company.ticker), fetchRecommend(company.ticker), fetchPrice(company.ticker)])
    })
    await new Promise(resolve => {setTimeout(resolve, 1000)})
    lastFive.map((company, i) => {
        tickers.push([fetchProfile(company.ticker), fetchRecommend(company.ticker), fetchPrice(company.ticker)])
    })

    const promiseAll = await Promise.all(
        tickers.map(ticker => {
            return Promise.all(ticker)
        })
    )
    promiseAll.forEach((promise, i) =>{
        if (promise[0].name){
            companies.push(promise)
        }
    })
    return companies
}



export const sortedTickers = fetchTickers(sortTickers)
export const companyProfiles = fetchCompanies()
