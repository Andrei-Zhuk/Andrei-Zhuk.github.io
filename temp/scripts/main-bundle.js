/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

var game = new Phaser.Game(1024, 768, Phaser.AUTO, 'game', { preload: preload, create: create, update: update });

function preload() {
    game.load.audio('background_loop', 'assets/8bit-background_cut (online-audio-converter.com).mp3');
    game.load.spritesheet('player', 'assets/player_1part.png', 28, 31);
    game.load.spritesheet('player2', 'assets/player_2part.png', 80, 49);
    game.load.spritesheet('explosion', 'assets/explosion.png', 64, 64);
    game.load.spritesheet('player_explosion', 'assets/exp2_0.png', 64, 64);
    game.load.image('background', 'assets/space-1.png');
    game.load.image('bullet', 'assets/bullet_1.png');
    game.load.image('bullet_2', 'assets/bullet_2.png');
    game.load.image('rock', 'assets/rock.png');
    game.load.image('alien-scout', 'assets/5B.png');
    game.load.image('alien-scout-bullet', 'assets/alien-scout-bullet.png');
    game.load.audio('shoot', 'assets/shoot-5.wav');
    game.load.audio('explosion_sound', 'assets/explosion-4.wav');
    game.load.audio('player_explosion_sound', 'assets/explosion2.wav');
    game.load.spritesheet('volume', 'assets/volume_sprite.png', 30, 30);
    game.load.image('double', 'assets/double.png');
    game.load.audio('double', 'assets/double_sound.wav');
}

var player, backArr, currentFrame, weapon, rocks, rock, explosions, explosion,
explosionSound, scoreText, score, bestScore, stateText, gameStartTime,
backgroundTheme, volume, volumeButton, volumeMute, gameIsOn,
startText, timer, doubles, doublePic, doubleTimer, doubleSound, index, tween, aliens;
score = 0;
volumeMute = {
    pressed: false,
    count: 1
};
gameIsOn = false;
index = 1;
player = {};
player.explosion = {};
weapon = {};
weapon.double = {};
weapon.changeButtonDown = false;
weapon.type = 0;
aliens = {};
aliens.scouts = {};

function create() {
    bestScore = document.getElementById('best-score');

    backgroundTheme = game.add.audio('background_loop', 0.4, true);

    gameStartTime = game.time.time;
    background = game.add.tileSprite(0, 0, 1024, 768, 'background');

    game.physics.startSystem(Phaser.Physics.ARCADE);

    weapon.single = game.add.weapon(-1, 'bullet');
    weapon.single.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
    weapon.single.bulletSpeed = 500;
    weapon.single.fireRate = 200;
    weapon.single.bulletAngleOffset = 90;
    weapon.single.enableBody = true;
    weapon.single.onFire.add(a => weapon.sound.play())

    weapon.double.part1 = game.add.weapon(-1, 'bullet');
    weapon.double.part1.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
    weapon.double.part1.bulletSpeed = 500;
    weapon.double.part1.fireRate = 400;
    weapon.double.part1.bulletAngleOffset = 90;
    weapon.double.part1.fireAngle = 250;
    weapon.double.part1.enableBody = true;
    weapon.double.part1.onFire.add(a => weapon.sound.play())

    weapon.double.part2 = game.add.weapon(-1, 'bullet');
    weapon.double.part2.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
    weapon.double.part2.bulletSpeed = 500;
    weapon.double.part2.fireRate = 400;
    weapon.double.part2.bulletAngleOffset = 90;
    weapon.double.part2.fireAngle = 290;
    weapon.double.part2.enableBody = true;
    weapon.double.part2.onFire.add(a => weapon.sound.play())

    weapon.big = game.add.weapon(-1, 'bullet_2');
    weapon.big.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
    weapon.big.bulletSpeed = 500;
    weapon.big.fireRate = 2000;
    weapon.big.bulletAngleOffset = 90;
    weapon.big.enableBody = true;
    weapon.big.onFire.add(a => weapon.sound.play())
    weapon.radius = 200;


    rocks = game.add.group();
    rocks.enableBody = true;
    rocks.physicsBodyType = Phaser.Physics.ARCADE;

    aliens.scouts.group = game.add.group();
    aliens.scouts.group.enableBody = true;
    aliens.scouts.group.physicsBodyType = Phaser.Physics.ARCADE;
    aliens.scouts.reloadTime = 1000;

    aliens.scouts.weapon = game.add.weapon(-1, 'alien-scout-bullet');
    aliens.scouts.weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
    aliens.scouts.weapon.bulletSpeed = 500;
    aliens.scouts.weapon.fireRate = 0;
    aliens.scouts.weapon.bulletAngleOffset = 90;
    aliens.scouts.weapon.enableBody = true;
    aliens.scouts.weapon.fireAngle = 90;
    // aliens.scouts.weapon.onFire.add(a => weapon.sound.play())

    player.part1 = game.add.sprite(80, game.world.height - 150, 'player');
    weapon.single.trackSprite(player.part1, 12, 0);
    weapon.double.part1.trackSprite(player.part1, 12, 0);
    weapon.double.part2.trackSprite(player.part1, 12, 0);
    weapon.big.trackSprite(player.part1, 12, 0);
    game.physics.arcade.enable(player.part1);
    player.part1.body.collideWorldBounds = true;
    player.part1.animations.add('left', [3, 2, 1, 0], 10, false);
    player.part1.animations.add('right', [5, 6, 7, 8], 10, false);

    player.part2 = game.add.sprite(54, game.world.height - 119, 'player2');
    game.physics.arcade.enable(player.part2);
    player.part2.body.collideWorldBounds = true;
    player.part2.animations.add('left', [3, 2, 1, 0], 10, false);
    player.part2.animations.add('right', [5, 6, 7, 8], 10, false);

    player.lifes = 3;
    player.health = document.getElementById('health');

    cursors = game.input.keyboard.createCursorKeys();
    weapon.fireButton = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
    weapon.changeButton = game.input.keyboard.addKey(Phaser.KeyCode.SHIFT);

    weapon.sound = game.add.audio('shoot')
    weapon.sound.volume = 0.2;

    explosions = game.add.group();

    player.explosions = game.add.group();
    player.explosion.sound = game.add.audio('player_explosion_sound');
    player.explosion.sound.volume = 0.6;

    explosionSound = game.add.audio('explosion_sound');

    scoreText = game.add.text(10, 10, 'Score: ' + score, { font: '24px Arial', fill: '#fff' });

    stateText = game.add.text(game.world.centerX,game.world.centerY,' ', { font: '84px Arial', fill: '#fff' });
    stateText.anchor.setTo(0.5, 0.5);
    stateText.visible = false;

    volume = game.add.sprite(game.world.width - 40, 10, 'volume')
    volume.frame = 1;

    volumeButton = game.input.keyboard.addKey(Phaser.KeyCode.M);

    player.part1.kill();
    player.part2.kill();
    weapon.fire = function(){}
    startText = game.add.text(game.world.centerX,game.world.centerY,' ', { font: '84px Arial', fill: '#fff' });
    startText.anchor.setTo(0.5, 0.5);
    startText.text = "Click to start"
    game.input.onTap.addOnce(start,this);

    timer = game.time.create(false);
    timer.loop(20000 + Math.random() * 10000, double, this);

    doubles = game.add.group();
    doubles.enableBody = true;
    doubles.physicsBodyType = Phaser.Physics.ARCADE;

    doubleTimer = game.time.create();
    doubleTimer.loop(10000, () => index = 1, this);

    doubleSound = game.add.audio('double')
    doubleSound.volume = 0.3;
}

player.left = false;
player.right = false;


function update() {
    rocks.forEachAlive(function(i) {i.body.x = i.startPointX + Math.sin(i.body.y * 3.14 / 180) * 10 * game.time.elapsedSince(gameStartTime)/30000})
    if ((Math.random() < 1 - Math.pow(0.993, game.time.elapsedSince(gameStartTime)/1000 * 0.5)) && gameIsOn) {
        rock = rocks.create(40 + Math.random() * (game.width - 80), -47, 'rock')
        rock.body.velocity.y = 200;
        rock.startPointX = rock.body.x;
    }

    // if ((Math.random() < 1 - 0.98) && gameIsOn) {
    //     aliens.scouts.single = aliens.scouts.group.create(50 + Math.random() * (game.width - 100), -100, 'alien-scout')
    //     aliens.scouts.single.body.velocity.y = 200;
    //     aliens.scouts.single.startTime = game.time.time;
    //     aliens.scouts.single.currentLifes = 2;
    // }
    //
    // aliens.scouts.group.forEachAlive(function(i) {
    //     if (i.body.y >= game.height + 79) {
    //         i.kill();
    //     } else if (game.time.elapsedSince(i.startTime) >= aliens.scouts.reloadTime){
    //         i.startTime = game.time.time;
    //         aliens.scouts.weapon.trackSprite(i, 24, 79);
    //         aliens.scouts.weapon.fire();
    //     }
    // })


    background.tilePosition.y += 2;

    player.part1.body.x = player.part2.body.x + 26;
    player.part1.body.y = player.part2.body.y - 31;

    player.part2.body.velocity.x = 0;
    player.part2.body.velocity.y = 0;

    if (weapon.fireButton.isDown) {
        weapon.fire();
    }

    if (weapon.changeButton.isDown) {
        weapon.changeButtonDown = true;
    }

    if (weapon.changeButton.isUp && weapon.changeButtonDown) {
        weapon.changeButtonDown = false;
        weapon.type++;
    }

    if (volumeButton.isDown) {
        volumeMute.pressed = true;
    }

    if (volumeButton.isUp && volumeMute.pressed) {
        volumeMute.pressed = false;
        volumeMute.count++;
        volume.frame = volumeMute.count % 2;
        if (volumeMute.count % 2 == 1) {
            backgroundTheme.volume = 0.4;
        } else {
            backgroundTheme.volume = 0;
        }
    }

    if (cursors.left.isDown && player.part2.body.x != 0) {
        if (player.part1.animations.currentFrame.index === 0) {
            player.left = true
        }
        player.part2.body.velocity.x = -300;
        if (player.left) {
            player.part1.frame = 0;
            player.part2.frame = 0;
        } else {
            player.part1.animations.play('left');
            player.part2.animations.play('left');
        }
    } else if (cursors.right.isDown && player.part2.body.x != game.world.width - 80) {
        if (player.part1.animations.currentFrame.index === 8) {
            player.right = true
        }
        player.part2.body.velocity.x = 300;
        if (player.right) {
            player.part1.frame = 8;
            player.part2.frame = 8;
        } else {
            player.part1.animations.play('right');
            player.part2.animations.play('right');
        }
    } else {
        player.left = false;
        player.right = false;
        player.part1.animations.stop();
        player.part2.animations.stop();
        player.part1.frame = 4;
        player.part2.frame = 4;
    }

    if (cursors.up.isDown && player.part1.body.y != 0) {
        player.part2.body.velocity.y = -300;
    } else if (cursors.down.isDown && player.part2.body.y != game.world.height - 49) {
        player.part2.body.velocity.y = 300;
    }

    game.physics.arcade.overlap(weapon.single.bullets, rocks, explosionMaker, null, this);
    game.physics.arcade.overlap(weapon.double.part1.bullets, rocks, explosionMaker, null, this);
    game.physics.arcade.overlap(weapon.double.part2.bullets, rocks, explosionMaker, null, this);
    game.physics.arcade.overlap(weapon.big.bullets, rocks, bigExplosionMaker, null, this);

    game.physics.arcade.overlap(player.part1, rocks, deathMaker, null, this);
    game.physics.arcade.overlap(player.part2, rocks, deathMaker, null, this);
    game.physics.arcade.overlap(player.part1, doubles, doubleEvent, null, this);
    game.physics.arcade.overlap(player.part2, doubles, doubleEvent, null, this);

    game.physics.arcade.overlap(weapon.single.bullets, aliens.scouts.group, alienBulletHit, null, this);
    game.physics.arcade.overlap(weapon.double.part1.bullets, aliens.scouts.group, alienBulletHit, null, this);
    game.physics.arcade.overlap(weapon.double.part2.bullets, aliens.scouts.group, alienBulletHit, null, this);
    game.physics.arcade.overlap(weapon.big.bullets, aliens.scouts.group, bigExplosionMaker, null, this);
}

function explosionMaker (bullet, rock) {
    score += 10 * index;
    scoreText.text = 'Score: '+ score;
    bullet.kill();
    rock.kill();
    explosionSound.play();
    explosion = explosions.create(rock.body.x, rock.body.y, 'explosion');
    explosion.animations.add('boom')
    explosion.anchor.setTo(0.1, 0.1)
    explosion.play('boom', 30, false, true)

}

function bigExplosionMaker(bullet, rock) {
    rocks.forEachAlive(function (i) {
        if (Math.sqrt(Math.pow((i.body.x - rock.body.x), 2) + Math.pow((i.body.y - rock.body.y), 2)) <= weapon.radius) {
            i.kill()
            explosion = explosions.create(i.body.x, i.body.y, 'explosion');
            explosion.animations.add('boom');
            explosion.anchor.setTo(0.1, 0.1);
            explosion.play('boom', 30, false, true);
            score += 10 * index;
        }
    });
    bullet.kill();
    rock.kill();
    explosionSound.play();
    scoreText.text = 'Score: '+ score;
}

function deathMaker(plr, rock) {
    player.lifes--;
    player.health.style.backgroundPositionX = `${-140 * player.lifes}px`;

    rock.kill();

    explosion = explosions.create(rock.body.x, rock.body.y, 'explosion');
    explosion.animations.add('boom');
    explosion.anchor.setTo(0.1, 0.1);
    explosion.play('boom', 30, false, true);

    explosionSound.play();

    if (player.lifes === 0) {
        player.part1.kill();
        player.part2.kill();

        player.explosion.sound.play()

        player.explosion.sprite = player.explosions.create(plr.body.x - 10, plr.body.y - 10, 'player_explosion');
        player.explosion.sprite.animations.add('boom');
        player.explosion.sprite.play('boom', 30, false, true)

        weapon.fire = function(){}

        stateText.text=` GAME OVER \n Your Score is: ${score} \n Click to restart`;
        stateText.visible = true;

        timer.stop();
        gameIsOn = false;

        game.input.onTap.addOnce(restart,this);
    }
}

function restart () {
    rocks.removeAll();

    player.part1.revive();
    player.part2.revive();

    player.lifes = 3;
    player.health.style.backgroundPositionX = `${-140 * player.lifes}px`;

    if (score > +bestScore.innerHTML) {
        bestScore.innerHTML = score;
    }

    score = 0;
    scoreText.text = 'Score: '+ score;
    gameStartTime = game.time.time;

    stateText.visible = false;

    weapon.fire = function(){
        if (weapon.type % 3 === 0) {
            weapon.single.fire();
        } else if(weapon.type % 3 === 1){
            weapon.double.part1.fire();
            weapon.double.part2.fire();
        } else {
            weapon.big.fire()
        }
    }
    timer.loop(20000 + Math.random() * 10000, double, this);
    timer.start();
    gameIsOn = true;
}

function start() {
    gameIsOn = true;
    startText.visible = false;
    weapon.fire = function(){
        if (weapon.type % 3 === 0) {
            weapon.single.fire();
        } else if(weapon.type % 3 === 1){
            weapon.double.part1.fire();
            weapon.double.part2.fire();
        } else {
            weapon.big.fire()
        }
    }
    gameStartTime = game.time.time;
    player.part1.revive();
    player.part2.revive();
    backgroundTheme.play();
    timer.start();
}

function double() {
    doublePic = doubles.create(40 + Math.random() * (game.width - 80), -48, 'double')
    doublePic.body.velocity.y = 200;
}

function doubleEvent(plr, doublePic) {
    doublePic.kill();
    index = 2;
    doubleTimer.start()
    doubleSound.play();
}

function alienBulletHit(bullet, scout) {
    bullet.kill();
    scout.currentLifes--;
    if (scout.currentLifes === 0) {
        scout.kill();
        score += 20 * index;
        scoreText.text = 'Score: '+ score;
        explosionSound.play();
        explosion = explosions.create(scout.body.x, scout.body.y, 'explosion');
        explosion.animations.add('boom')
        explosion.anchor.setTo(0.1, 0.1)
        explosion.play('boom', 30, false, true)
    }
}


/***/ })
/******/ ]);