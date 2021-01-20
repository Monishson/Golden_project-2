var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var backgroundImg;
var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var birdImg,bigbirdImg,bigdinoImg;
var birdsGroup,bigbirdsGroup,bigdinoGroup;
var score=0;

var gameOver, restart;

localStorage["HighestScore"] = 0;

function preload(){
  trex_running =   loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  backgroundImg = loadImage("background2.jpg");
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");

  birdImg = loadImage("bird.png");
  bigbirdImg = loadImage("bigdinobird.png");
  bigdinoImg = loadImage("bigdino.png");


}

function setup() {
  createCanvas(600, 200);
  
  trex = createSprite(50,180,20,50);
  
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;
  
 ground = createSprite(300,100);
 ground.addImage("ground", backgroundImg );
 ground.scale = 1.25;
 ground.x = ground.width/2 ;
 //ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  birdsGroup = new Group();
  bigbirdsGroup = new Group();
  bigdinoGroup = new Group();

  score = 0;
}

function draw() {
  //trex.debug = true;
  background( "orange" );
  text("Score: "+ score, 500,50);
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -2;
  
    if(keyDown("space") && trex.y >= 159) {
      trex.velocityY = -12;
    }
  
    trex.velocityY = trex.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2 ;
    }
  
    trex.collide(invisibleGround);
    //spawnClouds();
    
    
    if(frameCount>500){
      var r = Math.round(random(1,3));
      if(r===1){
        spawnObstacles();
      }
      else if(r===2){
        spawnBirds();
      }
      else{
        spawnBigdino();
      }
    }
   else{
       spawnObstacles();
   } 
  
    if(obstaclesGroup.isTouching(trex) || birdsGroup.isTouching(trex) || bigdinoGroup.isTouching(trex)){
        gameState = END;
        //trex.velocityY = -12;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    birdsGroup.setVelocityXEach(0);
    bigdinoGroup.setVelocityXEach(0);
    //cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    birdsGroup.setLifetimeEach(-1);
    bigdinoGroup.setLifetimeEach(-1);
    //cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
  
  drawSprites();
}

/*function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
  var cloud = createSprite(600,120,40,10);
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
  
}*/

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,172,10,40);
    //obstacle.debug = true;
    obstacle.velocityX = -(6 + score/100);
    
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

function spawnBirds() {
  if(frameCount % 60 === 0) {
  
     var  bird = createSprite(600,165,10,40);
       bird.y = Math.round(random(120,150));
      //generate random obstacles
      bird.addImage(birdImg);
      bird.scale = 0.5;
   
    bird.velocityX = -(6 + score/100);
    //assign scale and lifetime to the obstacle           
    
    bird.lifetime = 300;
    //add each obstacle to the group
    birdsGroup.add(bird);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }
  console.log(localStorage["HighestScore"]);
  
  score = 0;
  
}

function spawnBigdino() {
  if(frameCount % 100 === 0) {
  var bigdino = createSprite(600,120,10,40);
  bigdino.addImage(bigdinoImg);
  bigdino.scale= 0.5;
    
  var dino = createSprite(600,120,10,5);
  dino.width=bigdino.width/2;
  dino.debug=true;
  dino.velocityX = -(6 + score/100);
   bigdino.velocityX = -(6 + score/100);
    //assign scale and lifetime to the obstacle           
    
    bigdino.lifetime = 300;
    //add each obstacle to the group
    bigdinoGroup.add(dino);
  }
}
