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

var Punch = Class.create(Sprite,{
    initialize: function(target){
        Sprite.call(this,64,64);
        this.x = target.x + (target.muki*2-1)*64;
        this.y = target.y;
        this.life = 8;
        var surface = new Surface(64,64);
        surface.context.beginPath();
        surface.context.arc(32,32,32,0,Math.PI*2,false);
        surface.context.fillStyle = '#FF0000';
        surface.context.fill();
        this.image = surface;
        this.on('enterframe',function(){
            this.x = target.x + (target.muki*2-1)*64;
            this.y = target.y;
            this.life--;
            if(this.life<=0){
                this.life=0;
                this.remove();
            }            
        });
    }
});

var Kage = Class.create(Sprite,{
    initialize: function(target){
        Sprite.call(this,64,32);
        this.x = target.x;
        this.y = target.y + 48;
        var surface = new Surface(64,32);
        surface.context.scale(1,0.4);
        surface.context.beginPath();
        surface.context.arc(32,32,20,0,Math.PI*2,false);
        surface.context.fillStyle='#666666';
        surface.context.fill();
        this.image = surface;
        this.on('enterframe',function(){
            if(target.state==1){
                this.x = target.x;
                this.y = target.y + 48;                
            }
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
    gameScene.backgroundColor = '#AAAAAA';
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
    bgm.src.loop = true;
    //--------player initialization-----------
    var self = new Sprite(64,64);
    self.image = corename.assets['dashman.png'];
    self.state = 1;
    self.muki = 1;
    self.x = 48;
    self.y = 128;
    self.frame = 0;
    self.wazaCount = 0;
    var punch = new Punch(self);
    var self_speed = 10;
    var self_kage = new Kage(self);
    gameScene.addChild(self_kage);
    gameScene.addChild(self);
    //----------enemy settings----------------
    var dashman = [];
    var dashman_kage = [];
    var dashman_id = 0;
    gameScene.addEventListener('enterframe',function(){
        // text
        label.text = 'Score: '+score;
        // create dashman
        if(corename.frame%30==0) {
            dashman[dashman_id] = new Dashman(corename, corename.width, rand(256), -rand(10)-5);
            dashman_kage[dashman_id] = new Kage(dashman[dashman_id]);
            gameScene.addChild(dashman_kage[dashman_id]);
            gameScene.addChild(dashman[dashman_id]);
            dashman_id++;
            if(dashman_id>=100) dashman_id = 0;
        }
    });

    self.addEventListener('enterframe',function(){
            // voice
            var scream = corename.assets['scream.mp3'].clone();

            // muki
            if(corename.input.left && corename.input.right) {}
            else if(corename.input.left && self.muki==1) self.muki=0;
            else if(corename.input.right && self.muki==0) self.muki=1;

            // movement
            this.x += Number(corename.input.right)*self_speed - Number(corename.input.left)*self_speed;
            this.y += Number(corename.input.down)*self_speed - Number(corename.input.up)*self_speed;

            // keep myself in a screen
            if(this.x < 0) this.x = 0;
            else if(this.x > corename.width-64) this.x = corename.width-64;
            if(this.y < 0) this.y = 0;
            else if(this.y > corename.height-80) this.y = corename.height-80;
            this.frame = Number(this.age % 10 >= 5) + self.muki*2;

            // waza
            // a: space key(ASKII: 32)
            this.wazaCount--;
            if(corename.input.a){
                if(this.wazaCount<=0){
                    punch = new Punch(this);
                    gameScene.addChild(punch);
                    this.wazaCount = 20;                   
                }
            }
            for(var i=0; i<dashman.length; i++){
                if(punch.life !=0 && punch.within(dashman[i],64)){
                    dashman[i].remove();
                    dashman_kage[i].remove();
                    dashman[i].state=0;
                    punch.life=0;
                    score += 10;
                }               
            }


            // atari hantei
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
    core.keybind(32,'a');
    core.fps = 30;
    core.onload = function(){
        title(core);
    };
    core.start();
};