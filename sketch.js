/*	
Copyright (c) 2023 Kyle Arquilla. Information in LICENSE.txt file

	Cosmic Chaos 
	Created by: Kyle Arquilla
	Artwork by: Melissa Douglas
*/

const MAX_LIVES = 5;
const enBrnIncAmt = 8;      // default 10
const enEIncAmt = 2;        // default 5
let enBrnStartamt = 8;    	// brain enemy start amount
let enEStartamt = 2;    	// eye enemy start amount
let alpha1 = 0;         	// sets alpha for next stage
let player1; 				// player sprite
let life;     				// lives sprite
let lives;    				// lives group
let laser;					// laser sprite
let laserStartAnim;
let laserFlyAnim;
let enlaser;   				// enemy lasers sprite
let Brnexpln;
let Brnexplns;				// animation for explosion testing
let BrnxplAni;
let Eexpln;
let Eexplns;				// animation for explosion testing
let enemies;  				// enemies group
let enemiesBrn;
let enemiesE;        
let enemyBrn;           		// enemies sub group
let enemyE              	// enemies sub group
let buttons;
let Bttn_reset;
let gameOver = false;   	// boolean to check if game over
let trip = false;       
let score = 0;          	// total amount of enemies killed
let nextstage = false;  	// turns true when next stage starts false again when next stage is doen setting up.
let paused = false;     	// not used
let HUD;                	// hud sprite
let dashboard;          	// dashboard sprite
let pointer;            	// pointer sprite
let enemyToplayerDist = []; // keeps an array of all the enemies distances to the player
let miniMap;            	// for testing not currently used
let borders;            	// old boarder sprites
let wrldCenter;         	// center of the boundry     
let lifePU;
let lifePUs = [];
let rapidfirePU;
let rapidfirePUs = [];
let rapidfiring = false;
let TbeamDown = false;
let PwrUps;
let plyrShotTmr = 0
let plyrShotTmrstrt = -30;
let gameState = "title";    // title, start, run, next stage, game over.
let tripNextStage = false;
let beginTimer = 0;
let stageCooldown = 0;
let TbeamCooldown = 0;
let stage = 1;
let gamePaused = false;


function setup() {
	createCanvas(1500, 750);
	textFont('fantasy');
	allSprites.pixelPerfect = true;
	wrldCenter = createVector(width/2,height/2);
	background(32,34,50);
	createHUD();
	Dashboard();
	createButtons()
	resetConfirm = new Sprite(0,0,0);
	resetDeny = new Sprite(0,0,0);
	instructionsSetup()
	spriteAniSetup()

	//miniMap = createImage(222, 75);
}

function draw() {
	if (gameState == "title")
	{
		startButton();
		Bshield.draw();
		Dashboard();
		HUD.draw();
		instructions();
		title()
	}

	if (gameState == "start")
	{
		Bshield.ani = ['up', 'idleup', ';;']
		camera.zoom = 0.5;  //default 0.75 
		player();
		camera.x = player1.x;
		camera.y = player1.y;
		setupEnemies();
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
		gameState = 'run'
	}

	if (gameState == "run")
	{
		background(32,34,50);
		playerMove();
		FlyingLimit();
		TractorBeam();
		LifePickup();
		rapidFirePickup();
		rapidFire();
		enemyRest();
		shootEnemylaser();
		shootlaser();
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
		rapidFireLight();
		enemiesLeft();
		pointer.draw();
		playerHit();
		setGameOver();
		pause()
	}

	if(gameState == 'nextStage')
	{
		background(32,34,50);
		DrawThingsOnCam();
		nextStageSetup();
		resetSwitch();
		lives.draw();
		Bshield.draw();
		stageClearSprite.draw();
		Dashboard();
		pointer.draw();
		HUD.draw();
		enemiesLeft();
		buttons.draw();
	}

	if(gameState == 'gameOver')
	{
		gameOverScreen();
		resetSwitch();
		buttons.draw();
		Dashboard();
	}
}

// images/anims to preload
function preload()
{
	playerSpriteAnim = loadAnimation("assets/UFO V2.png","assets/UFO V2 STEALTH.png");
	BrnxplAni = loadAnimation('assets/splode v3.png', { frameSize: [540, 420], frames: 10, frameDelay: 5});
	BckgrndAni = loadAnimation('assets/Night sky v2xx.png',{frameSize: [2400, 1200], frames: 8, frameDelay: 20});
	titleAni =  loadAnimation('assets/TITLE.png',{frameSize: [1500, 1128], frames: 4, frameDelay: 20});

	dashboard = loadImage('assets/SPACESHIP WINDOW & CONTROLS XL.png');
	pointerImg = loadImage('assets/arrow pointer.png');
	battery = loadImage('assets/drop items battery.png');
	greenItem = loadImage('assets/drop items green.png');
	stageClearAni = loadImage('assets/stage clear ani 2.png');
	gameOverAni = loadImage("assets/gameOver.png");
	EexplnsAni = loadImage('assets/eye splode v2.png');
	enlasersAni = loadImage('assets/blaster.png');
	lasersAni = loadImage('assets/ufo zaps.png');
	TbeamAni = loadImage('assets/Beam Sheet.png');
	BshieldAni = loadImage('assets/Blast shield.png');
	continueButtonImg = loadImage('assets/continue button.png');
	startButtonImg = loadImage('assets/start button.png');

}

function spriteAniSetup()
{
	stageClearSprite = new Sprite(750,250);
	stageClearSprite.spriteSheet = stageClearAni;
	stageClearSprite.addAnis({play: { width:1592, height: 800, row: 0, frames: 10, frameDelay: 9},
							   end: { width:1592, height: 800, row: 1, frames: 1, frameDelay: 1},
							 clear: { width:1592, height: 800, row: 0, frames: 1, frameDelay: 1}});
	stageClearSprite.ani = 'clear';
	stageClearSprite.collider = 'n';

	gameOverSprite = new Sprite(745,400);
	gameOverSprite.spriteSheet = gameOverAni;
	gameOverSprite.addAnis({play: { width:1196, height: 600, row: 0, frames: 8, frameDelay: 7},
							 end: { width:1196, height: 600, row: 1, frames: 1, frameDelay: 1},
	  					   clear: { width:1196, height: 600, row: 0, frames: 1, frameDelay: 1}});
	gameOverSprite.ani = 'clear';
	gameOverSprite.collider = 'n';

	Eexplns = new Group();
	Eexplns.spriteSheet = EexplnsAni;
	Eexplns.addAnis({explode: { width:600, height: 400, row: 0, frames: 8, frameDelay: 5},
						 hit: { width:600, height: 400, row: 1, frames: 3, frameDelay: 15}});

	enlasers = new Group();
	enlasers.spriteSheet = enlasersAni;
	enlasers.addAnis({shoot: { width : 50, height: 25, row: 0, frames: 11, frameDelay: 4 },
						fly: { width : 50, height: 25, row: 1, frames: 3 , frameDelay: 4 }});

	lasers = new Group();
	lasers.spriteSheet = lasersAni;
	lasers.addAnis({shoot: { width : 100, height: 50, row: 0, frames: 16, frameDelay: 4 },
					  fly: { width : 100, height: 50, row: 1, frames: 3 , frameDelay: 4 }});

	Tbeam = new Sprite();
	Tbeam.spriteSheet = TbeamAni;
	Tbeam.addAnis({down: { width : 100, height: 100, row: 0, frames: 6, frameDelay: 10 },
					 up: { width : 100, height: 100, row: 1, frames: 6 , frameDelay: 10 },
				 idleup: {width : 100, height: 100, row: 0, frames: 1 },
			   idledown: {width : 100, height: 100, row: 1, frames: 1 }});
	Tbeam.ani = 'idleup';

	Bshield = new Sprite(747,375);
	Bshield.spriteSheet = BshieldAni;
	Bshield.addAnis({down: { width : 750, height: 375, row: 1, frames: 22, frameDelay: 6 },
					   up: { width : 750, height: 375, row: 0, frames: 23, frameDelay: 6 },
				   idleup: {width : 750, height: 375, row: 1, frames: 1 },
				 idledown: {width : 750, height: 375, row: 0, frames: 1 }});
	Bshield.ani = 'idledown';
	Bshield.scale = 1.96;
	Bshield.collider = 'n';

	BckgrndAni.scale = 3;

	playerSpriteAnim.frameDelay = 10;


}

// collecting the sprites and objects so the can be drawn on camera and are effected by the zoom.
function DrawThingsOnCam()
{
	camera.on();
	CameraMove();
	push();
	animation(BckgrndAni,0,-1000);
	animation(BckgrndAni,0,1000);
	pop();
	//playerShake();
	enlasers.draw();
	enemies.draw();
	lasers.draw();
	enemyHit();
	laserRemove();
	Brnexplns.draw();
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
	enemiesBrn = new enemies.Group();
	enemiesE = new enemies.Group();
	enemies.d = 75;
	enemiesBrn.img = 'assets/BrainStation.png';
	enemiesE.img = 'assets/EYE.png';
	//enemies.x = () => random(-100,100) * 10;
	//enemies.y = () => random(-100,100) * 10;
	enemies.layer = 3;
}

function createEnemies()
{
	var arr = [-1000,1000]
	if (enemies.length === 0)
	{
		for (let i = 0; i < enBrnStartamt; i++)
		{
			enemyBrn = new enemiesBrn.Sprite(Math.floor(random(-300,300)) * 10,Math.floor(random(-300,300)) * 10);
		}
		for (let i = 0; i < enEStartamt; i++)
		{
			enemyE = new enemiesE.Sprite(Math.floor(random(-300,300)) * 10,Math.floor(random(-300,300)) * 10);
		}
	}
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
			}
			if(enemies[i].rotation != 0)
			{
			enemies[i].rotateTowards(0,0.1);
			}
		}
	}
}

function enemyHit()
{
  
	for (let i = 0; i < enemiesBrn.length;i++)
	{
		if (enemiesBrn[i].collides(lasers))
		{
			BrnexplnsSprite(enemiesBrn[i].x + 14,enemiesBrn[i].y + 15,enemiesBrn[i].rotation);
			pwrUpDrop(enemiesBrn[i].x,enemiesBrn[i].y);
			score += 1;
			enemiesBrn[i].remove();
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

	Brnexplns = new Group();
	Brnexplns.ani = BrnxplAni;
	Brnexplns.collider = 'n';
	Brnexplns.scale = 0.35;
	Eexplns.collider = 'n';
	Eexplns.scale = 0.20;

}

function BrnexplnsSprite(x,y,rot)
{
Brnexpln = new Brnexplns.Sprite(x,y);
Brnexpln.rotation = rot;
setTimeout(function() {Brnexplns[Brnexplns.length-1].remove();},400)
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
	lasers.life = 280;
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
function CameraMove()
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
	if (player1.x > 3000 || player1.x < -3000)
	{
		player1.moveTo(wrldCenter.x,wrldCenter.y,3);
	}
	if (player1.y > 3000 || player1.y < -3000)
	{
		player1.moveTo(wrldCenter.x,wrldCenter.y,3);
	}
}
//sets up enemy laser sprite.
function enemylaser()
{
	enlasers.speed = 5;
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
{

	if (frameCount - beginTimer > 360)
	{
		//shoot timer
		if (frameCount % (60 - stage) == 0 )
		{
			//for all enemies if distance of enemyi is less then 400px to player then enemyi shoot
			for ( var i = 0; i < enemies.length; i++)
			{
			let PtoEdist = dist(enemies[i].x,enemies[i].y,player1.x,player1.y);
			let x = abs(PtoEdist);
			if (x < 715)
				{
				enlaser = new enlasers.Sprite(enemies[i].x,enemies[i].y,12,5);
				enlaser.ani = ['shoot','fly']
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
	background(32,34,50);
	animation(BckgrndAni,0,-1000)
	animation(BckgrndAni,0,1000)
	Bshield.draw();
	gameOverSprite.draw();


	if (alpha1 < 255)
	{
		alpha1 += 1.2
	}
	push();
	textAlign(CENTER,CENTER);
	textSize(32);
	fill(112,22,22,alpha1);
	stroke('black')
	text(score,gameOverSprite.x + 6,gameOverSprite.y + 40);
	pop();
	push();
	textAlign(CENTER,CENTER);
	if (stage > 10)
	{
		textSize(28);
	}
	else
	{
		textSize(35);
	}
	fill(112,22,22,alpha1);
	stroke('black')
	text(stage,gameOverSprite.x + 105,gameOverSprite.y - 242);
	pop();

}


function setGameOver()
{
	if (lives.length == 0)
	{
		gameState = 'gameOver'
		Bshield.ani = ['down','idledown']
		gameOverSprite.ani = ['play','end']
		player1.remove();
		enemies.remove();
		enlasers.remove();
		lasers.remove();
		PwrUps.remove();
	}
}

// sets up sprites to represent the lives left.
function Lives()
{
	lives = new Group();
	lives.img = 'assets/UFO V2.png';
	lives.d = 5;
	lives.collider = 'none';
	lives.scale = 0.25;
	for (var i= 1; i <= MAX_LIVES; i++)
	{
		new lives.Sprite(690 +(20 * i), 525);
	}
}


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
			//lasts for 10 seconds
			setTimeout(function() {rapidfiring = false;}, 10000);
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
	if (lives.length < MAX_LIVES)
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
	let drop = Math.floor(random(0,15))
	if (drop == 1)
	{
		lifePU = new lifePUs.Sprite(x,y);
		lifePU.d = 15;
		lifePU.img = 'assets/drop items green.png'
	}
	if (drop == 7)
	{
		rapidfirePU = new rapidfirePUs.Sprite(x,y);
		rapidfirePU.d = 15;
		rapidfirePU.img = 'assets/drop items battery.png'
	}
	//console.log(drop);
}

function nextStageSwitch()
{
	if (enemies.length == 0)
	{
		gameState = 'nextStage';
		stageCooldown = frameCount;
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


//creates camera boarder(dashboard)
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
	HUD = new Sprite(1309, 135,173,135);
	HUD.color = color(5,25,5,180);
	//HUD.layer = 5;
	HUD.collider = 'none';
	HUD.strokeWeight = 0;
}

function rapidFireLight()
{
	if (rapidfiring == true)
	{
		push();
		stroke(color('black'))
		//strokeWeight(2);
		fill(color('darkred'));
		textSize(14)
		text("RAPID-FIRE ACTIVATED",HUD.x-62,HUD.y + 60);
		pop();
	}
}

function instructionsSetup()
{
	greenItemSprite = new Sprite(1195,height/2 + 20);
	greenItemSprite.img = greenItem;
	greenItemSprite.rotationSpeed = 1;
	greenItemSprite.offset.x = 5;
	greenItemSprite.collider = 'n';
	greenItemSprite.scale = 0.70;
	rapidFireSprite = new Sprite(greenItemSprite.x,greenItemSprite.y + 50);
	rapidFireSprite.img = battery;
	rapidFireSprite.rotationSpeed = 1;
	rapidFireSprite.offset.x = 4;
	rapidFireSprite.collider = 'n';
	rapidFireSprite.scale = 0.85;
	
}

function instructions()
{
	// Power up instructions
	push();
	fill(color(5,25,5,180));
	rect(greenItemSprite.x - 30, greenItemSprite.y - 30,245,110)
	stroke('black');
	strokeWeight(2);
	fill(color('darkgreen'));
	textAlign(LEFT,CENTER);
	textSize(20);
	text(" - Extra Life",greenItemSprite.x + 25, greenItemSprite.y);
	text(" - Rapid Fire Power-up",greenItemSprite.x + 25, greenItemSprite.y + 50);
	pop();

	let instX = 150;
	let instY = 200;
	let textW = 195;

	// general game instructions
	push();
	fill(color(5, 25, 5, 180));
	rect(instX, instY, 200, 300);
	stroke('black');
	strokeWeight(2);
	fill(color('darkgreen'));
	textAlign(CENTER, TOP);
	textSize(20);
	text("HOW TO PLAY",instX,instY + 10, 200, 50);
	line(instX, instY + 35, instX + 200, instY + 35)
	textSize(15);
	textAlign(CENTER, TOP);
	text("LMB = FIRE",instX,instY + 45, 200);
	text("WASD = MOVE",instX,instY + 65, 200);
	text("HOLD SPACE = TRACTOR BEAM",instX,instY + 85, 200);
	line(instX, instY + 110, instX + 200, instY + 110);
	textAlign(CENTER, TOP);
	text("Destroy all of the enemy space ships to move on.", instX + 5, instY + 120, textW-3, 300);
	text("Use the tractor beam to collect power ups", instX+5, instY + 165, textW - 3, 300);
	text("Lives are displayed at the bottom of the window - If you lose all your lives it's game over.", instX, instY + 210, textW, 300);
	pop();
}

function title()
{
	push()
	scale(0.60);
	animation(titleAni,width/2 + 510,height/2 + 85);
	pop();
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
	Bttn_start = new buttons.Sprite(width/2 + 10,height/2 + 130,100,50);
	Bttn_start.img = startButtonImg
	Bttn_start.collider = 'k';
	Bttn_start.scale = 2;
	//Bttn_start.img = 'assets/empty.png';
	
}

function startButton()
{
	if (Bttn_start.mouse.presses())
	{
		beginTimer = frameCount;
		Bttn_start.remove();
		rapidFireSprite.remove();
		greenItemSprite.remove();
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


function nextStageSetup()
{

	if (tripNextStage == false)
	{	
		enlasers.remove();
		lasers.remove();
		Bshield.ani = ['down', 'idledown'];
		setTimeout(nextStageButton,3600)
		setTimeout(function() {stageClearSprite.ani = ['play','end'];},1500)
		setTimeout(function() {player1.moveTo(0,0,75);},1700)
		setTimeout(enemyIncrease,3500);
		//Bttn_nextStage.textColor = color('white');
		tripNextStage = true;
	}
	if(frameCount - stageCooldown > 217)
	{
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
}

function nextStageButton()
{
	camera.on()
	camera.x = 0
	camera.y = 0
	camera.off()
	Bttn_nextStage = new buttons.Sprite(width/2, height/2 + 100, 100, 75);
	Bttn_nextStage.img = continueButtonImg;
	Bttn_nextStage.scale = 2
	Bttn_nextStage.collider = 'k';

}

function enemyIncrease()
{
	enBrnStartamt += enBrnIncAmt;
	enEStartamt += enEIncAmt;
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
	}
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
	if (frameCount - TbeamCooldown > 30)
	{
		if (kb.space == 15)
		{
			Tbeam.ani = ['down','idledown']
			TbeamDown = true
		}
	}
	if(TbeamDown == true)
	{
		if (kb.released('space'))
		{
			Tbeam.ani = ['up','idleup'];
			TbeamDown = false;
			TbeamCooldown = frameCount;
		}		
	}
}

function pause()
{
	if (gamePaused)
	{
		push();
		textSize(30)
		fill(color('darkred'))
		textAlign(CENTER,CENTER)
		text('paused',width/2,height/2 - 50)
		pop();
	}
}

function keyPressed() 
{
	if (keyCode === ESCAPE) {
	  gamePaused = !gamePaused;
  
	  if (gamePaused) {
		
		noLoop();
	  } else {
		// Resume the game
		loop();
	  }
	}
  }
		









//was trying to make mini map instead of arrow pointer
/*
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
*/



/*  ISSUES
2. i believe enemy explosions animation doesnt finish if killing enemies in quick succesion
fixed 
4. balancing


		WIP
1. power ups. currently just add life.// added rapid fire
2. adding asteroids
3. add homing missles for eye balls



	CHANGE LOG 
	5/28/23
	- added instructions
	- added player hit animation
	- reset option (refreshes page)
	- added start screen
	- added next stage screen
	- added stage count
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


