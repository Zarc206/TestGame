var canvas = document.getElementById('frame');
var ctx = canvas.getContext('2d');
canvas.style.position = "absolute"
canvas.style.left = 0;
canvas.style.top = 0;
canvas.width = screen.width;
canvas.height = screen.height

const socket = io();

var drawings = []
var camera = {
    x:0,
    y:0
}

socket.on('firstDrawings',(serverDrawings) =>{
    drawings = [];
    drawings.push(serverDrawings[0]);
    drawings.push(serverDrawings[1]);
    drawings.push(serverDrawings[2]);
    drawings.push(serverDrawings[3]);
})
socket.on('drawPlayers',(serverPlayers) =>{
    console.log(serverPlayers)
    drawings[2] = serverPlayers[0];
    drawings[3] = serverPlayers[1];
    for(let i = 0; i < serverPlayers[1].length; i++){
        if(serverPlayers[1][i].id == socket.id){
            camera.x = serverPlayers[1][i].x - serverPlayers[1][i].startX;
            camera.y = serverPlayers[1][i].y - serverPlayers[1][i].startY;
        }
    }
})

function animate(){
    window.requestAnimationFrame(animate);
    ctx.fillStyle = "white"
    ctx.fillRect(0,0,canvas.width, canvas.height)
    for(let layer = 0; layer < drawings.length; layer++){
        for(let i = 0; i < drawings[layer].length; i++){
            let img;
            if(drawings[layer][i].type == "tile"){
                img = tiles[drawings[layer][i].imageNum];
            }
            if(drawings[layer][i].type == "character"){
                img = characters[drawings[layer][i].imageNum];
            }
            if(drawings[layer][i].type == "colidable"){
                img = colidables[drawings[layer][i].imageNum];
            }
            if(img != null){
                ctx.drawImage(img,drawings[layer][i].x - camera.x,drawings[layer][i].y-camera.y,drawings[layer][i].width,drawings[layer][i].height);
            }
        }
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