var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {
    game.load.spritesheet('dude', 'assets/spritesheet.png', 80, 89);
    game.load.image('background', 'assets/back_800x600.png');
    game.load.image('bullet', 'assets/bullet_1.png');
    game.load.image('rock', 'assets/rock.png');
}

var player, backArr, currentFrame, weapon, rocks, rock;



function create() {
    background = game.add.tileSprite(0, 0, 800, 600, 'background');

    game.physics.startSystem(Phaser.Physics.ARCADE);

    weapon = game.add.weapon(40, 'bullet');
    weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
    weapon.bulletSpeed = 500;
    weapon.fireRate = 200;
    weapon.bulletAngleOffset = 90;

    rocks = game.add.group();
    rocks.enableBody = true;
    rocks.physicsBodyType = Phaser.Physics.ARCADE;


    

    player = game.add.sprite(80, game.world.height - 150, 'dude');
    weapon.trackSprite(player, 40, 0);
    game.physics.arcade.enable(player);
    player.body.bounce.y = 0.2;
    player.body.collideWorldBounds = true;
    player.animations.add('left', [3, 2, 1, 0], 10, false);
    player.animations.add('right', [5, 6, 7, 8], 10, false);

    cursors = game.input.keyboard.createCursorKeys();
    fireButton = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
}

var left, right, last;
left = false;
right = false;


function update() {
    if (Math.random() < 1 - Math.pow(0.993, game.time.now/1000 * 0.1)) {
        rock = rocks.create(24 + Math.random() * (game.width - 48), -48, 'rock')
        rock.body.velocity.y = 200;

    }

    background.tilePosition.y += 2;

    player.body.velocity.x = 0;
    player.body.velocity.y = 0;

    if (fireButton.isDown) {
        weapon.fire();
        console.log('fire')
    }

    if (cursors.left.isDown) {
        if (player.animations.currentFrame.index === 0) {
            left = true
        }
        player.body.velocity.x = -150;
        if (left) {
            player.frame = 0;
        } else {
            player.animations.play('left');
        }
    } else if (cursors.right.isDown) {
        if (player.animations.currentFrame.index === 8) {
            right = true
        }
        player.body.velocity.x = 150;     
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
        player.body.velocity.y = -200;
    } else if (cursors.down.isDown) {
        player.body.velocity.y = 200;
    }
}

function render() {

    weapon.debug();

}