const axios = require('axios')

export const fetchProfile = async(ticker) => {
    try{
        const profile = await axios.get(`/tickerinfo/${ticker}`)
        return profile.data
    } catch(err){
        console.log(err)
    }
}

export const fetchRecommend = async(ticker) => {
    try{
        const profile = await axios.get(`/tickertrend/${ticker}`)
        return profile.data
    } catch(err){
        console.log(err)
    }
}