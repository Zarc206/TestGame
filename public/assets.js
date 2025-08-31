var grassTile = new Image();
grassTile.src = "assets/tiles/grassTile.png"

var woodFloorTile = new Image();
woodFloorTile.src = "assets/tiles/woodFloorTile.png"

var playerImg = new Image();
playerImg.src = "assets/characters/ball.png"

var ball2Img = new Image();
ball2Img.src = "assets/characters/ball2.png"

var piramidImg = new Image();
piramidImg.src = "assets/characters/piramid.png"

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

var houseImg = new Image();
houseImg.src = "assets/worldObjects/house.png"

var tiles = [grassTile,woodFloorTile];
var characters = [playerImg,piramidImg,ball2Img];
var nonColidables = [houseImg];
var colidables = [ledgeImg,midFence,vertFence,leftDownFence,leftUpFence,rightUpFence,rightDownFence];

var speechBubble = new Image();
speechBubble.src = "assets/speechBubble.png";