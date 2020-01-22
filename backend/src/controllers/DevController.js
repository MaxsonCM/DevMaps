const axios = require('axios')
const Dev = require('../models/Devs')
const parseStringAsArray = require('../utils/parseStringAsArray')
const { findConnections, sendMessage } = require('../websocket')

//index, show, store, update, destroy

module.exports = {
    async index(req, res){
        const devs = await Dev.find()

        return res.json(devs)
    },
    
    async store(req, res) {
        const { github_username, techs, latitude, longitude } = req.body    
        
        if (github_username == undefined){
            return res.status(400).json({ error: 'Invalid github user name'})
        }
        if (techs == undefined){
            return res.status(400).json({ error: 'Invalid techs'})
        }
        if (latitude == undefined){
            return res.status(400).json({ error: 'Invalid latitude'})
        }
        if (longitude == undefined){
            return res.status(400).json({ error: 'Invalid longitude'})
        }

        let dev = await Dev.findOne({github_username})
        
        if (! dev){
            const apiRes = await axios.get(`https://api.github.com/users/${github_username}`)
            const { name = login, avatar_url, bio } = apiRes.data
            const techs_array = parseStringAsArray(techs)
            const location = {
                type: 'Point',
                coordinates: [latitude, longitude],
            }
            dev = await Dev.create({
                github_username,
                name,
                avatar_url,
                bio,
                techs: techs_array,
                location,
            })

            const sendSocketMessageTo = findConnections(
                { latitude, longitude },
                techsArray,
            )

            sendMessage(sendSocketMessageTo, 'newDev', dev);
        }

        return res.json(dev)
    },

    async update(req, res){
        return res.status(400).json({ error: 'this function does not exists yet'})
    },

    async destroy(req, res){
        const { id } = req.headers

        if (id == undefined){
            return res.status(400).json({ error: 'Invalid id'})
        }
        
        const dev = await Dev.findByIdAndDelete({_id: id})

        if (! dev){          
            return res.status(400).json({ error: 'Dev not found'})
        }

        return res.json({mensagem: "Dev removed", dev})
    },
}