var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {
    game.load.spritesheet('dude', 'assets/spritesheet.png', 80, 89);
    game.load.image('background', 'assets/back_800x600.png')

}

var player, backArr, currentFrame;

function create() {
    background = game.add.tileSprite(0, 0, 800, 600, 'background');

    game.physics.startSystem(Phaser.Physics.ARCADE);

    player = game.add.sprite(80, game.world.height - 150, 'dude');
    game.physics.arcade.enable(player);
    player.body.bounce.y = 0.2;
    player.body.collideWorldBounds = true;
    player.animations.add('left', [3, 2, 1, 0], 10, false);
    player.animations.add('right', [5, 6, 7, 8], 10, false);

    cursors = game.input.keyboard.createCursorKeys();
}

var left, right;
left = false;
right = false;


function update() {
    background.tilePosition.y += 2;

    player.body.velocity.x = 0;
    player.body.velocity.y = 0;

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