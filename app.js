const express = require('express');
const app = express();

const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

const port = 3000;

app.use(express.static('public'));

app.get('/', (req,res) => {
    res.sendFile(__direname + "/index.html");
})

server.listen(port,() => {
    console.log("app did load");
})

io.on('connection', (socket) => {
    console.log("New User: " + socket.id);
    let p = new Player(100,80,0,socket.id);
    socket.emit('firstDrawings',(drawings));
    socket.emit('drawPlayers',(players))


    socket.on('movePlayer',(key) =>{
        for(let i = 0; i < players.length; i++){
            if(players[i].id == socket.id){
                if(key == "w"){
                    players[i].keys.w = true;
                } 
                if(key == "s"){
                    players[i].keys.s = true;
                }
                if(key == "a"){
                    players[i].keys.a = true;
                } 
                if(key == "d"){
                    players[i].keys.d = true;
                }
            }
        }
    })
    socket.on('stopPlayer',(key) =>{
        for(let i = 0; i < players.length; i++){
            if(players[i].id == socket.id){
                if(key == "w"){
                    players[i].keys.w = false;
                } 
                if(key == "s"){
                    players[i].keys.s = false;
                }
                if(key == "a"){
                    players[i].keys.a = false;
                } 
                if(key == "d"){
                    players[i].keys.d = false;
                }
            }
        }
    })

    socket.on('disconnect',(reason) =>{
        for(let i = 0; i < players.length; i++){
            if(players[i].id == socket.id){
                players.splice(i,1);
            }
        }
        for(let i = 0; i < drawings.length; i++){
            if((drawings[i].id != null) && (drawings[i].id == socket.id)){
                drawings.splice(i,1)
            }
        }
        console.log("Player Disconnect: " + socket.id + " Reason:" + reason)
    })


    function socketGameTick(){
        setTimeout(function(){
            socketGameTick();
        },8)

        socket.emit('drawPlayers',(players))

    }
    socketGameTick();
})



var drawings = [];


class Drawing{
    constructor(x,y,w,h,image){
        this.x = x;
        this.y = y;
        this.height = h;
        this.width = w;
        this.imageNum = image;
        this.type = "abstract"
    }
}
class Tile extends Drawing{
    constructor(x,y,image){
        super(x,y,50,50,image);
        this.type = "tile";
        drawings.push(this)
    }
}
class Player extends Drawing{
    constructor(x,y,image,id){
        super(x,y,30,30,image);
        this.id = id;
        this.type = "character";
        this.keys = {
            w:false,
            a:false,
            s:false,
            d:false
        }
        players.push(this);
    }

    move(){
        if(this.keys.w){
            this.y -= 10;
        }
        if(this.keys.s){
            this.y += 10;
        }
        if(this.keys.a){
            this.x -= 10;
        }
        if(this.keys.d){
            this.x += 10;
        }
    }
}

var players = []

for(let y = 0; y < 10; y++){
    for(let x = 0; x < 10; x++){
    let block = new Tile(50 * x,50 * y,0);
    }
}

function gameTick(){
    setTimeout(function(){
        gameTick();
    },8)

    for(let i = 0; i < players.length; i++){
        players[i].move();
    }

}
gameTick();

