var grassTile = new Image();
grassTile.src = "assets/tiles/grassTile.png"

var playerImg = new Image();
playerImg.src = "assets/ball.png"

var ledgeImg = new Image();
ledgeImg.src = "assets/worldObjects/ledge.png"

var midFence = new Image();
midFence.src = "assets/worldObjects/fenceMiddle.png"

var vertFence = new Image();
vertFence.src = "assets/worldObjects/fenceVertical.png"

var leftDownFence = new Image();
leftDownFence.src = "assets/worldObjects/fenceLeftDown.png"

var leftUpFence = new Image();
leftUpFence.src = "assets/worldObjects/fenceLeftUp.png"

var rightUpFence = new Image();
rightUpFence.src = "assets/worldObjects/fenceRightUp.png"

var rightDownFence = new Image();
rightDownFence.src = "assets/worldObjects/fenceRightDown.png"

var tiles = [grassTile];
var characters = [playerImg];
var colidables = [ledgeImg,midFence,vertFence,leftDownFence,leftUpFence,rightUpFence,rightDownFence];