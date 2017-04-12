var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update });

function preload() {
    game.load.audio('background_loop', 'assets/8bit-background_cut (online-audio-converter.com).mp3');
    game.load.spritesheet('player', 'assets/player_1part.png', 28, 31);
    game.load.spritesheet('player2', 'assets/player_2part.png', 80, 49);
    game.load.spritesheet('explosion', 'assets/explosion.png', 64, 64);
    game.load.spritesheet('player_explosion', 'assets/exp2_0.png', 64, 64);
    game.load.image('background', 'assets/back_800x600.png');
    game.load.image('bullet', 'assets/bullet_1.png');
    game.load.image('rock', 'assets/rock.png');
    game.load.audio('shoot', 'assets/shoot-5.wav');
    game.load.audio('explosion_sound', 'assets/explosion-4.wav');
    game.load.audio('player_explosion_sound', 'assets/explosion2.wav');
    game.load.spritesheet('volume', 'assets/volume_sprite.png', 30, 30);
}

var player, backArr, currentFrame, weapon, fireButton, changeButton, rocks, rock, explosions, explosion, 
explosionSound, scoreText, score, bestScore, stateText, gameStartTime, fire, playerExplosion, playerExplosionSound, 
shoot, shootType, backgroundTheme, shiftWasDown, volume, volumeButton, volumeMute, gameIsOn, startText;
score = 0;
shootType = 0;
shiftWasDown = false;
volumeMute = {
    pressed: false,
    count: 1
};
gameIsOn = false

function create() {
    bestScore = document.getElementById('best-score');

    backgroundTheme = game.add.audio('background_loop', 0.4, true);

    gameStartTime = game.time.time;
    background = game.add.tileSprite(0, 0, 800, 600, 'background');

    game.physics.startSystem(Phaser.Physics.ARCADE);

    weapon = game.add.weapon(40, 'bullet');
    weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
    weapon.bulletSpeed = 500;
    weapon.fireRate = 150;
    weapon.bulletAngleOffset = 90;
    weapon.enableBody = true;
    weapon.onFire.add(function() {shoot.play()})

    weaponP1 = game.add.weapon(40, 'bullet');
    weaponP1.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
    weaponP1.bulletSpeed = 500;
    weaponP1.fireRate = 200;
    weaponP1.bulletAngleOffset = 90;
    weaponP1.fireAngle = 250;
    weaponP1.enableBody = true;
    weaponP1.onFire.add(function() {shoot.play()})

    weaponP2 = game.add.weapon(40, 'bullet');
    weaponP2.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
    weaponP2.bulletSpeed = 500;
    weaponP2.fireRate = 200;
    weaponP2.bulletAngleOffset = 90;
    weaponP2.fireAngle = 290;
    weaponP2.enableBody = true;
    weaponP2.onFire.add(a => shoot.play())


    rocks = game.add.group();
    rocks.enableBody = true;
    rocks.physicsBodyType = Phaser.Physics.ARCADE;


    

    player = game.add.sprite(80, game.world.height - 150, 'player');
    weapon.trackSprite(player, 12, 0);
    weaponP1.trackSprite(player, 12, 0);
    weaponP2.trackSprite(player, 12, 0);
    game.physics.arcade.enable(player);
    player.body.collideWorldBounds = true;
    player.animations.add('left', [3, 2, 1, 0], 10, false);
    player.animations.add('right', [5, 6, 7, 8], 10, false);

    player2 = game.add.sprite(54, game.world.height - 119, 'player2');
    game.physics.arcade.enable(player2);
    player2.body.collideWorldBounds = true;
    player2.animations.add('left', [3, 2, 1, 0], 10, false);
    player2.animations.add('right', [5, 6, 7, 8], 10, false);

    cursors = game.input.keyboard.createCursorKeys();
    fireButton = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
    changeButton = game.input.keyboard.addKey(Phaser.KeyCode.SHIFT);

    shoot = game.add.audio('shoot')
    shoot.volume = 0.1;

    explosions = game.add.group();

    playerExplosions = game.add.group();
    playerExplosionSound = game.add.audio('player_explosion_sound');
    playerExplosionSound.volume = 0.6;

    explosionSound = game.add.audio('explosion_sound');

    scoreText = game.add.text(10, 10, 'Score: ' + score, { font: '24px Arial', fill: '#fff' });

    stateText = game.add.text(game.world.centerX,game.world.centerY,' ', { font: '84px Arial', fill: '#fff' });
    stateText.anchor.setTo(0.5, 0.5);
    stateText.visible = false;

    volume = game.add.sprite(game.world.width - 40, 10, 'volume')
    volume.frame = 1;

    volumeButton = game.input.keyboard.addKey(Phaser.KeyCode.M);

    player.kill();
    player2.kill();
    fire = function(){}
    startText = game.add.text(game.world.centerX,game.world.centerY,' ', { font: '84px Arial', fill: '#fff' });
    startText.anchor.setTo(0.5, 0.5);
    startText.text = "Click to start"
    game.input.onTap.addOnce(start,this);
}

var left, right, last;
left = false;
right = false;


function update() {
    player.body.x = player2.body.x + 26;

    if ((Math.random() < 1 - Math.pow(0.993, game.time.elapsedSince(gameStartTime)/1000 * 0.5)) && gameIsOn) {
        rock = rocks.create(40 + Math.random() * (game.width - 80), -48, 'rock')
        rock.body.velocity.y = 200;
    }

    background.tilePosition.y += 2;

    player.body.velocity.x = 0;
    player.body.velocity.y = 0;
    player2.body.velocity.x = 0;
    player2.body.velocity.y = 0;

    if (fireButton.isDown) {
        fire();
    }

    if (changeButton.isDown) {
        shiftWasDown = true;
    }

    if (changeButton.isUp && shiftWasDown) {
        shiftWasDown = false;
        shootType++;
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

    if (cursors.left.isDown && player2.body.x != 0) {
        if (player.animations.currentFrame.index === 0) {
            left = true
        }
        player.body.velocity.x = -300;
        player2.body.velocity.x = -300;
        if (left) {
            player.frame = 0;
            player2.frame = 0;
        } else {
            player.animations.play('left');
            player2.animations.play('left');
        }
    } else if (cursors.right.isDown && player2.body.x != game.world.width - 80) {
        if (player.animations.currentFrame.index === 8) {
            right = true
        }
        player.body.velocity.x = 300; 
        player2.body.velocity.x = 300;     
        if (right) {
            player.frame = 8;
            player2.frame = 8;
        } else {
            player.animations.play('right');
            player2.animations.play('right');
        }
    } else {
        left = false;
        right = false;
        player.animations.stop();
        player2.animations.stop();
        player.frame = 4;
        player2.frame = 4;
    }

    if (cursors.up.isDown && player.body.y != 0) {
        player.body.velocity.y = -300;
        player2.body.velocity.y = -300;
    } else if (cursors.down.isDown && player2.body.y != game.world.height - 49) {
        player.body.velocity.y = 300;
        player2.body.velocity.y = 300;
    }

    game.physics.arcade.overlap(weapon.bullets, rocks, explosionMaker, null, this);
    game.physics.arcade.overlap(weaponP1.bullets, rocks, explosionMaker, null, this);
    game.physics.arcade.overlap(weaponP2.bullets, rocks, explosionMaker, null, this);
    game.physics.arcade.overlap(player, rocks, deathMaker, null, this);
    game.physics.arcade.overlap(player2, rocks, deathMaker, null, this);
}

function explosionMaker (bullet, rock) {
    score += 10;
    scoreText.text = 'Score: '+ score;
    bullet.kill();
    rock.kill();
    explosionSound.play();
    explosion = explosions.create(rock.body.x, rock.body.y, 'explosion');
    explosion.animations.add('boom')
    explosion.anchor.setTo(0.1, 0.1)
    explosion.play('boom', 30, false, true)

}

function deathMaker(plr, rock) {
    player.kill();
    player2.kill();

    playerExplosionSound.play()

    playerExplosion = playerExplosions.create(plr.body.x - 10, plr.body.y - 10, 'player_explosion');
    playerExplosion.animations.add('boom');
    playerExplosion.play('boom', 30, false, true)
    
    fire = function(){}

    stateText.text=` GAME OVER \n Your Score is: ${score} \n Click to restart`;
    stateText.visible = true;

    game.input.onTap.addOnce(restart,this);
}

function restart () {
    rocks.removeAll();

    player.revive();
    player2.revive();

    if (score > +bestScore.innerHTML) {
        bestScore.innerHTML = score;
    }

    score = 0;
    scoreText.text = 'Score: '+ score;
    gameStartTime = game.time.time;

    stateText.visible = false;

    fire = function(){
        if (shootType % 2 === 0) {
            weapon.fire();
        } else {
            weaponP1.fire();
            weaponP2.fire();
        }
    }

}

function start() {
    gameIsOn = true;
    startText.visible = false;
    fire = function(){
        if (shootType % 2 === 0) {
            weapon.fire();
        } else {
            weaponP1.fire();
            weaponP2.fire();
        }
    }
    gameStartTime = game.time.time;
    player.revive();
    player2.revive();
    backgroundTheme.play();
}