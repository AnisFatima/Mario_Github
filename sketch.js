var PLAY = 1;
var END = 0;
var gameState = PLAY;

var mario, mario_running, mario_collided;
var ground, groundImage;


var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4;
var backgroundImg;
var score=0;
var jumpSound,collidedSound,checkpointSound;

var gameOver, restart;

function preload(){
mario_running=loadAnimation("mario01.png","mario02.png","mario03.png");
  
  groundImage=loadImage("ground2.png");
  
  obstacle1=loadImage("obstacle1.png");
  obstacle2=loadImage("obstacle2.png");
  obstacle3=loadImage("obstacle3.png");
  obstacle4=loadImage("obstacle4.png");
  
  backgroundImage=loadImage("bg.png");
 
  
  brickImage=loadImage("brick.png");
  
  mario_collided =loadAnimation("collided.png");
  
  gameoverImage=loadImage("gameOver.png");
  restartImage=loadImage("restart.png");
  
  jumpSound=loadSound("jump.mp3");
  collidedSound = loadSound("die.mp3");
  checkpointSound=loadSound("checkPoint.mp3");
    
}

function setup(){
  createCanvas(600, 200);
  
  mario = createSprite(50,100,40,10);
  
  mario.addAnimation("running", mario_running);
  mario.addAnimation("collided", mario_collided);
  mario.setCollider('circle',0,0,15)
  
  ground = createSprite(10,190,600,60);
  ground.addImage("ground",groundImage);
  ground.x = width/2
  ground.velocityX = -(6 + score/100);
  ground.scale=1;
  
  gameOver = createSprite(300,70);
  gameOver.addImage(gameoverImage);
  
  restart = createSprite(300,90);
  restart.addImage(restartImage);
  
  gameOver.scale = 0.4;
  restart.scale = 0.4;
 
  gameOver.visible = false;
  restart.visible = false;

  bricksGroup1 = new Group();
  bricksGroup2 =new Group();
  bricksGroup3 =new Group();
  obstaclesGroup = new Group();
  
  score = 0;
  
}

function draw(){
  
    background(backgroundImage);
    textSize(15);
    fill("black")
    text("SCORE: "+ score,500,70);


    if (gameState===PLAY){
            spawnBricks1();
            spawnBricks2();
            spawnBricks3()

            spawnObstacles();

            if(bricksGroup1.isTouching(mario)){
            bricksGroup1.destroyEach();

            score=score+1;
       }
      
      if ( score>0 && score%10===0){
        checkpointSound.play();
      }
      
      
     if(bricksGroup2.isTouching(mario)){
           bricksGroup2.destroyEach();
           score=score+1;
      }
      
      if(bricksGroup3.isTouching(mario)){
            bricksGroup3.destroyEach();
            score=score+1;
      }

      ground.velocityX = -(6 + score/30);

      if((touches.length > 0 || keyDown("SPACE")) && mario.y  >= 120) {
        jumpSound.play( )
        mario.velocityY = -10;
         touches = [];
      }

      mario.velocityY = mario.velocityY + 0.8

      if (ground.x < 0){
        ground.x = ground.width/2;
      }

      mario.collide(ground);


      if(obstaclesGroup.isTouching(mario)){
          collidedSound.play()
          gameState = END;
      }
    }
    else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;


      ground.velocityX = 0;
      mario.velocityY = 0;
      obstaclesGroup.setVelocityXEach(0);
      bricksGroup1.setVelocityXEach(0);
      bricksGroup2.setVelocityXEach(0);
       bricksGroup3.setVelocityXEach(0);

      mario.changeAnimation("collided",mario_collided);


      obstaclesGroup.setLifetimeEach(-1);
      bricksGroup1.setLifetimeEach(-1);
      bricksGroup2.setLifetimeEach(-1);
      bricksGroup3.setLifetimeEach(-1);

      if(touches.length>0 || keyDown("SPACE")) {      
        reset();
        touches = []
      }
    }


    drawSprites();

    fill("black")
    text("HIT THE BRICKS TO SCORE POINTS" , 100 , 20);
}




function spawnBricks1() {
  
  if (frameCount % 123 === 0) {
    var brick = createSprite(600,50,40,10); 
    brick.y = Math.round(random(80,120)); 
    brick.addImage(brickImage);
    
    brick.scale = 0.5;
    brick.velocityX = -6;
    
     
    brick.lifetime = 300;
    

    brick.depth = mario.depth;
    mario.depth = mario.depth+1;
    
    
    bricksGroup1.add(brick);
  }
  
}
function spawnBricks2() {
  
  if (frameCount % 175 === 0) {
    var brick = createSprite(600,50,40,10); 
    brick.y = Math.round(random(50,100));
    brick.addImage(brickImage);
    
    brick.scale = 0.5;
    brick.velocityX = -6;
    
     
    brick.lifetime = 300;
    
  
    brick.depth = mario.depth;
    mario.depth = mario.depth+1;
    

    bricksGroup2.add(brick);
  }
  
}
function spawnBricks3() {
  
  if (frameCount % 216 === 0) {
    var brick = createSprite(600,50,40,10); 
    brick.y = Math.round(random(70,130));
    brick.addImage(brickImage);
    
    brick.scale = 0.5;
    brick.velocityX = -6;
    
    
    brick.lifetime = 300;
    

    brick.depth = mario.depth;
    mario.depth = mario.depth+1;
    
    //add each cloud to the group
    bricksGroup3.add(brick);
  }
  
}

function spawnObstacles() {
  if(frameCount % 70 === 0) {
    var obstacle = createSprite(600,140,20,30);
    obstacle.setCollider('circle',0,0,15)

    obstacle.velocityX = -(6 + score/50);
    
    var randomnumber = Math.round(random(1,4));
    switch(randomnumber) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      default: break;
    }
    
    obstaclesGroup.add(obstacle);
    
    obstacle.scale = 0.7;
    obstacle.lifetime = 300;
    obstacle.depth = mario.depth;
    mario.depth =mario.depth + 1;
  
    
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  bricksGroup1.destroyEach();
  bricksGroup2.destroyEach();
  bricksGroup3.destroyEach();
  
  mario.changeAnimation("running",mario_running);
  
  score = 0;
  
}
