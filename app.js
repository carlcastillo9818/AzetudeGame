/* 
Further progress updates will be written here (much like what I did for my Frogger game)


4-13-24 
This is the Phaser Javascript code for the Pong clone created by Carls and Radon. I started
by creating the main window for the game (black background at present) and one paddle.



The width and height properties set the size of the canvas element that Phaser will create.
In this case 1000 x 600 pixels. Your game world can be any size you like, 
but this is the resolution the game will display in.

When you set gravity: { y: 0 }, it means there is no vertical gravity acting on 
the object. It won’t fall or rise due to gravity. This can be useful for creating 
scenarios where you want to simulate a zero-gravity environment
 or where you manually handle the object’s movement without relying on gravity.
*/
var config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

// game objects
var playerPaddle;
// var platform;
var ball;
var game = new Phaser.Game(config);

/**  About each function:
 * preload() {} — a method that defines what we need to load before the scene and from where. We’ll use it to load assets later on.
create(data) {} — a method that gets triggered when a scene is created. In it, we’ll specify positioning for 
such scene elements as Character and Enemies.
update(time, delta) {} — a method that gets called with every render frame (on average, 60 times per second). 
It’s a game loop in which redrawing, moving objects, etc. occurs.
 */
function preload() {
    /*
    The order in which game objects are displayed matches the order in which you create them. So if you wish to place a star sprite
     above the background, you would need to ensure that it was added as an image second, after the sky image:
    */
    this.load.image('blackvoid','assets/blackvoid.png');
    //this.load.image('rainbowvoid', 'assets/rainbowvoid.png');

    // width and height of the frame in pixels
    this.load.spritesheet('paddle', 'assets/paddle.png', { frameWidth: 20, frameHeight: 100 });
    this.load.image('ball','assets/ball.png');
}

function create() {
    // draw all the game objects onto the screen
    this.add.image(500,300,'blackvoid');

    //Creates a new Arcade Sprite object with a Static body.
    /**
     * In Arcade Physics there are two types of physics bodies:
     * Dynamic and Static. A dynamic body is one that can move 
     * around via forces such as velocity or acceleration. It can
     * bounce and collide with other objects and that collision 
     * is influenced by the mass of the body and other elements.
     */

    // (used for testing physics) platform = this.physics.add.staticSprite(500,620,'rainbowvoid');
    
    //the creation of a Physics Sprite and the creation of some animations that it can use.
    /* The sprite was created via the Physics Game Object Factory (this.physics.add) 
     which means it has a Dynamic Physics body by default. */
    playerPaddle = this.physics.add.sprite(100,300,'paddle');
    playerPaddle.setBounce(0.8);
    playerPaddle.setCollideWorldBounds(true);
    /*
    The sprite is then set to collide with the world bounds. The bounds, by default, are on the outside of the game dimensions. 
    As we set the game to be 1000 x 600 then the player won't be able to run outside of this area. 
    It will stop the player from being able to run off the edges of the screen or jump through the top.*/


    //frameRate - The frame rate of playback, of the current animation, in frames per second. 0 by default
    //repeat - The number of times to repeat playback of the current animation. -1 val means animation will repeat forever
    this.anims.create({
        key: 'up',
        frames: this.anims.generateFrameNumbers('paddle', { start: 0}),
        frameRate: 10, 
        repeat: -1 
    });

    this.anims.create({
        key: 'down',
        frames: this.anims.generateFrameNumbers('paddle', { start: 0 }),
        frameRate: 10,
        repeat: -1
    });

    /**
     * This populates the cursors object with four properties: up, down, left, right, 
     * that are all instances of Key objects. Then all we need to do is poll these in 
     * our update loop.
     */
    cursors = this.input.keyboard.createCursorKeys();

    // collider method takes two objects and tests for collision and performs separation against them. 
    // (used for testing physics) -> this.physics.add.collider(playerPaddle, platform);

    ball = this.physics.add.sprite(500,300,'ball');
    ball.setVelocity(100,200);
    ball.setGravityY(200);
    ball.setBounce(1,1);
    ball.setCollideWorldBounds(true);

}

function update() {
    /**The first thing it does is check to see if the up key is being held down. 
     * If it is we apply a negative vertical velocity and start the 'up' running animation. 
     * If they are holding down 'down' instead we literally do the opposite. 
     * By clearing the velocity and setting it in this manner, every frame, 
     * it creates a 'stop-start' style of movement.

    The player sprite will move only when a key is held down and stop immediately they are not.
    Phaser also allows you to create more complex motions, with momentum and acceleration,
    but this gives us the effect we need for this game. 

     */
    if (cursors.up.isDown) {
        playerPaddle.setVelocityY(-400);
        playerPaddle.anims.play('up', true);
    }
    else if (cursors.down.isDown) {
        playerPaddle.setVelocityY(400);
        playerPaddle.anims.play('down', true);
    }
    else{
        // without this final else block, your pong paddle will float like its underwater between the top wall and bottom wall
        playerPaddle.setVelocityY(0);
    }
}