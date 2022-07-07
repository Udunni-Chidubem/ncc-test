const states = require('../data/state-weather.json')
const locals=require('../data/lgaAccuList.json')
const { default: axios } = require('axios')
module.exports={
    forecast:async (state, local)=>{
        try{
            const cor_state=states.filter(e => {
                return e.AdministrativeArea.LocalizedName==state || e.AdministrativeArea.EnglishName==state
            })
            let url=`${process.env.wheather_base_url}/locations/v1/cities/neighbors/${cor_state[0].Key}?apikey=${process.env.wheather_api_key}`
           
            let res=await axios.get(url)
            
            let lgs=locals.find(e=>{
                return e.name==state
            });
            let lg=lgs.value.find(l=>{
                return l.accu_name==local || l.name==local
            })
            let ng=res.data.find(l=>{
                return l.LocalizedName==lg.accu_name || l.LocalizedName==lg.name || l.EnglishName==lg.accu_name || l.EnglishName==lg.name
            })
            
            let url2=`${process.env.wheather_base_url}/forecasts/v1/daily/5day/${lg.Key}?apikey=${process.env.wheather_api_key}`
           console.log(url2)
            let fres=await axios.get(url2)
            return fres.data
        }catch(e){
            return e
        }
      
    },

}