const { dir } = require('console');
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
    p.y = 900;
    
    socket.emit('firstDrawings',(locations[0]));
    socket.emit('drawPlayers',(locations[0][4]));

    socket.on('movePlayer',(key) =>{
        for(let ii = 0; ii < locations.length; ii++){
            for(let i = 0; i < locations[ii][4].length; i++){
                if(locations[ii][4][i].id == socket.id){
                    if((key == "w")||(key == "W")){
                        locations[ii][4][i].keys.w = true;
                    } 
                    if((key == "s")||(key == "S")){
                        locations[ii][4][i].keys.s = true;
                    }
                    if((key == "a")||(key == "A")){
                        locations[ii][4][i].keys.a = true;
                    } 
                    if((key == "d")||(key == "D")){
                        locations[ii][4][i].keys.d = true;
                    }
                    if((key == "p")||(key == "P")){
                        locations[ii][4][i].keys.p = true;
                    }
                    if(key == "Shift"){
                        locations[ii][4][i].keys.shift = true;
                    }
                    if((key == "o")||(key == "O")){
                        
                        let xOff = 0;
                        let yOff = 0;
                        let player = locations[ii][4][i]
                        if(player.aiming){
                            player.projectileCapsules.push(new ProjectileCapsule(player.x + 10,player.y + 10,player.aimDirection,player.location))
                        } else {
                            if(player.direction == "w"){
                                yOff = -30;
                            }
                            if(player.direction == "s"){
                                yOff = 30;
                            }
                            if(player.direction == "a"){
                                xOff = -30;
                            }
                            if(player.direction == "d"){
                                xOff = 30;
                            }
                            let b = new Hitbox(player.x + xOff,player.y + yOff,player.width,player.height,player.location);
                            for(let i = 0; i < locations[player.location][3].length; i++){
                                if((locations[player.location][3][i].interact != null)&&(isColide(b,locations[player.location][3][i]))){
                                    locations[player.location][3][i].interact(socket.id); 
                                }
                            }  
                        }
                    }
                }
            }
        }
    })
    socket.on('stopPlayer',(key) =>{
        for(let ii = 0; ii < locations.length; ii++){
            for(let i = 0; i < locations[ii][4].length; i++){
                if(locations[ii][4][i].id == socket.id){
                    if((key == "w")||(key == "W")){
                        locations[ii][4][i].keys.w = false;
                    } 
                    if((key == "s")||(key == "S")){
                        locations[ii][4][i].keys.s = false;
                    }
                    if((key == "a")||(key == "A")){
                        locations[ii][4][i].keys.a = false;
                    } 
                    if((key == "d")||(key == "D")){
                        locations[ii][4][i].keys.d = false;
                    }
                    if((key == "p")||(key == "P")){
                        locations[ii][4][i].keys.p = false;
                    }
                    if(key == "Shift"){
                        locations[ii][4][i].keys.shift = false;
                    }
                }
            }
        }
    })

    socket.on('disconnect',(reason) =>{
        for(let ii = 0; ii < locations.length; ii++){
            for(let i = 0; i < locations[ii][4].length; i++){
                if(locations[ii][4][i].id == socket.id){
                    locations[ii][4].splice(i,1);
                }
            }
            for(let i = 0; i < locations[ii][0].length; i++){
                if((locations[ii][0][i].id != null) && (locations[ii][0][i].id == socket.id)){
                    locations[ii][0].splice(i,1)
                }
            }
            console.log("Player Disconnect: " + socket.id + " Reason:" + reason)
        }
    })


    function socketGameTick(){
        setTimeout(function(){
            socketGameTick();
        },8)

        for(let i = 0; i < locations.length; i++){
            for(let ii = 0; ii < locations[i][4].length; ii++){
                if(locations[i][4][ii].id == socket.id){
                    while(locations[i][4][ii].messages.length > 0){
                        socket.emit("textBox",locations[i][4][ii].messages[0]);
                        locations[i][4][ii].messages.splice(0,1);
                    }
                    socket.emit('drawPlayers',([locations[locations[i][4][ii].location][3],locations[locations[i][4][ii].location][4]]))
                    if(locations[i][4][ii].location != locations[i][4][ii].moveLocation){
                        locations[i][4][ii].location = locations[i][4][ii].moveLocation;
                        locations[locations[i][4][ii].location][4].push(locations[i][4][ii]);
                        socket.emit('firstDrawings',(locations[locations[i][4][ii].location]));
                        locations[i][4].splice(ii,1);
                    }
                }

            }
        }

    }
    socketGameTick();
})

var locations = [[[],[],[],[],[]],[[],[],[],[],[]]];

var layers = [[],[],[],[]];
/*  
    0 = world elements
    1 = colidables
    2 = nonColidables
    3 = creatures
    4 = players
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
    constructor(x,y,image,location){
        super(x,y,50,50,image);
        this.location = location;
        this.type = "tile";
        locations[this.location][0].push(this)
    }
}
class Colidable extends Drawing{
    constructor(x,y,w,h,image,location){
        super(x,y,w,h,image);
        this.location = location;
        locations[this.location][1].push(this);
        this.type = "colidable";
    }
}
class nonColidable extends Drawing{
    constructor(x,y,w,h,image,location){
        super(x,y,w,h,image);
        this.location = location;
        locations[this.location][2].push(this);
        this.type = "nonColidable";
    }
}
class Player extends Drawing{
    constructor(x,y,image,id){
        super(x,y,30,30,image);
        this.startX = x;
        this.startY = y;
        this.id = id;
        this.moveSpeed = 3;
        this.type = "character";
        this.keys = {
            w:false,
            a:false,
            s:false,
            d:false,
            p:false,
            shift:false
        }
        this.location = 0;
        this.moveLocation = 0;
        this.direction = "s";
        this.messages = [];
        this.capsules = 0;
        this.projectileCapsules = [];
        this.aiming = true;
        this.aimDirection = 0;

        locations[this.location][4].push(this);
    }

    move(){

        for(let i = 0; i < this.projectileCapsules.length; i++){
            this.projectileCapsules[i].move();
            if(this.projectileCapsules[i].deleted){
                this.projectileCapsules.splice(i,1);
                i--;
            }
        }

        let moveX = 0;
        let moveY = 0;
        let speedMult = 1

        if((this.keys.shift) && (this.capsules > 0)){
            this.aiming = true;
        } else {
            this.aiming = false;
        }
        if(this.keys.p){
            speedMult = 1.5;
        }
        if(this.keys.w){
            if(!this.keys.shift){
                moveY -= this.moveSpeed * speedMult;
                this.direction = "w"
            }
        }
        if(this.keys.s){
            if(!this.keys.shift){
                moveY += this.moveSpeed * speedMult;
                this.direction = "s"
            }
        }
        if(this.keys.a){
            if(this.keys.shift){
                this.aimDirection -= 0.1
                if(this.aimDirection < 0){
                    this.aimDirection += 2 * Math.PI
                }
            } else {
                moveX -= this.moveSpeed * speedMult;
                this.direction = "a"
            }
        }
        if(this.keys.d){
            if(this.keys.shift){
                this.aimDirection += 0.1
            } else {
                moveX += this.moveSpeed * speedMult;
                this.direction = "d"
            }
        }

        this.x += moveX;
        let returned = false;

        for(let i = 0; i < locations[this.location][1].length; i++){
            if((!returned)&&(isColide(this,locations[this.location][1][i]))){
                this.x -= moveX;
                returned = true
            }
        }
        for(let i = 0; i < locations[this.location][3].length; i++){
            if((!returned)&&(isColide(this,locations[this.location][3][i]))){
                this.x -= moveX;
                returned = true
            }
        }

        returned = false;
        this.y += moveY;

        for(let i = 0; i < locations[this.location][1].length; i++){
            if((!returned)&&(isColide(this,locations[this.location][1][i]))){
                this.y -= moveY;
                returned = true
            }
        }
        for(let i = 0; i < locations[this.location][3].length; i++){
            if((!returned)&&(isColide(this,locations[this.location][3][i]))){
                this.y -= moveY;
                returned = true
            }
        }

        for(let i = 0; i < locations[this.location][0].length; i++){
            if((locations[this.location][0][i].type == "teleporter") && (isColide(locations[this.location][0][i],this))){
                this.moveLocation = locations[this.location][0][i].location2;
            }
        }
    }
}
class Creature extends Drawing{
    constructor(x,y,image,location){
        super(x,y,30,30,image);
        this.type = "character"
        this.location = location
        locations[this.location][3].push(this)
        
        this.behevior = "random"
    }   
    move(){
        if(this.behevior != null){
            if(this.behevior == "random"){
                if(Math.random() > 0.99){
                    let direction = Math.floor(Math.random() * 4)
                    if(direction == 1){
                        this.behevior = "right"
                    } 
                    if(direction == 0){
                        this.behevior = "left"
                    }
                    if(direction == 2){
                        this.behevior = "up"
                    } 
                    if(direction == 3){
                        this.behevior = "down"
                    }
                }
            } else {
                let moveX = 0;
                let moveY = 0;
                if(this.behevior == "right"){
                    moveX -= 1 * Math.random()
                }
                if(this.behevior == "left"){
                    moveX += 1
                }
                if(this.behevior == "up"){
                    moveY -= 1
                }
                if(this.behevior == "down"){
                    moveY += 1
                }
                let returned = false

                this.x += moveX

                for(let i = 0; i < locations[this.location][1].length; i++){
                    if((!returned)&&(isColide(this,locations[this.location][1][i]))){
                        this.x -= moveX;
                        returned = true
                    }
                }

                returned = false;
                this.y += moveY;

                for(let i = 0; i < locations[this.location][1].length; i++){
                    if((!returned)&&(isColide(this,locations[this.location][1][i]))){
                        this.y -= moveY;
                        returned = true
                    }
                }

                if(Math.random() > 0.99){
                    this.behevior = "random";
                }
            }
        }
    }
}
class Teleporter extends Tile{
    constructor(x,y,location,location2){
        super(x,y,-1,location);
        this.location2 = location2;
        this.type = "teleporter";   
    }   
}
class Hitbox{
    constructor(x,y,w,h,location){
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        this.location = location;
    }
}
class ProjectileCapsule{
    constructor(x,y,direction,location){
        this.x = x;
        this.y = y;
        this.width = 10;
        this.height = 10;
        this.direction = direction;
        this.speed = 7;
        this.location = location;
        this.deleted = false
    }

    move(){
        this.x += Math.cos(this.direction) * this.speed;
        this.y += Math.sin(this.direction) * this.speed;
        
        for(let i = 0; i < locations[this.location][1].length; i++){
            if(isColide(this,locations[this.location][1][i])){
                this.deleted = true;
            }
        }
    }
}

let b;

function generateArea0(){
    for(let y = 0; y < 20; y++){
        for(let x = 0; x < 30; x++){
            let block = new Tile(50 * x,50 * y,0,0);
        }
    }
    for(let x = 0; x < 30; x++){
        let block = new Colidable(50 * x,50 * 20,50,50,-1,0);
        block = new Colidable(50 * x,-50,50,50,-1,0);

        if((x > 16) || (x < 12)){    
            block = new Colidable(50 * x,50 * 15,50,50,0,0);
        }

    }
    for(let y = 0; y < 20; y++){
        let block = new Colidable(-50,50 * y,50,50,-1,0);
        block = new Colidable(50 * 30,50 * y,50,50,-1,0);
    }

    for(let x = 0; x < 7; x++){
        block = new Colidable(150 + 50 * x,200,50,50,1,0);
        block = new Colidable(150 + 50 * x,500,50,50,1,0);
    }

    for(let y = 0; y < 5; y++){
        block = new Colidable(100 ,250 + 50 * y,50,50,2,0);
        block = new Colidable(500,250 + 50 * y,50,50,2,0);
    }

    block = new Colidable(500 ,200,50,50,3,0);
    block = new Colidable(500 ,500,50,50,4,0);
    block = new Colidable(100 ,500,50,50,5,0);
    block = new Colidable(100 ,200,50,50,6,0);

    house = new nonColidable(1000,200,350,250,0,0);
    b = new Colidable(1000,200,50,50,-1,0);
    b = new Colidable(1000,250,50,50,-1,0);
    b = new Colidable(1000,300,50,50,-1,0);
    b = new Colidable(1000,350,50,50,-1,0);
    b = new Colidable(1000,400,50,50,-1,0);

    b = new Colidable(1000,200,50,50,-1,0);
    b = new Colidable(1050,200,50,50,-1,0);
    b = new Colidable(1100,200,50,50,-1,0);
    b = new Colidable(1150,200,50,50,-1,0);
    b = new Colidable(1200,200,50,50,-1,0);
    b = new Colidable(1250,200,50,50,-1,0);
    b = new Colidable(1300,200,50,50,-1,0);

    b = new Colidable(1300,250,50,50,-1,0);
    b = new Colidable(1300,300,50,50,-1,0);
    b = new Colidable(1300,350,50,50,-1,0);
    b = new Colidable(1300,400,50,50,-1,0);

    b = new Colidable(1200,400,50,50,-1,0);
    b = new Colidable(1250,400,50,50,-1,0);

    b = new Colidable(1050,400,50,50,-1,0);
    b = new Colidable(1100,400,50,50,-1,0);
    b = new Teleporter(1150,400,0,1);

    b = new Colidable(1150,350,50,50,-1,0);

    b = new Creature(400,300,1,0);
   
}
function generateArea1(){
    b = new Tile(1150,450,1,1);
    b = new Teleporter(1150,450,1,0);
        

    for(let x = 0; x < 13; x++){
        for(let y = 0; y < 13; y++){
            b = new Tile(850 + 50 * x,-200 + 50 * y,1,1);

            if(y == 0){
                b = new Colidable(850+50*x,-250+50*y,50,50,-1,1);
            }
            if(x == 0){
                b = new Colidable(800+50*x,-200+50*y,50,50,-1,1);
            }
            if(x == 12){
                b = new Colidable(900+50*x,-200+50*y,50,50,-1,1);
            }
            if((y == 12) && (x != 6)){
                b = new Colidable(850+50*x,-150+50*y,50,50,-1,1);
            }

        }
    }
    b = new Colidable(1150,500,50,50,-1,1);

    ball = new Creature(1050,-100,2,1);
    ball.behevior = null;
    ball.interact = function(id){
        for(let i = 0; i < locations.length; i++){
            for(let ii = 0; ii < locations[i][4].length; ii++){
                if(locations[i][4][ii].id == id){
                    locations[i][4][ii].messages.push("Hello!");
                    locations[i][4][ii].messages.push("Welcome to the world of bugietown");
                    locations[i][4][ii].messages.push("Here, dangerous and wonderful creatures roam the land...");
                    locations[i][4][ii].messages.push("and I'm going to be the best rancher in the whole world!");
                    locations[i][4][ii].messages.push("Now take these:");
                    locations[i][4][ii].messages.push("(player recieved creature capsules)");
                    locations[i][4][ii].capsules += 10;
                    locations[i][4][ii].messages.push("You're gonna help me capture as many creatures as possible, got it?");
                    
                }
            }
        }
    }


}
function gameTick(){
    setTimeout(function(){
        gameTick();
    },8)
    for(let ii = 0; ii < locations.length; ii++){
        if(locations[ii][4].length != 0){
            for(let i = 0; i < locations[ii][4].length; i++){
                locations[ii][4][i].move();
            }
            for(let i = 0; i < locations[ii][3].length; i++){
                locations[ii][3][i].move();
            }
        }
    }

}
function isColide(a,b){
    if((a.x < b.x + b.width) && (b.x < a.x + a.width) && (a.y < b.y + b.height) && (b.y < a.y + a.height)){
        return(true);
        
    }
    return(false);
}

generateArea0();
generateArea1();
gameTick();