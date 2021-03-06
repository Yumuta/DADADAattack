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
        this.muki = Number(speed > 0);
        this.on('enterframe',function(){
                this.x += speed;
                if(this.x < -64){
                    this.remove();
                    this.state = 0;
                }
                this.frame = 4 + Number(this.age % 10 >= 5) + this.muki*2;
        });
    }
});

var Chaseman = Class.create(Sprite,{
    initialize: function(corename, target, x, y, speed){
        Sprite.call(this, 64, 64);
        this.x = x;
        this.y = y;
        this.state = 1;
        this.image = corename.assets['dashman.png'];
        this.muki = (this.x-target.x)<0;
        var target_x=target.x-this.x;
        var target_y=target.y-this.y;
        this.on('enterframe',function(){
            this.x -= target_x/Math.sqrt(target_x**2+target_y**2)*speed;
            this.y -= target_y/Math.sqrt(target_x**2+target_y**2)*speed;
            if(this.x < -64){
                this.remove();
                this.state = 0;
            }
            this.frame = 8 + Number(this.age % 10 >= 5) + this.muki*2;
        });
    }
});

var Ninjaman = Class.create(Sprite,{
    initialize: function(corename, target, x, y, speed, accel){
        Sprite.call(this, 64, 64);
        this.x = x;
        this.y = y;
        this.state = 1;
        this.image = corename.assets['dashman.png'];
        this.muki = (this.x-target.x)<0;
        var chase = 0;
        var speed_x = speed;
        var speed_y = 0;
        var target_x = 0;
        var target_y = 0;
        this.on('enterframe',function(){
            if(chase==0){
                this.x += speed;
            }else if(chase==1){
                speed_x -= accel * (this.x-target_x) / Math.sqrt((this.x-target_x)**2+(this.y-target_y)**2);
                speed_y -= accel * (this.y-target_y) / Math.sqrt((this.x-target_x)**2+(this.y-target_y)**2);
                this.x += speed_x;
                this.y += speed_y;
            }
            if(chase==0&&((speed>0&&this.x>target.x)||(speed<0&&this.x<target.x))){
                target_x = target.x;
                target_y = target.y;
                chase = 1;
            }
            this.muki = (this.x-target.x)<0;         
            this.frame = 12 + Number(this.age % 10 >= 5) + this.muki*2;
        });
    }
});

var Punch = Class.create(Sprite,{
    initialize: function(target, life){
        Sprite.call(this,64,64);
        this.x = target.x + (target.muki*2-1)*64;
        this.y = target.y;
        this.life = life;
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
        surface.context.fillStyle='#000000';
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

function init(corename){
    var scene = new Scene();
    scene.backgroundColor = '#CCCCCC';
    corename.pushScene(scene);
    // label
    var label = new Label("Notice: Choose sound ON/OFF before you play game.");
    label.width=corename.width;
    label.font = 'bold 24px "Helvetica",serif';
    scene.addChild(label);
    // button
    var button1 = new Button("Sound:ON","blue");
    button1.width = 256;
    button1.height = 56;
    button1.font = 'bold 40px "Helvetica",serif';
    button1.moveTo(64,212);
    scene.addChild(button1);
    var button2 = new Button("Sound:OFF","light");
    button2.width = 256;
    button2.height = 56;
    button2.font = 'bold 40px "Helvetica",serif';
    button2.moveTo(320,212);
    scene.addChild(button2);   
    button1.ontouchstart = function(){
        corename.replaceScene(title(corename,true));
    }
    button2.ontouchstart = function(){
        corename.replaceScene(title(corename,false));
    }
    return scene;
}

function title(corename,soundplay){
    var titleScene = new Scene();
    titleScene.backgroundColor = '#FFFFFF';
    corename.pushScene(titleScene);
    var titleImage = new Sprite(corename.width,corename.height);
    titleImage.image = corename.assets['DADAtitle.png'];
    titleImage.x = 0;
    titleImage.y = 0;
    titleScene.addChild(titleImage);
    titleScene.addEventListener(Event.TOUCH_START,function(){
        corename.replaceScene(mainGame(corename,soundplay));
    });
    return titleScene;
}

function gameover(corename,score,soundplay){
    // Label
    var label = new Label;
    label.x = 240;
    label.y = 360;
    label.color = '#FF0000';
    label.font = 'bold 48px "Helvetica",serif';
    label.text = 'Score: '+score;
    // Scene
    var gameoverScene = new Scene();
    gameoverScene.backgroundColor = 'rgba(0,0,0,0.7)';
    corename.pushScene(gameoverScene);
    var gameoverImage = new Sprite(corename.width,corename.height);
    gameoverImage.image = corename.assets['DADAover.png'];
    gameoverImage.x = 0;
    gameoverImage.y = 0;
    gameoverScene.addChild(gameoverImage);
    gameoverScene.addEventListener(Event.TOUCH_START,function(){
        corename.replaceScene(title(corename,soundplay));
    });
    gameoverScene.addChild(label);
    $('#tweetbtn').attr('href',"http://twitter.com/intent/tweet?url=https://yumuta.github.io/DADADAattack/&text=[Score:"+score+"] DADADA attackをプレイしました！&hashtags=DADADAattack");
    return gameoverScene;
}

function mainGame(corename,soundplay){
    //----------initial settings--------------
    var gameScene = new Scene();
    corename.pushScene(gameScene);
    //------------score system----------------
    var score = 0;
    var label = new Label;
    label.x = 10;
    label.y = 10;
    label.font = 'bold 32px "Helvetica",serif';
    label.text = 'Score: '+score;
    //-------------danger level------------------
    var danger_level = Math.floor(score/100) + 1;
    var danger_bg = ['#CCCCCC','#AAAAAA','#666666','#993333','#AA0000','#CC0000'];
    gameScene.backgroundColor = danger_bg[danger_level-1];
    //-----------------bgm--------------------
    var bgm = corename.assets['bgm.mp3'];
    if(soundplay == true){
        bgm.play();
        bgm.src.loop = true;
    }
    //----------------SE-------------------
    var scream = corename.assets['scream.mp3'].clone();
    var explode = corename.assets['explode.mp3'].clone();
    //--------player initialization-----------
    var self = new Sprite(64,64);
    self.image = corename.assets['dashman.png'];
    self.state = 1;
    self.muki = 1;
    self.x = corename.width/2 - 32;
    self.y = corename.height/2 - 32;
    self.frame = 0;
    self.wazaCount = 0;
    self.speed = 10;
    // kage
    var self_kage = new Kage(self);
    // punch
    var punch = new Punch(self,0);
    // set objects
    gameScene.addChild(punch);
    gameScene.addChild(self_kage);
    gameScene.addChild(self);
    //----------enemy settings----------------
    // Dashman
    var dashman = [];
    var dashman_kage = [];
    var dashman_id = 0;
    var dashman_interval = 30;
    // Chaseman
    var chaseman_interval = 60;
    // Ninjaman
    var ninjaman_interval = 100;

    // game draw in 60fps
    gameScene.addEventListener('enterframe',function(){
        // self.speed
        self.speed = 10 + score/100;
        // text
        label.text = 'Score: '+score;
        // danger system
        if(score >= danger_level*100 && danger_level<6){
            danger_level++;
            gameScene.backgroundColor = danger_bg[danger_level-1];
        }
        // create dashman
        dashman_interval = 30 - (score>=200)*10 - (score>=400)*6 - (score>=500)*4;
        if(corename.frame%dashman_interval==0) {
            dashman[dashman_id] = new Dashman(corename, corename.width, rand(corename.height-64), -rand(10)-Math.floor(score/100)*2-4);
            dashman_kage[dashman_id] = new Kage(dashman[dashman_id]);
            gameScene.addChild(dashman_kage[dashman_id]);
            gameScene.addChild(dashman[dashman_id]);
            dashman_id++;
            if(score >= 100 && corename.frame%(dashman_interval*2)==0){
                dashman[dashman_id] = new Dashman(corename, -64, rand(corename.height-64), rand(10)+Math.floor(score/100)*2+4);
                dashman_kage[dashman_id] = new Kage(dashman[dashman_id]);
                gameScene.addChild(dashman_kage[dashman_id]);
                gameScene.addChild(dashman[dashman_id]);                
                dashman_id++;
            }
        }

        // create chaseman
        if(chaseman_interval > 10) chaseman_interval = 60 - (score>=400)*10 - (score>=500)*(score-500)/10;
        if(score >= 300 && (corename.frame+10)%chaseman_interval==0) {
            dashman[dashman_id] = new Chaseman(corename, self, -64+(corename.width+64)*rand(2), rand(corename.height-64), -rand(10)-Math.floor(score/100)*2-4);
            dashman_kage[dashman_id] = new Kage(dashman[dashman_id]);
            gameScene.addChild(dashman_kage[dashman_id]);
            gameScene.addChild(dashman[dashman_id]);
            dashman_id++;
        }

        // create Ninjaman
        if(score>=400 && (corename.frame)%ninjaman_interval==0){
            dashman[dashman_id] = new Ninjaman(corename, self, corename.width, rand(corename.height-64), -rand(10)-Math.floor(score/100)*2-4, 1);
            dashman_kage[dashman_id] = new Kage(dashman[dashman_id]);
            gameScene.addChild(dashman_kage[dashman_id]);
            gameScene.addChild(dashman[dashman_id]);
            dashman_id++;
        }

        if(dashman_id>500) dashman_id = 0;


    }); // end draw

    self.addEventListener('enterframe',function(){
            // voice
            var scream = corename.assets['scream.mp3'].clone();

            // muki
            if(corename.input.left && corename.input.right) {}
            else if(corename.input.left && self.muki==1) self.muki=0;
            else if(corename.input.right && self.muki==0) self.muki=1;

            // movement
            this.x += Number(corename.input.right)*this.speed - Number(corename.input.left)*this.speed;
            this.y += Number(corename.input.down)*this.speed - Number(corename.input.up)*this.speed;

            // keep myself in a screen
            if(this.x < 0) this.x = 0;
            else if(this.x > corename.width-64) this.x = corename.width-64;
            if(this.y < 0) this.y = 0;
            else if(this.y > corename.height-80) this.y = corename.height-80;
            this.frame = Number(this.age % 10 >= 5) + self.muki*2;

            // waza
            // a: space key(ASKII: 32)
            if(this.wazaCount>0) this.wazaCount--;
            if(corename.input.a){
                if(this.wazaCount<=0){
                    punch = new Punch(this,8+(score>400)*2);
                    gameScene.addChild(punch);
                    this.wazaCount = 16-(score>500)*4;                   
                }
            }
            for(var i=0; i<dashman.length; i++){
                if(punch.life !=0 && dashman[i].state==1 && punch.within(dashman[i],64)){
                    dashman[i].remove();
                    dashman_kage[i].remove();
                    if(soundplay==true) explode.play();
                    dashman[i].state=0;
                    punch.life=0;
                    score += 10;
                }               
            }


            // atari hantei
            for(var i = 0; i < dashman.length; i++){
                if(dashman[i].state==1 && this.within(dashman[i], 64 - danger_level*4)){
                    label.remove();
                    this.remove();
                    self_kage.remove();
                    if(soundplay==true){
                        bgm.stop();
                        scream.play();
                    }
                    gameover(corename, score, soundplay);
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
    core.preload('DADAtitle.png', 'DADAover.png', 'dashman.png', 'bgm.mp3', 'scream.mp3', 'explode.mp3');
    core.keybind(90,'a');
    core.fps = 30;
    core.onload = function(){
        init(core);
    };
    core.start();
};