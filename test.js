const fetch = require('node-fetch')

const todayTime = Math.round(new Date().getTime() / 1000)
function yesterdayTime(){
    return Math.round((new Date().getTime() - (36 * 60 * 60 * 1000)) / 1000);
} 

const tickers = {}

function sortTickers(){
    return Object.entries(tickers).sort((a,b) => b[1]-a[1]).slice(0,6)
}

let excludeWords = ["COVID", "DD", "NO", "YES", "WSB", "SHORT", "NYC", "FLOAT", "LONG", "OTM", "ITM", "DFV", "BUY", "SELL", "STOCK", "YTD", "GREAT", "BUT", "WHEN", 
                        "YOU", "WILL", "LOTS", "OF", "LOL", "USA", "YOLO", "OP", "STOP", "TO", "THE", "MOON", "THIS", "NOT", "GAIN", "LOSS", "US", "TV", "RIP",
                        "JPOW", "CEO", "VOTE", "BITCH", "LIKE", 'WTF', "MINOR", "IPO"
                        ].reduce((acc, a) => (acc[a]="placeholder", acc), {})


const redditUrl = `https://api.pushshift.io/reddit/search/submission/?subreddit=wallstreetbets&sort=desc&sort_type=created_utc&after=${yesterdayTime()}&size=1000`

console.log(redditUrl)

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

isTicker("$ABC")

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
    console.log(tickers)
    return cb()
}

function greeting(){
    return("Callback")
}

fetchTickers(greeting)
setTimeout(()=>console.log(tickers), 20000);
setTimeout(()=>console.log(sortTickers()), 20000);


