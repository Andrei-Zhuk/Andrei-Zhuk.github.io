var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {
    game.load.spritesheet('player', 'assets/spritesheet.png', 80, 89);
    game.load.spritesheet('explosion', 'assets/explosion.png', 64, 64);
    game.load.image('background', 'assets/back_800x600.png');
    game.load.image('bullet', 'assets/bullet_1.png');
    game.load.image('rock', 'assets/rock.png');
}

var player, backArr, currentFrame, weapon, rocks, rock, explosions, explosion, scoreText, score, stateText, gameStartTime;
score = 0;

function create() {
    gameStartTime = game.time.time;
    background = game.add.tileSprite(0, 0, 800, 600, 'background');

    game.physics.startSystem(Phaser.Physics.ARCADE);

    weapon = game.add.weapon(40, 'bullet');
    weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
    weapon.bulletSpeed = 500;
    weapon.fireRate = 200;
    weapon.bulletAngleOffset = 90;
    weapon.enableBody = true;

    rocks = game.add.group();
    rocks.enableBody = true;
    rocks.physicsBodyType = Phaser.Physics.ARCADE;


    

    player = game.add.sprite(80, game.world.height - 150, 'player');
    weapon.trackSprite(player, 40, 0);
    game.physics.arcade.enable(player);
    player.body.bounce.y = 0.2;
    player.body.collideWorldBounds = true;
    player.animations.add('left', [3, 2, 1, 0], 10, false);
    player.animations.add('right', [5, 6, 7, 8], 10, false);

    cursors = game.input.keyboard.createCursorKeys();
    fireButton = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);

    explosions = game.add.group();

    scoreText = game.add.text(10, 10, 'Score: ' + score, { font: '24px Arial', fill: '#fff' });

    stateText = game.add.text(game.world.centerX,game.world.centerY,' ', { font: '84px Arial', fill: '#fff' });
    stateText.anchor.setTo(0.5, 0.5);
    stateText.visible = false;
}

var left, right, last;
left = false;
right = false;


function update() {
    if (Math.random() < 1 - Math.pow(0.993, game.time.elapsedSince(gameStartTime)/1000 * 0.5)) {
        rock = rocks.create(24 + Math.random() * (game.width - 48), -48, 'rock')
        rock.body.velocity.y = 200;
        rock.anchor.setTo(0.5, 0.5)

    }

    background.tilePosition.y += 2;

    player.body.velocity.x = 0;
    player.body.velocity.y = 0;

    if (fireButton.isDown) {
        weapon.fire();
    }

    if (cursors.left.isDown) {
        if (player.animations.currentFrame.index === 0) {
            left = true
        }
        player.body.velocity.x = -300;
        if (left) {
            player.frame = 0;
        } else {
            player.animations.play('left');
        }
    } else if (cursors.right.isDown) {
        if (player.animations.currentFrame.index === 8) {
            right = true
        }
        player.body.velocity.x = 300;     
        if (right) {
            player.frame = 8;
        } else {
            player.animations.play('right');
        }
    } else {
        left = false;
        right = false;
        player.animations.stop();
        player.frame = 4;
    }

    if (cursors.up.isDown) {
        player.body.velocity.y = -300;
    } else if (cursors.down.isDown) {
        player.body.velocity.y = 300;
    }

    game.physics.arcade.overlap(weapon.bullets, rocks, explosionMaker, null, this);
    game.physics.arcade.overlap(player, rocks, deathMaker, null, this);
}

function explosionMaker (bullet, rock) {
    score += 10;
    scoreText.text = 'Score: '+ score;
    bullet.kill();
    rock.kill();
    explosion = explosions.create(rock.body.x, rock.body.y, 'explosion');
    explosion.animations.add('boom')
    explosion.anchor.setTo(0.1, 0.1)
    explosion.play('boom', 30, false, true)

}

function deathMaker(player, rock) {
    player.kill();
    // enemyBullets.callAll('kill');

    stateText.text=" GAME OVER \n Click to restart";
    stateText.visible = true;

    //the "click to restart" handler
    game.input.onTap.addOnce(restart,this);
}

function restart () {

    //  A new level starts
    
    //resets the life count
    //  And brings the aliens back from the dead :)
    rocks.removeAll();

    //revives the player
    player.revive();

    score = 0;
    scoreText.text = 'Score: '+ score;
    gameStartTime = game.time.time;
    //hides the text
    stateText.visible = false;

}