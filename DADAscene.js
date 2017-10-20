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

function gameover(corename,score){
    // BGM
    var scream = corename.assets['scream.mp3'].clone();
    scream.play();
    // Label
    var label = new Label;
    label.x = 240;
    label.y = 360;
    label.color = '#FF0000';
    label.font = 'bold 48px "Times New Roman",serif';
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
        corename.replaceScene(title(corename));
    });
    gameoverScene.addChild(label);
    return gameoverScene;
}