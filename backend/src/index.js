const dotenv = require ('dotenv')
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const http = require('http');

const routes = require('./routes')
const { setupWebsocket } = require('./websocket')


dotenv.config ()

const app = express();
const server = http.Server(app);

setupWebsocket(server);

mongoose.connect('mongodb+srv://' + process.env.BD_USER + ':' + process.env.BD_PASSWORD + '@' + process.env.BD_HOST + '?retryWrites=true&w=majority',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
})

//app.use(cors({origin: 'http://localhost:3000'}))
app.use(cors())

app.use(express.json())
app.use(routes)

app.listen(3333)
//Metodos HTTP: GET, POST, PUT, DELETE

// Tipos de parâmetros:

// Query Params: request.query (Filtros, ordenação, paginação, ...)
// Route Params: request.params (Identificar um recurso na alteração ou remoção)
// Body: request.body (Dados para criação ou alteração de um registro)