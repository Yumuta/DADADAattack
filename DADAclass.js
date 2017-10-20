// DADADA attack classes

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