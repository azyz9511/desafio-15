// Importaciones
const express = require('express');
const {Server: HttpServer} = require('http');
const {Server: IOServer} = require('socket.io');
const yargs = require('yargs/yargs')(process.argv.slice(2))
const args = yargs.default({ puerto:8080, modo:'FORK' }).argv;
const cpus = require('os').cpus().length;
const cluster = require('cluster');

// importacion e instancia de la clase Chat
const Chat = require('./js/chat');
const chat = new Chat();

// importacion e instancia de la clase Productos
const Productos = require('./js/productos');
const productos = new Productos();

// importacion de routers
const loginRouter = require('./routes/loginRouter');
const indexRouter = require('./routes/indexRouter');
const registerRouter = require('./routes/registerRouter');
const infoRouter = require('./routes/infoRouter');
const randomsRouter = require('./routes/randomsRouter');

// Inicializar express, http y socket.io
const app = express();
const httpserver = new HttpServer(app);
const io = new IOServer(httpserver);

// middlewares
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.set('view engine','ejs');
app.use(express.static("public"));
app.use('/login',loginRouter);
app.use('/',indexRouter);
app.use('/register',registerRouter);
app.use('/info',infoRouter);
app.use('/api/randoms',randomsRouter);

// sockets
io.on('connection',async (socket) => {

    //mensaje de usuario conectado
    console.log('Usuario conectado'); 

    // socket para productos con faker
    socket.emit('productosFaker',productos.RandomProducts());

    //socket para chat
    socket.on('nuevoMensaje',async data => {
        try{
            await chat.addMessage(data);
            const mensajes = await chat.readMessages();
            io.sockets.emit('historialGlobal',mensajes);
        }catch (e){
            console.log(`Ha ocurrido el siguiente error: ${e}`);
        }
    });
    try{
        const mensajes = await chat.readMessages();
        socket.emit('historialChat',mensajes);
    }catch (e){
        console.log(`Ha ocurrido el siguiente error: ${e}`);
    }
});

if(args.modo === 'CLUSTER'){
    if(cluster.isPrimary){
        console.log(`Master ${process.pid} is running`);
        for (let i = 0; i < cpus; i++) {
            cluster.fork();        
        }
        cluster.on('exit',(worker, code, signal) => {
            console.log(`worker ${worker.process.pid} died`);
            cluster.fork();
        });
    }else{
        httpserver.listen(args.puerto, () => {
            console.log(`proceso ${process.pid} corriendo en el puerto ${args.puerto}`);
        });   
        console.log(`worker ${process.pid} is running`);
    }
}else if(args.modo === 'FORK' || !args.modo){
    httpserver.listen(args.puerto, () => {
        console.log(`proceso ${process.pid} corriendo en el puerto ${args.puerto}`);
    });   
}