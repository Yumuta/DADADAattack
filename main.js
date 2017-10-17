enchant();

function rand(n){
    return(Math.floor(Math.random()*n));
}

var Dashman = Class.create(Sprite,{
    initialize: function(corename, x, y, speed){
        Sprite.call(this, 64, 64);
        this.x = x;
        this.y = y;
        this.state = 1;
        this.image = corename.assets['dashman.png'];
        var dashman_muki = Number(speed > 0);
        this.on('enterframe',function(){
                this.x += speed;
                if(this.x < -64){
                    this.remove();
                    this.state = 0;
                }
                this.frame = 4 + Number(this.age % 10 >= 5) + dashman_muki*2;
        });
    }
});

function title(corename){
    var titleScene = new Scene();
    titleScene.backgroundColor = '#FFFFFF';
    corename.pushScene(titleScene);
    var titleImage = new Sprite(corename.width,corename.height);
    titleImage.image = corename.assets['DADAtitle.png'];
    titleImage.x = 0;
    titleImage.y = 0;
    titleScene.addChild(titleImage);
    titleScene.addEventListener(Event.TOUCH_START,function(){
        corename.replaceScene(mainGame(corename));
    });
    return titleScene;
}

function gameover(corename){
    var scream = corename.assets['scream.mp3'].clone();
    scream.play();
    var gameoverScene = new Scene();
    gameoverScene.backgroundColor = '#000000';
    corename.pushScene(gameoverScene);
    gameoverScene.addEventListener(Event.TOUCH_START,function(){
        corename.replaceScene(title(corename));
    });
    return gameoverScene;
}

function mainGame(corename){
    //----------initial settings--------------
    var gameScene = new Scene();
    gameScene.backgroundColor = '#00AA00';
    corename.pushScene(gameScene);
    //------------score system----------------
    var score = 0;
    var label = new Label;
    label.x = 10;
    label.y = 10;
    label.font = 'bold 32px "Times New Roman",serif';
    label.text = 'Score: '+score;
    
    //-----------------bgm--------------------
    var bgm = corename.assets['bgm.mp3'];
    bgm.play();
    bgm._element.loop = true;
    //--------player initialization-----------
    var self = new enchant.Sprite(64,64);
    self.image = corename.assets['dashman.png'];
    self.x = 48;
    self.y = 128;
    self.frame = 0;
    var self_speed = 10;
    var self_muki = 1;
    gameScene.addChild(self);
    //----------enemy settings----------------
    var dashman = [];
    var dashman_id = 0;
    gameScene.addEventListener('enterframe',function(){
        if(corename.frame%30==0) {
            dashman[dashman_id] = new Dashman(corename, corename.width, rand(256), -rand(10)-5);
            gameScene.addChild(dashman[dashman_id]);
            dashman_id++;
            if(dashman_id>=5) dashman_id = 0;
        }
    });

    self.addEventListener('enterframe',function(){
            var scream = corename.assets['scream.mp3'].clone();
            if(corename.input.left && corename.input.right) {}
            else if(corename.input.left && self_muki==1) self_muki=0;
            else if(corename.input.right && self_muki==0) self_muki=1;
            this.x += Number(corename.input.right)*self_speed - Number(corename.input.left)*self_speed;
            this.y += Number(corename.input.down)*self_speed - Number(corename.input.up)*self_speed;
            this.frame = Number(this.age % 10 >= 5) + self_muki*2;
            for(var i = 0; i < dashman.length; i++){
                if(dashman[i].state==1 && this.within(dashman[i], 56)){
                    this.remove();
                    bgm.stop();
                    gameover(corename);
                }
            }
    });

    gameScene.addChild(label);

    return gameScene;
}

window.onload = function(){
    var screen_width = 640;
    var screen_height = 480;
    var core = new Core(screen_width,screen_height);
    core.preload('DADAtitle.png', 'dashman.png', 'bgm.mp3', 'scream.mp3');
    core.fps = 30;
    core.onload = function(){
        title(core);
    };
    core.start();
};