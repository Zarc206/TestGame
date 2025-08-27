var canvas = document.getElementById('frame');
var ctx = canvas.getContext('2d');
canvas.style.position = "absolute"
canvas.style.left = 0;
canvas.style.top = 0;
canvas.width = screen.width;
canvas.height = screen.height

const socket = io();

var drawings = []
var players = []
var camera = {
    x:0,
    y:0
}

socket.on('firstDrawings',(serverDrawings) =>{
    drawings = serverDrawings[0];
    players = serverDrawings[2]
})
socket.on('drawPlayers',(serverPlayers) =>{
    players = serverPlayers;
    for(let i = 0; i < players.length; i++){
        if(players[i].id == socket.id){
            camera.x = players[i].x - players[i].startX;
            camera.y = players[i].y - players[i].startY;
        }
    }
})

function animate(){
    window.requestAnimationFrame(animate);
    ctx.fillStyle = "white"
    ctx.fillRect(0,0,canvas.width, canvas.height)
    for(let i = 0; i < drawings.length; i++){
        let img;
        if(drawings[i].type == "tile"){
            img = tiles[drawings[i].imageNum];
        }
        if(drawings[i].type == "character"){
            img = characters[drawings[i].imageNum];
        }
        ctx.drawImage(img,drawings[i].x - camera.x,drawings[i].y-camera.y,drawings[i].width,drawings[i].height);
    }
    for(let i = 0; i < players.length; i++){
        let img;
        if(players[i].type == "tile"){
            img = tiles[players[i].imageNum];
        }
        if(players[i].type == "character"){
            img = characters[players[i].imageNum];
        }
        ctx.drawImage(img,players[i].x - camera.x,players[i].y - camera.y,players[i].width,players[i].height);
    }
}
function playerInputs(e){
    socket.emit('movePlayer',(e.key));
}
function playerReleases(e){
    socket.emit('stopPlayer',(e.key));
}
animate();

window.addEventListener('keydown',playerInputs);
window.addEventListener('keyup',playerReleases);