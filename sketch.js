var START=0
var PLAY = 1;
var END = 2
;
var gameState = START;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var trexdown;
var bird, birdImage;
var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score=0;
var trexstartImg;

var gameOver, restart;

localStorage["HighestScore"] = 0;

function preload(){
  trex_running =   loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  trexstartImg=loadAnimation("trex1.png")
  groundImage = loadImage("ground2.png");
  trexdown=loadAnimation("offline-sprite-2x (1).png")
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  birdImage=loadImage("offline-sprite-2x (3).png")
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  createCanvas(600, 200);
  
  trex = createSprite(50,180,20,50);
  
  trex.addAnimation("start", trexstartImg);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.addAnimation("down", trexdown);
  trex.scale = 0.5;
  
  ground = createSprite(200,180,100000,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
 // ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(300,190 ,1000000,10);
  invisibleGround.visible = false;
  invisibleGround.x=camera.position.x
 
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
  trex.setCollider("circle",0,0,30)
  trex.debug=true
}

function draw() {
  //trex.debug = true;
  background(255);
  fill(0);
  stroke(5)
  text("Score: "+ score, camera.position.x+200,50);
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }
 //console.log(localStorage["HighestScore"]);
  text("HI Score "+ localStorage["HighestScore"], camera.position.x+100, 50);
  
  if(gameState===START){
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    if(keyDown("space") || keyDown("UP_ARROW") ){
  
      gameState=PLAY
    
  }
    
  }
  trex.x=camera.position.x-250
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
   // ground.velocityX = -(6 + 3*score/100);
  camera.position.x+=6
  trex.changeAnimation("running", trex_running);
    
    if(keyDown("DOWN_ARROW")){
      
      trex.changeAnimation("down", trexdown)
    }
    if(keyDown("space") && trex.y >= 159 || keyDown("UP_ARROW")&& trex.y>=159) {
      trex.velocityY = -12;
    }
    trex.velocityY = trex.velocityY + 0.8
  
    if (camera.position.x> ground.width/2+300){
      camera.position.x=300
       obstaclesGroup.destroyEach()
    }
    
    spawnClouds();
    spawnObstacles();
    Bird();
  
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    gameOver.x=camera.position.x
    restart.x=camera.position.x
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
  trex.collide(invisibleGround);
  
  drawSprites();
  
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(camera.position.x,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 70 === 0) {
    var obstacle = createSprite(camera.position.x,165,10,40);
    //obstacle.debug = true;
   // obstacle.velocityX = -3 ;
     obstacle.x=Math.round(random(600,500))
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  camera.position.x=300
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  
   
  
  score = 0;
  
 
}


function Bird(){
  if(frameCount%150===0){
    bird=createSprite(camera.position.x, 100, 10, 10);
    bird.addImage(birdImage);
    bird.velocityX=-4;
    bird.lifetime=300;
    bird.y=Math.round(random(60, 100))
  }
  
}