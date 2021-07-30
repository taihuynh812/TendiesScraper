const axios = require('axios')

// export async function fetchTickerAction(ticker){
//     const profile = await axios.get(`/tickerinfo/${ticker}`)
//     console.log(profile)
//     return profile
//         .catch(err => console.log(err))
// }

export const fetchTickerAction = async(ticker) => {
    try{
        const profile = await axios.get(`/tickerinfo/${ticker}`)
        return profile.data
    } catch(err){
        console.log(err)
    }
}

