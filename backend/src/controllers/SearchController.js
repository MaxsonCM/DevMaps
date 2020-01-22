const Dev = require('../models/Devs')
const parseStringAsArray = require('../utils/parseStringAsArray')
//index, show, store, update, destroy

module.exports = {
    async index(req, res){
        //buscar todos os devs em um raio
        const { latitude, longitude, techs } = req.query
        const techs_array = parseStringAsArray(techs)
        
        const devs = await Dev.find({
            techs: {
                $in: techs_array,
            },
            location:{
                $near:{
                    $geometry:{
                        type: 'Point',
                        coordinates: [longitude, latitude],
                    },
                    $maxDistance: 10000,
                }
            }
        })
        
        return res.json(devs)
    },
}