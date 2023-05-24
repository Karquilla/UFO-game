/*	
Copyright (c) 2023 Kyle Arquilla. Information in LICENSE.txt file

	UFO Blaster 
	Created by: Kyle Arquilla
	Artwork by: Melissa Douglas
*/

const maxLives = 5;
let alpha1 = 0;         	//sets alpha for next stage
let BckgrndAni;
let player1; 				//player sprite
let life;     				//lives sprite
let lives;    				//lives group
let laser;					//laser sprite
let laserStartAnim;
let laserFlyAnim;
let enlaser;   				//enemy lasers sprite
let DSexpln;
let DSexplns;				//animation for explosion testing
let DSxplAni;
let Eexpln;
let Eexplns;				//animation for explosion testing
let EexplAni;
let enemies;  				//enemies group
let enemiesDS;
let enemiesE;        
let enemyDS;           		//enemies sub group
let enemyE              	//enemies sub group
let buttons;
let Bttn_reset;
let playerHealth = 100; 	// player health not currently in use
let gameOver = false;   	// boolean to check if game over
let trip = false;       
let score = 0;          	//total amount of enemies killed
let enDSStartamt = 1;    	//enemy start amount
let enEStartamt = 0;    	//enemy eye start amount
let nextstage = false;  	//turns true when next stage starts false again when next stage is doen setting up.
let paused = false;     	//not used
let HUD;                	//hud sprite
let dashboard;          	//dashboard sprite
let pointer;            	//pointer sprite
let enemyToplayerDist = []; //keeps an array of all the enemies distances to the player
let miniMap;            	//for testing not currently used
let borders;            	//old boarder sprites
let wrldCenter;         	//center of the boundry
let laserSheet;         	//sprite sheet for laser
let lifePU;
let lifePUs = [];
let rapidfirePU;
let rapidfirePUs = [];
let rapidfiring = false;
let PwrUps;
//let nextStageimg;       //img for next stage
let plyrShotTmr = 0
let plyrShotTmrstrt = -30;
let gameState = "title"; // title, start, run, next stage, game over.
let tripNextStage = false;
let beginTimer = 0;
let stage = 1;


function setup() {
	createCanvas(1500, 750);
	textFont('fantasy');
	allSprites.pixelPerfect = true;
	wrldCenter = createVector(width/2,height/2);
	camera.zoom = 0.5;  //default 0.75
	background(32,34,50);
	//Bshield.draw();
	Dashboard();
	createButtons()
	resetConfirm = new Sprite(0,0,0);
	resetDeny = new Sprite(0,0,0);


	//miniMap = createImage(222, 75);
	//nextStageSetup();
	//Tbeam.debug = true;
	//scrbrd.setAlpha(100);
	//pointer.debug = true;

}

function draw() {
	if (gameState == "title")
	{
		startButton();
		Bshield.draw();
		Dashboard();
	}

	if (gameState == "start")
	{
		Bshield.ani = ['up', 'idleup', ';;']
		player();
		camera.x = player1.x;
		camera.y = player1.y;
		setupEnemies();
		createHUD();
		laserSetup();
		PwrUpsGroup();
		PwrUpsSubGroup();
		enemylaser();
		explnsSpriteSetup();
		TractorBeamSetup();
		createEnemies();
		Pointer();
		Lives();
		resetButton();
		//allSprites.debug = true;

		gameState = 'run'
	}

	if (gameState == "run")
	{
		background(32,34,50);

	
		//console.log(player1.x,player1.y);
		setGameOver();
		//nextStageStart();
	
		FlyingLimit();
		TractorBeam();
		LifePickup();
		rapidFirePickup();
		rapidFire();
		enemyRest();
		shootEnemylaser();
		setPointer();
		PwrUpsRest();
		nextStageSwitch();
		resetSwitch();
		DrawThingsOnCam();
		Bshield.draw();
		Dashboard();
		lives.draw();
		buttons.draw();
		HUD.draw();
		enemiesLeft();
		pointer.draw();
		playerHit();
		//MiniMap()
		console.log(player1.x)

		//oneUpText();
	}

	if(gameState == 'nextStage')
	{
		background(32,34,50);
		animation(BckgrndAni,width/2,height/2);
		DrawThingsOnCam();
		nextStageButton();
		resetSwitch();
		lives.draw();
		Bshield.draw();
		stageClearSprite.draw();
		Dashboard();
		pointer.draw();
		HUD.draw();
		enemiesLeft();
		player1.speed = 0;
		Bttn_nextStage.draw();
		buttons.draw();
	}

	if(gameState == 'gameOver')
	{
		GameOver();
		gameOverScreen();
		Dashboard();
	}

	if (gameOver === false)
	{

	}


}

//images/anims to preload
function preload()
{
	gameover = loadImage('you died bigger.png');
	dashboard = loadImage('SPACESHIP WINDOW & CONTROLS XL.png');
	pointerImg = loadImage('arrow pointer.png');
	DSxplAni = loadAnimation('splode v3.png', { frameSize: [540, 420], frames: 10, frameDelay: 5})
	BckgrndAni = loadAnimation('Night sky v2xx.png',{frameSize: [2400, 1200], frames: 8, frameDelay: 10});
	BckgrndAni.scale = 1.5;

	stageClearSprite = new Sprite(750,375);
	stageClearSprite.spriteSheet = 'stage clear ani 2.png';
	stageClearSprite.addAnis({play: { width:1000, height: 510, row: 0, frames: 9, frameDelay: 9},
							   end: { width:1000, height: 510, row: 1, frames: 1, frameDelay: 1},
							 clear: { width:1000, height: 510, row: 0, frames: 1, frameDelay: 1}});
	stageClearSprite.ani = 'clear';
	stageClearSprite.collider = 'n';


	Eexplns = new Group();
	Eexplns.spriteSheet = 'eye splode v2.png';
	Eexplns.addAnis({explode: { width:600, height: 400, row: 0, frames: 8, frameDelay: 5},
						 hit: { width:600, height: 400, row: 1, frames: 3, frameDelay: 15}});

	enlasers = new Group();
	enlasers.spriteSheet = 'blaster.png';
	enlasers.addAnis({shoot: { width : 50, height: 25, row: 0, frames: 11, frameDelay: 4 },
						fly: { width : 50, height: 25, row: 1, frames: 3 , frameDelay: 4 }});

	lasers = new Group();
	lasers.spriteSheet = 'ufo zaps.png';
	lasers.addAnis({shoot: { width : 100, height: 50, row: 0, frames: 16, frameDelay: 4 },
					  fly: { width : 100, height: 50, row: 1, frames: 3 , frameDelay: 4 }});
	
	Tbeam = new Sprite();
	Tbeam.spriteSheet = 'Beam Sheetnew.png'
	Tbeam.addAnis({down: { width : 100, height: 100, row: 0, frames: 6, frameDelay: 10 },
								 up: { width : 100, height: 100, row: 1, frames: 6 , frameDelay: 10 },
								 idleup: {width : 100, height: 100, row: 0, frames: 1 },
								 idledown: {width : 100, height: 100, row: 1, frames: 1 }});
	Tbeam.ani = 'idleup'

	Bshield = new Sprite(746,375);
	Bshield.spriteSheet = 'Blast shield.png';
	Bshield.addAnis({down: { width : 750, height: 375, row: 1, frames: 22, frameDelay: 6 },
					up: { width : 750, height: 375, row: 0, frames: 23, frameDelay: 6 },
					idleup: {width : 750, height: 375, row: 1, frames: 1 },
					idledown: {width : 750, height: 375, row: 0, frames: 1 }});
	Bshield.ani = 'idledown'
	Bshield.scale = 1.95;
	Bshield.collider = 'n';

	playerSpriteAnim = loadAnimation("UFO V2.png","UFO V2 STEALTH.png");
	playerSpriteAnim.frameDelay = 10;
}

// collecting the sprites and objects so the can be drawn on camera and are effected by the zoom.
function DrawThingsOnCam()
{
	camera.on();
	Camera1();
	push();
	scale(2.5);
	animation(BckgrndAni,width/2,height/2)
	pop();
	//playerShake();
	enlasers.draw();
	enemies.draw();
	lasers.draw();
	enemyHit();
	laserRemove();
	playerMove();
	shootlaser();
	DSexplns.draw();
	Eexplns.draw();
	PwrUps.draw();
	Tbeam.draw();
	player1.draw();

	camera.off();
}

// set up player sprite
function player()
{
	player1 = new Sprite(0,0,[[57,35],[-114,0],[57,-35]]);
	//player1.diameter = 20;
	//player1.color = color('green');
	player1.layer = 2;
	player1.img = playerSpriteAnim;
	player1.collider = 'k';
}



function playerMove()
{
	//keeps player from moving until shield animation is finished
	if (frameCount - beginTimer < 198)
	{
		player1.speed = 0;
	}
	// Moves UFO with wasd and keeps it under top speed.
	var maxSpeed = 10;
	if (player1.speed <= maxSpeed)
	{
		if (kb.pressing('left'))
			{
				player1.vel.x -= 0.3;
				player1.rotation = -10;
			}
		else if (kb.pressing('right'))
			{
				player1.vel.x += 0.3;
				player1.rotation = 10;
			}
		else
			{
				// Keeps UFO from flipping
				player1.rotation = 0;
			}
		if (kb.pressing('up'))
			{
				player1.vel.y -= 0.3;
			}
		if (kb.pressing('down'))
			{
				player1.vel.y += 0.3;
			}
		}
	// slows UFO to a stop
	if (player1.speed > 0)
	{
	player1.speed *= 0.98;
	}
	// Make the player overlap and not collide with lasers.
	player1.overlaps(lasers);
	//player1.draw();
}

function setupEnemies()
{
	enemies = new Group();
	enemiesDS = new enemies.Group();
	enemiesE = new enemies.Group();
	enemies.d = 75;
	enemiesDS.img = 'BrainStation.png';
	enemiesE.img = 'EYE.png';
	//enemies.x = () => random(-100,100) * 10;
	//enemies.y = () => random(-100,100) * 10;
	enemies.layer = 3;
}

function createEnemies()
{
	var arr = [-1000,1000]
	if (enemies.length === 0)
	{
		for (let i = 0; i < enDSStartamt; i++)
		{
			enemyDS = new enemiesDS.Sprite(Math.floor(random(0,250)) * 10,Math.floor(random(0,250)) * 10);
		}
		for (let i = 0; i < enEStartamt; i++)
		{
			enemyE = new enemiesE.Sprite(Math.floor(random(0,250)) * 10,Math.floor(random(0,250)) * 10);
		}
	}
	for (let i = 0; i < enemies.length; i++)
	{
		//console.log(enemies[i].x);
	for ( let i = 0; i < enemies.length; i++)
	{
		let PtoEdist = dist(enemies[i].x,enemies[i].y,player1.x,player1.y);
		let x = PtoEdist;
		enemyToplayerDist[i] = x;
		if (PtoEdist < 500)
		{
			enemies[i].x = random(arr);
			enemies[i].y = random(arr);
		}
			//console.log(PtoEdist);
	}

		//else if (enemies[i].x < width/2 + 200 && enemies[i].x > 0 && enemies[i].y < height/2 + 200 && enemies[i].y > height/2 - 200)
		//{
		//	enemies[i].x += 200
		//}
	}
}

function enemyRest()
{
	//if (gameOver === false)
	{
		for (let i = 0; i<enemies.length; i++)
		{
			if (enemies[i].speed != 0)
			{
				enemies[i].speed *= 0.98;
				//
			}
			if(enemies[i].rotation != 0)
			{
				//setTimeout(function() {if (enemies.length != 0) {enemies[i].rotateTo(0,1.5);}}, 1000);
			enemies[i].rotation = floor(enemies[i].rotation * 0.98);
			//console.log(enemies[i].rotaion)
			}
		}
	}
}

function enemyHit()
{
  
	for (let i = 0; i < enemiesDS.length;i++)
	{
		if (enemiesDS[i].collides(lasers))
		{
			DSexplnsSprite(enemiesDS[i].x + 14,enemiesDS[i].y + 15,enemiesDS[i].rotation);
			pwrUpDrop(enemiesDS[i].x,enemiesDS[i].y);
			score += 1;
			enemiesDS[i].remove();
		}
	}
	for (let i = 0; i < enemiesE.length;i++)
	{
		if (enemiesE[i].collides(lasers))
		{
			EexplnsSprite(enemiesE[i].x,enemiesE[i].y,enemiesE[i].rotation);
			pwrUpDrop(enemiesE[i].x,enemiesE[i].y);
			score += 1;
			enemiesE[i].remove();
		}
	}
}

function explnsSpriteSetup()
{

	DSexplns = new Group();
	DSexplns.ani = DSxplAni;
	DSexplns.collider = 'n';
	DSexplns.scale = 0.35;
	Eexplns.collider = 'n';
	Eexplns.scale = 0.20;

}

function DSexplnsSprite(x,y,rot)
{
DSexpln = new DSexplns.Sprite(x,y);
DSexpln.rotation = rot;
setTimeout(function() {DSexplns[DSexplns.length-1].remove();},400)
}
/////////////

function EexplnsSprite(x,y,rot)
{
Eexpln = new Eexplns.Sprite(x,y);
Eexpln.ani = ['hit','explode',';;']
Eexpln.rotation = rot;
setTimeout(function() {Eexplns[Eexplns.length-1].remove();},1300)
}

//removes life when player is hit.
function playerHit()
{
	var i = lives.length -1;
	if (player1.collided(enlasers))
			{
			playerHealth -= 21;
			playerShake();
			lives[i].remove();
			i--;
			}
}

async function playerShake()
{
	let velX = player1.vel.x;
	let velY = player1.vel.y;
	await player1.moveTo(player1.x + 15,player1.y, 10);
	await player1.moveTo(player1.x - 30,player1.y, 10);
	await player1.moveTo(player1.x + 15,player1.y, 10);
	player1.vel.x = velX - 1;
	player1.vel.y = velY - 1;
}
//removes shot lasers when collided with enemy
function laserRemove()
{
	for (let i = 0; i < lasers.length;i++)
	{
		if (lasers[i].collided(enemies))
		{
			lasers[i].remove();
		}
	}
	for (let i = 0; i < enlasers.length; i++)
	{
		if (enlasers[i].collided(player1))
		{
			enlasers[i].remove();
		}
	}
	lasers.scale = 1.2;
	if (lasers.speed < 6)
		{
			lasers.speed *= 1.05
		}
}

// Setting up group of laser sprites
function laserSetup()
{

	lasers.width = 10;
	lasers.speed = 1;
	lasers.height = 15;
	lasers.life = 300;


}

// makes new laser on mouse and sets properties.
// starts laser at player center and shoots towards mouse.
function shootlaser()
{
	if(frameCount - beginTimer > 198)
	{
		if (rapidfiring == false)
		{
			plyrShotTmr = frameCount - plyrShotTmrstrt;
			if (mouse.presses())
			{
				if (plyrShotTmr >= 20)
				{
					plyrShotTmrstrt = frameCount;
					laser = new lasers.Sprite(0,0,50,25);
					laser.x = player1.x;
					laser.y = player1.y;
					laser.layer = 1;
					laser.rotation = player1.angleTo(mouse);
					laser.direction = laser.angleTo(mouse);
					laser.ani = ['shoot','fly']
				}
			}
		}
	}
}

//Keeps camera centered on UFO
function Camera1()
{
	while (player1.x > camera.x + 600)
	{
		camera.x += 1;
	}
	while (player1.x < camera.x - 600)
	{
		camera.x -= 1;
	}
	while (player1.y > camera.y + 200)
	{
		camera.y += 1;
	}
	while (player1.y < camera.y - 200)
	{
		camera.y -= 1;
	}
}

function Animation()
{

}

//not used. old boarder
function border()
{
	borders = new Group();
	borderL = new borders.Sprite(-2000,0,5,2300);
	borderR = new borders.Sprite(2000,0,5,2300);
	borderT = new borders.Sprite(0,1150,4000,5);
	borderB = new borders.Sprite(0,-1150,4000,5);
	borders.color = color('dimgrey');
	borders.collider = 's';
}
// limits how far player can go. makes player bounce back when limit is reached.
function FlyingLimit()
{
	let PtoCdist = dist(wrldCenter.x,wrldCenter.y,player1.x,player1.y);
	if (abs(PtoCdist) > 3000)
	{
		player1.moveTo(wrldCenter.x,wrldCenter.y,3);
	}
}
//sets up enemy laser sprite.
function enemylaser()
{
	enlasers.width = 12;
	enlasers.height = 5;
	enlasers.speed = 4;
	enlasers.life = 300;
	enlasers.layer = 1;
	enlasers.scale = 2
	lasers.overlaps(enlasers);
	enemies.overlaps(enlasers);
	enlasers.overlaps(enlasers);
	lasers.overlaps(Tbeam);
	enlasers.overlaps(Tbeam);
	lasers.overlaps(buttons);
	enlasers.overlaps(buttons);
	//lasers.overlaps(PwrUps);
	//enlasers.overlaps(PwrUps);
}

//makes enmies shoot when player come with in a distance. shoot timer gaps the shots.
function shootEnemylaser()
{//shoots once every second
	if (frameCount - beginTimer > 360)
	{
		if (frameCount % 60 == 0 )
		{//for all enemies if distance of enemyi is less then 400px to player then enemyi shoot
			for ( var i = 0; i < enemies.length; i++)
			{
			let PtoEdist = dist(enemies[i].x,enemies[i].y,player1.x,player1.y);
			let x = abs(PtoEdist);
			if (x < 600)
				{
				enlaser = new enlasers.Sprite();
				enlaser.ani = ['shoot','fly']
				enlaser.x = enemies[i].x;
				enlaser.y = enemies[i].y;
				enlaser.rotation = enemies[i].angleTo(player1);
				enlaser.direction = enlaser.angleTo(player1);
				}
			}
		}
	}
}

//sets up game over img and shows total enemies killed before game over.
function gameOverScreen()
{	

		push();
		if (alpha1 < 200)
		{
		tint(255,alpha1)
		alpha1 += 1;
		}
		image(gameover,0,0);
		pop();
		push();
		textAlign(CENTER,CENTER);
		textSize(68);
		fill(112,22,22,alpha1);
		text(score,930,415);
		alpha1 += 1.5
		pop();

}


function setGameOver()
{
	if (lives.length == 0)
	{
		gameState = 'gameOver'
	}
}

// sets up sprites to represent the lives left.
function Lives()
{
	lives = new Group();
	lives.img = 'UFO V2.png';
	lives.d = 5;
	lives.collider = 'none';
	lives.scale = 0.25;
	for (var i= 1; i <= 5; i++)
	{
		new lives.Sprite(690 +(20 * i), 525);
	}
}

//removes left over sprites when game over
function GameOver()
{
		if (trip === false)
	{
		allSprites.remove();
		trip = true;
	}
}
// shows how many enemies left on HUD

function PwrUpsGroup()
{
	PwrUps = new Group()
	PwrUps.allowSleeping = false;
	//PwrUps.collider = 'k';
}

function PwrUpsRest()
{
	for (let i = 0; i < PwrUps.length; i++)
	{		
		if (PwrUps[i].speed > 0)
		{
			PwrUps[i].speed *= 0.98;
		}
	}

		PwrUps.rotationSpeed = 1;
	
}

function PwrUpsSubGroup()
{
	lifePUs = new PwrUps.Group();
	rapidfirePUs = new PwrUps.Group();
}

function rapidFirePickup()
{
	for (let i = 0; i < rapidfirePUs.length; i++)
	{
		if (kb.pressing('space') && rapidfirePUs[i].overlapping(player1))
		{
			rapidfiring = true;
			rapidfirePUs[i].remove();
			setTimeout(function() {rapidfiring = false;}, 7000);
		}
	}
}

function rapidFire()
{
	if (rapidfiring == true)
	{
		if (mouse.pressing())
		{
			if (frameCount % 9 == 0)
			{
				laser = new lasers.Sprite(0,0,50,25);
				laser.x = player1.x;
				laser.y = player1.y;
				laser.layer = 1;
				laser.rotation = player1.angleTo(mouse);
				laser.direction = laser.angleTo(mouse);
				laser.ani = ['shoot','fly']
			}
		}
	}
}


function LifePickup()
{
	let livesleft = lives.length;
	if (lives.length < maxLives)
	{
		for (let i = 0; i < lifePUs.length; i++)
		{
			if (kb.pressing('space') && lifePUs[i].overlapping(player1))
			{
				new lives.Sprite(690 +(20 * (livesleft+1)), 525);
				//oneUpText();
				lifePUs[i].remove();
			}
		}
	}
		//console.log(livesleft)
}

function oneUpText()
{
	for (let i = 0; i < 50; i++)
	{
		push();
		fill(color('white'));
		textSize(20)
		text('+1 up', player1.x, player1.y + i);
		pop();
	}
}

function pwrUpDrop(x,y)
{
	let drop = Math.floor(random(0,10))
	if (drop == 1)
	{
		lifePU = new lifePUs.Sprite(x,y);
		lifePU.d = 15;
		lifePU.img = 'drop items green.png'
	}
	if (drop == 2)
	{
		rapidfirePU = new rapidfirePUs.Sprite(x,y);
		rapidfirePU.d = 15;
		rapidfirePU.img = 'drop items battery.png'
	}
	//console.log(drop);
}

function nextStageSwitch()
{
	if (enemies.length == 0)
	{
		gameState = 'nextStage';
		stage += 1;
	}
}


function stageNumber()
{
	push();
	textSize(11);
	textAlign(CENTER,CENTER);
	stroke('black');
	fill(color('darkgreen'))
	text("STAGE", 1370,76);
	textSize(20);
	text(stage, 1370,91)
	pop();

}


//creates camera boarder/dashboard
function Dashboard()
{
	push();
	scale(1.5);
	image(dashboard,0,0)
	pop();
}
// creates HUD in top right corner
function createHUD()
{
	HUD = new Sprite(1309, 135,172,135);
	HUD.color = color(5,25,5,180);
	//HUD.layer = 5;
	HUD.collider = 'none';
}

function enemiesLeft()
{

	push();
	stroke('black');
	fill('darkgreen');
	textAlign(CENTER,CENTER);
	textSize(11);
	text("ENEMIES",1250,76);
	pop();
	push();
	stroke('black');
	fill('darkgreen');
	textAlign(CENTER,CENTER);
	textSize(20);
	text(enemies.length,1250,91);
	pop();
	stageNumber()
}


function createButtons()
{
	buttons = new Group();
	buttons.collider = 'k';
	Bttn_start = new buttons.Sprite(width/2,height/2 + 200,200,100);
	Bttn_start.color = color('blue')
	Bttn_start.text = 'START';
	Bttn_start.textColor = color('lightblue')
	Bttn_start.textSize = 30;
	Bttn_start.collider = 'k';
	//Bttn_start.img = 'empty.png';
	
}

function startButton()
{
	if (Bttn_start.mouse.presses())
	{
		beginTimer = frameCount;
		Bttn_start.remove();
		gameState = 'start';
	}
}


function resetButton()
{
	Bttn_reset = new buttons.Sprite(1308,235,40,20);
	Bttn_reset.color = color(5,25,5);
	Bttn_reset.text = "Reset";
	Bttn_reset.textColor = color('darkgreen');
	//Bttn_reset.collider = 'k';

}

function resetSwitch()
{
	if (Bttn_reset.mouse.presses())
	{
		resetConfirm = new buttons.Sprite(Bttn_reset.x - 50, Bttn_reset.y + 50, 40, 20);
		resetConfirm.color = color(5,25,5);
		resetConfirm.text = "YES";
		resetConfirm.textColor = color('darkgreen');
		resetDeny = new buttons.Sprite(Bttn_reset.x + 50, Bttn_reset.y + 50, 40, 20);
		resetDeny.color = color(5,25,5);
		resetDeny.text = "NO";
		resetDeny.textColor = color('darkgreen');
		resetConfirmText = new buttons.Sprite(Bttn_reset.x, Bttn_reset.y + 25, 0);
		resetConfirmText.textColor = color('darkgreen');
		resetConfirmText.text = "Are you sure you would like to reset?";
	}
	if (resetConfirm.mouse.presses())
	{
		location.reload();
	}
	if (resetDeny.mouse.presses())
	{
		resetDeny.remove();
		resetConfirm.remove();
		resetConfirmText.remove();
	}
}


function nextStageButton()
{
	if (tripNextStage == false)
	{
		Bttn_nextStage = new buttons.Sprite(width/2, height/2 + 100, 100, 75);
		//Bttn_nextStage.color = color('red');
		Bttn_nextStage.textSize = 20;
		Bttn_nextStage.textColor = color('white');
		Bttn_nextStage.text = 'CONTINUE';
		Bttn_nextStage.collider = 'k';
		Bttn_nextStage.color = color('goldenrod');
		Bshield.ani = ['down', 'idledown'];
		setTimeout(function() {stageClearSprite.ani = ['play','end'];},1500)
		setTimeout(enemyIncrease,3000);
		//Bttn_nextStage.textColor = color('white');
		tripNextStage = true;
	}
	if (Bttn_nextStage.mouse.presses())
	{
		beginTimer = frameCount;
		Bshield.ani = ['up', 'idleup'];
		stageClearSprite.ani = 'clear';
		tripNextStage = false;
		Bttn_nextStage.remove();
		gameState = 'run';
	}
}

function enemyIncrease()
{
	enDSStartamt += 10;
	enEStartamt += 5;
	createEnemies();
}

//create pointer sprite
function Pointer()
{
	pointer = new Sprite(1308,135,20,20);
	pointer.collider = 'n';
	pointer.img = pointerImg;
}

//finds the enemy index of the closest enemy and passes its direction to the pointer sprite.
function setPointer()
{
	enemyToplayerDist = [];
	for ( let i = 0; i < enemies.length; i++)
	{
		let PtoEdist = dist(enemies[i].x,enemies[i].y,player1.x,player1.y);
		let x = abs(PtoEdist);
		enemyToplayerDist[i] = x;
	}
	minNum = enemyToplayerDist[0];
	minIdx = 0;

	for (let i = 0; i < enemyToplayerDist.length; i++) 
	{
  	if (enemyToplayerDist[i] < minNum) 
		{
			minNum = enemyToplayerDist[i];
			minIdx = i;
 	 	}
		pointer.rotation = enemies[minIdx].angleTo(player1) - 90;
	//angle = enemies[minIdx].angleTo(player1) - 90;
	//pointer.rotateTo(angle,3)
	}
	//console.log(angle);
	//pointer.rotateTowards(enemies[minIdx],0.1,0)
}

function TractorBeamSetup()
{
	Tbeam.h = 50;
	Tbeam.w = 40;
	Tbeam.scale = 2.5;
	Tbeam.anis.offset.x = -2;
	Tbeam.anis.offset.y = -27;
	Tbeam.ani = 'idleup';
	player1.overlaps(Tbeam);
	enemies.overlaps(Tbeam);
	//Tbeam.collider = '';
}

function TractorBeam()
{
	Tbeam.x = player1.x;
	Tbeam.y = player1.y +50;
	Tbeam.y += 30;
	if (Tbeam.rotation < 0)
	{
		Tbeam.rotation = 0;
	}
	else if (Tbeam.rotation > 0)
	{
		Tbeam.rotation = 0;
	}
	if (kb.pressing('space'))
	{
		for (let i = 0; i < PwrUps.length; i++)
		{
			if (Tbeam.overlapping(PwrUps[i]))
			{	
				PwrUps[i].moveTowards(player1,0.03);
			}
		}
	}
	if (kb.presses('space'))
		{
			Tbeam.ani = ['down','idledown']
		}
		else if (kb.released('space'))
	{
	setTimeout(function() {Tbeam.ani = ['up','idleup'];},500);
	}

}
				









//was trying to make mini map instead of arrow pointer

function MiniMap()
{
	miniMap.loadPixels();
	for (let pixX = 0; pixX < 0; pixX++)
	{
		for (let pixY = 0; pixY < 0; pixY++)
		{
			miniMap.set(pixX,pixY,)
		}
	}
	for (let i = 0; i < enemies.length; i++)
	{
		miniMap.set(enemies[i].x / 10, enemies[i].y / 10, color('red'));
		miniMap.set(player1.x / 10 , player1.y / 10, color('green'))
	}
	miniMap.updatePixels();
	push();
	//scale(5);
	image(miniMap, 1000, 500);
	pop();
}




/*  ISSUES
*** need to add start button working on setting up game loop. title => start => run => game over => restart
                                                                                	||=>reset
fixed 1. pointer does not always point to next enemy after first enemy is killd. starts working again once 
new enemy is close "enough".
2. i believe enemy explosions animation doesnt finish if killing enemies in quick succesion
fixed 3. enemies and pwrups still spawn out of boundry
4. balancing
5. background need resized

enemy spawning near player because i fixed player starting location
maybe have player move back to center before spawning next wave of enemies make it easier to ensure that no enmeies will spawn to close

		WIP
1. power ups. currently just add life.// added rapid fire
2. life powerup sprite
3. might make canvas bigger and make play area bigger


	CHANGE LOG 
	5/17/23
	- added max lives to life pickup. max lives is 5.
	fixes
	- enemy and player lasers no longer push power ups off into the distance.
	5/13/23
	- added rapid fire to the power ups.
	- power ups now spawn on enemy destruction with chance of 1 out of 10.
	- expanded map and enemy spawns.
	fixes
	- fixed the arrow. now points correctly.
	- fixed player not slowing to a stop.
	- enemies no longer spawn within shooting distance of player.
*/


