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
    let p = new Player(700,300,0,socket.id);
    socket.emit('firstDrawings',(layers));
    socket.emit('drawPlayers',(layers[2]))


    socket.on('movePlayer',(key) =>{
        for(let i = 0; i < layers[2].length; i++){
            if(layers[2][i].id == socket.id){
                if(key == "w"){
                    layers[2][i].keys.w = true;
                } 
                if(key == "s"){
                    layers[2][i].keys.s = true;
                }
                if(key == "a"){
                    layers[2][i].keys.a = true;
                } 
                if(key == "d"){
                    layers[2][i].keys.d = true;
                }
            }
        }
    })
    socket.on('stopPlayer',(key) =>{
        for(let i = 0; i < layers[2].length; i++){
            if(layers[2][i].id == socket.id){
                if(key == "w"){
                    layers[2][i].keys.w = false;
                } 
                if(key == "s"){
                    layers[2][i].keys.s = false;
                }
                if(key == "a"){
                    layers[2][i].keys.a = false;
                } 
                if(key == "d"){
                    layers[2][i].keys.d = false;
                }
            }
        }
    })

    socket.on('disconnect',(reason) =>{
        for(let i = 0; i < layers[2].length; i++){
            if(layers[2][i].id == socket.id){
                layers[2].splice(i,1);
            }
        }
        for(let i = 0; i < layers[0].length; i++){
            if((layers[0][i].id != null) && (layers[0][i].id == socket.id)){
                layers[0].splice(i,1)
            }
        }
        console.log("Player Disconnect: " + socket.id + " Reason:" + reason)
    })


    function socketGameTick(){
        setTimeout(function(){
            socketGameTick();
        },8)

        socket.emit('drawPlayers',(layers[2]))

    }
    socketGameTick();
})



var layers = [[],[],[]];
/*  
    0 = world elements
    1 = players
*/

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
        layers[0].push(this)
    }
}
class Colidable extends Drawing{
    constructor(x,y,w,h,image){
        super(x,y,w,h,image);
        layers[1].push(this);
    }
}
class Player extends Drawing{
    constructor(x,y,image,id){
        super(x,y,30,30,image);
        this.startX = x;
        this.startY = y;
        this.id = id;
        this.moveSpeed = 5;
        this.type = "character";
        this.keys = {
            w:false,
            a:false,
            s:false,
            d:false
        }
        layers[2].push(this);
    }

    move(){
        let moveX = 0;
        let moveY = 0;
        if(this.keys.w){
            moveY -= this.moveSpeed;
        }
        if(this.keys.s){
            moveY += this.moveSpeed;
        }
        if(this.keys.a){
            moveX -= this.moveSpeed;
        }
        if(this.keys.d){
            moveX += this.moveSpeed;
        }

        this.x += moveX;
        let returned = false;

        for(let i = 0; i < layers[1].length; i++){
            if((!returned)&&(isColide(this,layers[1][i]))){
                this.x -= moveX;
                returned = true
            }
        }

        returned = false;
        this.y += moveY;

        for(let i = 0; i < layers[1].length; i++){
            if((!returned)&&(isColide(this,layers[1][i]))){
                this.y -= moveY;
                returned = true
            }
        }
    }
}


for(let y = 0; y < 20; y++){
    for(let x = 0; x < 30; x++){
    let block = new Tile(50 * x,50 * y,0);
    }
}

for(let x = 0; x < 30; x++){
    let block = new Colidable(50 * x,50 * 20,50,50,0);
    block = new Colidable(50 * x,-50,50,50,0);
}
for(let y = 0; y < 20; y++){
    let block = new Colidable(-50,50 * y,50,50,0);
    block = new Colidable(50 * 30,50 * y,50,50,0);
}

function gameTick(){
    setTimeout(function(){
        gameTick();
    },8)

    for(let i = 0; i < layers[2].length; i++){
        layers[2][i].move();
    }

}
function isColide(a,b){
    if((a.x < b.x + b.width) && (b.x < a.x + a.width) && (a.y < b.y + b.height) && (b.y < a.y + a.height)){
        return(true);
        
    }
    return(false);
}
gameTick();

