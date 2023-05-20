/*	
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
let lazers;  				//lazers group
let lazer;					//lazer sprite
let lazerStartAnim;
let lazerFlyAnim;
let enlazers;  				//enemy lazers group
let enlazer;   				//enemy lazers sprite
let pUFOanim;  				//animation for player ufo
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
let lazerSheet;         	//sprite sheet for lazer
let lifePU;
let lifePUs = [];
let rapidfirePU;
let rapidfirePUs = [];
let rapidfiring = false;
let PwrUps;
let Tbeam
let nextStageimg;       //img for next stage
let plyrShotTmr = 0
let plyrShotTmrstrt = -30;
let gameState = "title"; // title, start, run, next stage, game over.
let tripNextStage = false;

function setup() {
	createCanvas(1500, 750);
	allSprites.pixelPerfect = true;
	wrldCenter = createVector(width/2,height/2);
	camera.x = wrldCenter.x;
	camera.y = wrldCenter.y;
	camera.zoom = 0.5;  //default 0.75
	background(32,34,50);
	Dashboard();
	createButtons()

	//miniMap = createImage(100, 50);
	//nextStageSetup();
	//Tbeam.debug = true;
	//scrbrd.setAlpha(100);
	//pointer.debug = true;
	//player1.debug = true;	
}

function draw() {
	//clear();
	startButton()
	if (gameState == "start")
	{
		player();
		setupEnemies();
		createHUD();
		Lazer();
		PwrUpsGroup();
		PwrUpsSubGroup();
		enemyLazer();
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
		camera.on();
		push();
		scale(2.5);
		animation(BckgrndAni,width/2,height/2)
		pop();
		DrawThingsOnCam();
		Camera1();
		camera.off();
		//console.log(player1.x,player1.y);
		setGameOver();
		//nextStageStart();
		lives.draw();
		FlyingLimit();
		TractorBeam();
		LifePickup();
		rapidFirePickup();
		rapidFire();
		enemyRest();
		buttons.draw();
		setPointer();
		Dashboard();
		HUD.draw();
		pointer.draw();
		scoreBoard();
		PwrUpsRest();
		nextStageSwitch();
		resetAction();
	}
	if(gameState == 'nextStage')
	{
		background(32,34,50);
		animation(BckgrndAni,width/2,height/2);
		Dashboard();
		player1.speed = 0;
		nextStageButton();
		Bttn_nextStage.draw();

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
	//MiniMap();
}

//images/anims to preload
function preload()
{
	nextStageimg = loadImage('stage clear2.png');
	gameover = loadImage('you died bigger.png');
	dashboard = loadImage('SPACESHIP WINDOW & CONTROLS XL.png');
	pointerImg = loadImage('arrow pointer.png');
	DSxplAni = loadAnimation('splode v3.png', { frameSize: [540, 420], frames: 10, frameDelay: 5})
	BckgrndAni = loadAnimation('Night sky v2xx.png',{frameSize: [2400, 1200], frames: 8, frameDelay: 10});
	BckgrndAni.scale = 1.5;

	Eexplns = new Group();
	Eexplns.spriteSheet = 'eye splode v2.png';// needs fixed
	Eexplns.addAnis({explode: { width:600, height: 400, row: 0, frames: 8, frameDelay: 5},
									hit: { width:600, height: 400, row: 1, frames: 3, frameDelay: 15}});

	enlazers = new Group();
	enlazers.spriteSheet = 'blaster.png';
	enlazers.addAnis({shoot: { width : 50, height: 25, row: 0, frames: 11, frameDelay: 4 },
						fly: { width : 50, height: 25, row: 1, frames: 3 , frameDelay: 4 }});

	lazers = new Group();
	lazers.spriteSheet = 'ufo zaps.png';
	lazers.addAnis({shoot: { width : 100, height: 50, row: 0, frames: 16, frameDelay: 4 },
					fly: { width : 100, height: 50, row: 1, frames: 3 , frameDelay: 4 }});
	
	Tbeam = new Sprite();
	Tbeam.spriteSheet = 'Beam Sheetnew.png'
	Tbeam.addAnis({down: { width : 100, height: 100, row: 0, frames: 6, frameDelay: 10 },
								 up: { width : 100, height: 100, row: 1, frames: 6 , frameDelay: 10 },
								 idleup: {width : 100, height: 100, row: 0, frames: 1 },
								 idledown: {width : 100, height: 100, row: 1, frames: 1 }});
	Tbeam.ani = 'idleup'

	pUFOanim = loadAnimation("UFO V2.png","UFO V2 STEALTH.png");
	pUFOanim.frameDelay = 10
}

// set up player sprite
function player()
{
	player1 = new Sprite(width/2,height/2,[[57,35],[-114,0],[57,-35]]);
	//player1.diameter = 20;
	//player1.color = color('green');
	player1.layer = 2;
	player1.img = pUFOanim;
	player1.collider = 'k';
}

function pMove()
{
	// Moves UFO with wasd and keeps it under top speed.
	var maxSpeed = 10;
	if (player1.speed <= maxSpeed && player1.speed >= maxSpeed * -1)
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
	// Make the player overlap and not collide with lazers.
	player1.overlaps(lazers);
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
		if (enemiesDS[i].collides(lazers))
		{
			DSexplnsSprite(enemiesDS[i].x + 14,enemiesDS[i].y + 15,enemiesDS[i].rotation);
			pwrUpDrop(enemiesDS[i].x,enemiesDS[i].y);
			score += 1;
			enemiesDS[i].remove();
		}
	}
	for (let i = 0; i < enemiesE.length;i++)
	{
		if (enemiesE[i].collides(lazers))
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
	if (player1.collided(enlazers))
			{
			playerHealth -= 21;
			lives[i].remove();
			i--;
			}
}

function playerShake()
{

}
//removes shot lazers when collided with enemy
function laserDestr()
{
	for (let i = 0; i < lazers.length;i++)
	{
		if (lazers[i].collided(enemies))
		{
			lazers[i].remove();
		}
	}
	for (let i = 0; i < enlazers.length; i++)
	{
		if (enlazers[i].collided(player1))
		{
			enlazers[i].remove();
		}
	}
	lazers.scale = 1.2;
	if (lazers.speed < 6)
		{
			lazers.speed *= 1.05
		}
}

// Setting up group of lazer sprites
function Lazer()
{

	lazers.width = 10;
	lazers.speed = 1;
	lazers.height = 15;
	lazers.life = 300;


}

// makes new lazer on mouse and sets properties.
// starts lazer at player center and shoots towards mouse.
function shootLazer()
{
	if (rapidfiring == false)
	{
		plyrShotTmr = frameCount - plyrShotTmrstrt;
		if (mouse.presses())
		{
			if (plyrShotTmr >= 20)
			{
				plyrShotTmrstrt = frameCount;
				lazer = new lazers.Sprite(0,0,50,25);
				lazer.x = player1.x;
				lazer.y = player1.y;
				lazer.layer = 1;
				lazer.rotation = player1.angleTo(mouse);
				lazer.direction = lazer.angleTo(mouse);
				lazer.ani = ['shoot','fly']
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
//not used. testing
function nextStageSetup()
{
	nextStageimg = new Sprite();
	nextStageimg.d = 1;
	nextStageimg.img = 'stage clear.png'
	nextStageimg.collider = 'none';
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
//sets up enemy lazer sprite.
function enemyLazer()
{
	enlazers.width = 12;
	enlazers.height = 5;
	enlazers.speed = 4;
	enlazers.life = 300;
	enlazers.layer = 1;
	enlazers.scale = 2
	lazers.overlaps(enlazers);
	enemies.overlaps(enlazers);
	enlazers.overlaps(enlazers);
	lazers.overlaps(Tbeam);
	enlazers.overlaps(Tbeam);
	//lazers.overlaps(PwrUps);
	//enlazers.overlaps(PwrUps);
}

//makes enmies shoot when player come with in a distance. shoot timer gaps the shots.
function shootEnemyLazer()
{//shoots once every second
	if (frameCount % 60 == 0 )
	{//for all enemies if distance of enemyi is less then 400px to player then enemyi shoot
		for ( var i = 0; i < enemies.length; i++)
		{
		let PtoEdist = dist(enemies[i].x,enemies[i].y,player1.x,player1.y);
		let x = abs(PtoEdist);
		if (x < 600)
			{
			enlazer = new enlazers.Sprite();
			enlazer.ani = ['shoot','fly']
			enlazer.x = enemies[i].x;
			enlazer.y = enemies[i].y;
			enlazer.rotation = enemies[i].angleTo(player1);
			enlazer.direction = enlazer.angleTo(player1);
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
		textFont('fantasy');
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
function scoreBoard()
{

	push();
		
	pop();
	stroke('black');
	fill('darkgreen');
	textAlign(CENTER,CENTER);
	textFont('fantasy');
	textSize(11);
	text("ENEMIES",1250,76);
	push();
	stroke('black');
	fill('darkgreen');
	textAlign(CENTER,CENTER);
	textFont('fantasy');
	textSize(20);
	text(enemies.length,1250,91);
	pop();
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
				lazer = new lazers.Sprite(0,0,50,25);
				lazer.x = player1.x;
				lazer.y = player1.y;
				lazer.layer = 1;
				lazer.rotation = player1.angleTo(mouse);
				lazer.direction = lazer.angleTo(mouse);
				lazer.ani = ['shoot','fly']
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
				oneUpText();
				lifePUs[i].remove();
			}
		}
	}
		//console.log(livesleft)
}

function oneUpText()
{
	for (let i = 0; i < 10; i++)
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
	}
}

//starts next stage img and trips nestStage() when enemies group == 0.
function nextStageStart()
{
	if (gameOver === false)
	{
		if (enemies.length === 0)
		{
			push();
			if (alpha1 < 240)
			{
				alpha1 += 1;
				tint(255,alpha1)
			}
			scale(1.5);
			image(nextStageimg,0,0)
			pop()
			if (alpha1 === 240)
			{
				nextStage();
				nextstage = true;
			}
		}
	}

}
// adds enemies to the start amount when nextstage is true.
function nextStage()
{
		if (nextstage === true)
	{
		alpha1 = 0;
	}
	nextstage = false;
}

// collecting the sprites and objects so the can be drawn on camera and are effected by the zoom.
function DrawThingsOnCam()
{
	enlazers.draw();
	enemies.draw();
	lazers.draw();
	enemyHit();
	laserDestr();
	shootEnemyLazer();
	playerHit();
	pMove();
	shootLazer();
	DSexplns.draw();
	Eexplns.draw();
	PwrUps.draw();
	Tbeam.draw();
	//player1.draw();
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

function createButtons()
{
	buttons = new Group();
	Bttn_start = new buttons.Sprite(width/2,height/2,200,100);
	Bttn_start.color = color('blue')
	Bttn_start.text = 'START';
	Bttn_start.textColor = color('lightblue')
	Bttn_start.textSize = 30;
	Bttn_start.collider = 'k';
}

function startButton()
{
	if (Bttn_start.mouse.presses())
	{
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
	Bttn_reset.collider = 'k';

}

function resetAction()
{
	if (Bttn_reset.mouse.presses())
	{
		location.reload()
	}
}


function nextStageButton()
{
	if (tripNextStage == false)
	{
		Bttn_nextStage = new buttons.Sprite(width/2, height/2, 200, 100);
		//Bttn_nextStage.color = color('red');
		Bttn_nextStage.text = 'CONTINUE';
		//Bttn_nextStage.textColor = color('white');
		tripNextStage = true;
	}
	if (Bttn_nextStage.mouse.presses())
	{
		enDSStartamt += 10;
		enEStartamt += 5;
		createEnemies();
		tripNextStage = false;
		Bttn_nextStage.remove();
		gameState = 'run';
	}
}

//create pointer sprite
function Pointer()
{
	pointer = new Sprite(1308,135,20,20);
	pointer.collider = 'k';
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
/*
function MiniMap()
{
	for (let i = 0; i < enemies.length; i++)
	{
		miniMap.loadPixels();
		miniMap.set(enemies[i].x / 3, enemies[i].y / 3, color('red'));
	}
	miniMap.updatePixels();
	push();
	scale(5);
	image(miniMap, 500, 500);
	pop();
}
*/



/*  ISSUES
*** need to add start button working on setting up game loop. title => start => run => game over => restart
                                                                                	||=>reset
fixed 1. pointer does not always point to next enemy after first enemy is killd. starts working again once 
new enemy is close "enough".
2. i believe enemy explosions animation doesnt finish if killing enemies in quick succesion
fixed 3. enemies and pwrups still spawn out of boundry
4. balancing
5. background need resized

		WIP
1. power ups. currently just add life.// added rapid fire
2. life powerup sprite
3. might make canvas bigger and make play area bigger


	CHANGE LOG 
	5/17/23
	- added max lives to life pickup. max lives is 5.
	fixes
	- enemy and player lazers no longer push power ups off into the distance.
	5/13/23
	- added rapid fire to the power ups.
	- power ups now spawn on enemy destruction with chance of 1 out of 10.
	- expanded map and enemy spawns.
	fixes
	- fixed the arrow. now points correctly.
	- fixed player not slowing to a stop.
	- enemies no longer spawn within shooting distance of player.
*/


