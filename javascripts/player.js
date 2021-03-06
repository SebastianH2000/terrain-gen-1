var player = {
    x: 0,
    y: 0,
    velX: 0,
    velY: 0,
    maxXVel: 5,
    gravity: 0.2,
    chunkX: Math.round(this.x / 256),
    chunkY: Math.round(this.y / 256),
    windowX1: Math.floor((this.x - (canX / 2)) / 256) - 1,
    windowY1: Math.floor((this.y - (canY / 2)) / 256) - 1,
    windowX2: Math.ceil((this.x + (canX / 2)) / 256) + 1,
    windowY2: Math.ceil((this.y + (canY / 2)) / 256) + 1,
    spectate: false,
    isGrounded: true,
    underwater: false,
    tileAbove: false,
    tileBelow: false,
    tileLeft: false,
    tileRight: false,
    inventory: [{},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},],
    hotbarSelect: 0,
    calcStats(val) {
        this.chunkX = Math.round(this.x / 256);
        this.chunkY = Math.round(this.y / 256);
        /*this.windowX1 = Math.floor(((this.x - (canX / 2)) / 256)/screenScale) - 1;
        this.windowY1 = Math.floor(((this.y - (canY / 2)) / 256)/screenScale) - 1;
        this.windowX2 = Math.ceil(((this.x + (canX / 2)) / 256)/screenScale) + 1;
        this.windowY2 = Math.ceil(((this.y + (canY / 2)) / 256)/screenScale) + 1;*/
        this.windowX1 = Math.floor((this.x - ((canX / 2)/screenScale)) / 256) - 1;
        this.windowY1 = Math.floor((this.y - ((canY / 2)/screenScale)) / 256) - 1;
        this.windowX2 = Math.ceil((this.x + ((canX / 2)/screenScale)) / 256) + 1;
        this.windowY2 = Math.ceil((this.y + ((canY / 2)/screenScale)) / 256) + 1;

        if (pixelToWorldTile(this.x,this.y-32).materialType === 2 || pixelToWorldTile(this.x-16,this.y-32).materialType === 2 || pixelToWorldTile(this.x+16,this.y-32).materialType === 2 || pixelToWorldTile(this.x,this.y-24).materialType === 2 || pixelToWorldTile(this.x-16,this.y-24).materialType === 2 || pixelToWorldTile(this.x+16,this.y-24).materialType === 2) {
            this.underwater = true;
        }
        else {
            if (this.underwater && this.velY > 0) {
                this.velY --;
            }
            this.underwater = false;
        }
        if (pixelToWorldTile(this.x,this.y-33).materialType === 1 || pixelToWorldTile(this.x-15,this.y-33).materialType === 1 || pixelToWorldTile(this.x+15,this.y-33).materialType === 1) {
            this.isGrounded = true;
        }
        else {
            this.isGrounded = false;
        }
        if (pixelToWorldTile(this.x-15,this.y+32+Math.max(player.velY,0)).materialType === 1 || pixelToWorldTile(this.x,this.y+32+Math.max(player.velY,0)).materialType === 1 || pixelToWorldTile(this.x+15,this.y+32+Math.max(player.velY,0)).materialType === 1) {
            this.tileAbove = true;
        }
        else if (pixelToWorldTile(this.x-15,this.y+40).materialType !== 1 && pixelToWorldTile(this.x,this.y+40).materialType !== 1 && pixelToWorldTile(this.x+15,this.y+40).materialType !== 1) {
            this.tileAbove = false;
        }
        if (pixelToWorldTile(this.x-15,this.y-32+Math.min(player.velY,0)).materialType === 1 || pixelToWorldTile(this.x,this.y-32+Math.min(player.velY,0)).materialType === 1 || pixelToWorldTile(this.x+15,this.y-32+Math.min(player.velY,0)).materialType === 1) {
            this.tileBelow = true;
        }
        else if (pixelToWorldTile(this.x-15,this.y-40).materialType !== 1 && pixelToWorldTile(this.x,this.y-40).materialType !== 1 && pixelToWorldTile(this.x+15,this.y-40).materialType !== 1) {
            this.tileBelow = false;
        }
        if (pixelToWorldTile(this.x-16+Math.min(player.velX,0),this.y-12).materialType === 1 || pixelToWorldTile(this.x-16+Math.min(player.velX,0),this.y).materialType === 1 || pixelToWorldTile(this.x-16+Math.min(player.velX,0),this.y+16).materialType === 1 || pixelToWorldTile(this.x-16+Math.min(player.velX,0),this.y+31).materialType === 1) {
            this.tileLeft = true;
        }
        else if (pixelToWorldTile(this.x-24,this.y-12).materialType !== 1 && pixelToWorldTile(this.x-24,this.y).materialType !== 1 && pixelToWorldTile(this.x-24,this.y+16).materialType !== 1 && pixelToWorldTile(this.x-24,this.y+31).materialType !== 1) {
            this.tileLeft = false;
        }
        if (pixelToWorldTile(this.x+16+Math.max(player.velX,0),this.y-12).materialType === 1 || pixelToWorldTile(this.x+16+Math.max(player.velX,0),this.y).materialType === 1 || pixelToWorldTile(this.x+16+Math.max(player.velX,0),this.y+16).materialType === 1 || pixelToWorldTile(this.x+16+Math.max(player.velX,0),this.y+31).materialType === 1) {
            this.tileRight = true;
        }
        else if (pixelToWorldTile(this.x+24,this.y-12).materialType !== 1 && pixelToWorldTile(this.x+24,this.y).materialType !== 1 && pixelToWorldTile(this.x+24,this.y+16).materialType !== 1 && pixelToWorldTile(this.x+24,this.y+31).materialType !== 1) {
            this.tileRight = false;
        }
    },
    applyPhysics() {
        if (player.velY < 0 && this.tileBelow) {
            player.velY = 0;
            player.y = Math.min(Math.floor((player.y+1)/16)*16);
        }
        else if (!this.tileBelow) {
            player.velY -= player.gravity;
        }
        if (this.underwater && player.velY < -3.5) {
            player.velY = -3.5;
        }

        //check left side for bumps
        if (player.velX < 0 && this.tileLeft) {
            player.velX = 0;
            player.x = Math.min(Math.floor((player.x)/16)*16,player.x+player.velX);
        }

        //check right side for bumps
        else if (player.velX > 0 && this.tileRight) {
            player.velX = 0;
            player.x = Math.min(Math.ceil((player.x)/16)*16,player.x+player.velX);
        }
        else {
            player.x += player.velX;
            if (player.isGrounded && !this.tileAbove) {
                if (!this.tileAbove && pixelToWorldTile(this.x,this.y-26).materialType === 1 || pixelToWorldTile(this.x-15+Math.min(this.velX,0),this.y-26).materialType === 1 || pixelToWorldTile(this.x+15+Math.max(this.velX,0),this.y-26).materialType === 1) {
                    this.y += 8;
                    console.log('bigs');
                }
                else if (!this.tileAbove && pixelToWorldTile(this.x,this.y-30).materialType === 1 || pixelToWorldTile(this.x-15+Math.min(this.velX,0),this.y-30).materialType === 1 || pixelToWorldTile(this.x+15+Math.max(this.velX,0),this.y-30).materialType === 1) {
                    //this.y += 2;
                }
            }
        }

        //add friction
        if (player.velX < 0) {
            player.velX = Math.min(player.velX+0.5,0);
        }
        else if (player.velX > 0) {
            player.velX = Math.max(player.velX-0.5,0);
        }

        //check head for bumps
        if (player.velY > 0 && this.tileAbove) {
            player.velY = 0;
            player.y = Math.max(Math.floor((player.y+16)/16)*16,player.y+player.velY);
        }
        else {
            player.y += player.velY;
        }
    },
}

function playerOnMove() {
    //console.log("he")
    scanChunks();
    player.calcStats();
    player.applyPhysics();
}

function playerJump() {
    //playerOnMove();
    if (player.spectate) {
        player.y += 5;
    }
    else {
        if (player.isGrounded && !player.tileAbove) {
            player.velY = 7;
        }
    }
}

function playerDown() {
    //playerOnMove();
    if (player.spectate) {
        player.y -= 5;
    }
    else {
        /*let testX1 = player.x;
        let testX2 = player.x;
        let testX3 = player.x;
        let testX1 = player.x;
        let testX2 = player.x-16;
        let testX3 = player.x+16;
        let testY = player.y-32;
        if (pixelToWorldTile(testX1,testY).materialType !== 0 || pixelToWorldTile(testX2,testY).materialType !== 0 || pixelToWorldTile(testX3,testY).materialType !== 0) {
            /*World[toBijective(Math.floor(testX1/256))][toBijective(Math.floor(testY/256)+1)]["x" + Math.floor(absMod(Math.floor(testX1/16),16)+1) + "y" + Math.floor(absMod(Math.floor(testY/16),16)+1)] = '0000';
            World[toBijective(Math.floor(testX1/256))][toBijective(Math.floor(testY/256)+1)]["x" + Math.floor(absMod(Math.floor(testX1/16),16)+1) + "y" + Math.floor(absMod(Math.floor(testY/16),16)+1)] = '0000';
            drawWorldCan(Math.floor(testX1/256),Math.floor(testY/256)+1);
            drawWorldCan(Math.floor(testX2/256),Math.floor(testY/256)+1);
            deleteTile(testX1,testY);
            deleteTile(testX2,testY);
            deleteTile(testX3,testY);
        }
        */
    }
    //Math.floor(x/16),Math.floor((y+256)/16)
    //toBijective(Math.floor(x/16))
    //World[xPos][yPos]["x" + Math.floor(absMod(x,16)+1) + "y" + Math.floor(absMod(y,16)+1)]
}

function playerRight() {
    //playerOnMove();
    if (player.spectate) {
        player.x += 5;
    }
    else if (!player.tileRight){
        player.velX++;
        player.velX = Math.min(player.velX,player.maxXVel);
    }
    else {
        player.x = Math.max(Math.ceil((player.x)/16)*16,player.x+player.velX);
    }
    /*if (pixelToWorldTile(player.x+19,player.y-8).materialType !== 1) {
        player.x += 5;
    }
    else if (pixelToWorldTile(player.x+16,player.y-8).materialType === 1 || pixelToWorldTile(player.x+16,player.y+8).materialType === 1 || pixelToWorldTile(player.x+16,player.y+24).materialType === 1 || pixelToWorldTile(player.x+16,player.y+32).materialType === 1) {
        player.x--;
    }*/
}

function playerLeft() {
    //playerOnMove();
    if (player.spectate) {
        player.x -= 5;
    }
    else {
        player.velX--;
        player.velX = Math.max(player.velX,0-player.maxXVel);
    }
}





function checkPlayerMovement() {
    if ((map[87] === true || map[38] === true) && (map[83] === false && map[40] === false) && (map[65] === false && map[37] === false) && (map[68] === false && map[39] === false)) {
        playerJump();
    }
    //s
    else if ((map[87] === false && map[38] === false) && (map[83] === true || map[40] === true) && (map[65] === false && map[37] === false) && (map[68] === false && map[39] === false)) {
        playerDown();
    }
    //a
    else if ((map[87] === false && map[38] === false) && (map[83] === false && map[40] === false) && (map[65] === true || map[37] === true) && (map[68] === false && map[39] === false)) {
        playerLeft();
    }
    //d
    else if ((map[87] === false && map[38] === false) && (map[83] === false && map[40] === false) && (map[65] === false && map[37] === false) && (map[68] === true || map[39] === true)) {
        //playerX += (playerSpeed*10)/fps;
        playerRight();
    }



    //w+a
    if ((map[87] === true || map[38] === true) && (map[65] === true || map[37] === true)) {
        //playerY += (playerSpeed*7)/fps;
        //playerX -= (playerSpeed*7)/fps;
        playerJump();
        playerLeft();
    }
    //w+d
    if ((map[87] === true || map[38] === true) && (map[68] === true || map[39] === true)) {
        playerJump();
        playerRight();
    }
    //s+a
    if ((map[83] === true || map[40] === true) && (map[65] === true || map[37] === true)) {
        playerDown();
        playerLeft();
    }
    //s+d
    if ((map[83] === true || map[40] === true) && (map[68] === true || map[39] === true)) {
        playerDown();
        playerRight();
    }

    if (map[49]) {
        player.hotbarSelect = 0;
    }
    else if (map[50]) {
        player.hotbarSelect = 1;
    }
    else if (map[51]) {
        player.hotbarSelect = 2;
    }
    else if (map[52]) {
        player.hotbarSelect = 3;
    }
    else if (map[53]) {
        player.hotbarSelect = 4;
    }
    else if (map[54]) {
        player.hotbarSelect = 5;
    }
    else if (map[55]) {
        player.hotbarSelect = 6;
    }
    else if (map[56]) {
        player.hotbarSelect = 7;
    }
    else if (map[57]) {
        player.hotbarSelect = 8;
    }
    else if (map[58]) {
        player.hotbarSelect = 9;
    }
}

//key pressed function
var map = {}; // You could also use an array
//wsad
map[87] = false;
map[83] = false;
map[65] = false;
map[68] = false;

//^v<>
map[38] = false;
map[40] = false;
map[37] = false;
map[39] = false;

map[32] = false;

onkeydown = onkeyup = function (e) {
    e = e || event; // to deal with IE
    map[e.keyCode] = e.type == 'keydown';
    /* insert conditional here */
}
