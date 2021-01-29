const cvs = document.getElementById("bird");
const ctx = cvs.getContext("2d");
let frames=0;


const sprite=new Image();
sprite.src="design.png";

const DIE=new Audio();
DIE.src="morava.mp3";

const PLAY=new Audio();
PLAY.src="uzicko.mp3";

const READY=new Audio();
READY.src="tikadjosa.mp3";



//game state
const state={
    current:0,
    getReady:0,
    game:1,
    over:2

}

//start dugme
const startBtn = {
    x:120,
    y:263,
    w:83,
    h:29
}

//control the game
cvs.addEventListener("click",function(evt){
    switch(state.current){
        case state.getReady:
            state.current = state.game;
            break;
        case state.game:
            if(bird.y-bird.radius<=0) return;

            bird.flap();
            FLAP.play();
            break;
        case state.over:

        let rect= cvs.getBoundingClientRect();
        let clickX=evt.clientX-rect.left;
        let clickY = evt.clientY-rect.top;

        //PROVERA DA LI JE KLIKNUTO START
        if(clickX >= startBtn.x && clickX <=startBtn.x+startBtn.w && clickY>=startBtn.y && clickY <=startBtn.y + startBtn.h){
            pipes.reset();
            bird.speedReset();
            score.reset();
            state.current=state.getReady;
        }
        break;

           
    }
});

const bg={
    sX:0,
    sY:0,
    w:275,
    h:226,
    x:0,
    y: cvs.height-226,

    draw:function(){
        ctx.drawImage(sprite,this.sX,this.sY,this.w,this.h,this.x,this.y,this.w,this.h);
        ctx.drawImage(sprite,this.sX,this.sY,this.w,this.h,this.x+this.w,this.y,this.w,this.h);
    }
}

const fg={
    sX:276,
    sY:0,
    w:224,
    h:112,
    x:0,
    y:cvs.height-110,
    dx:2,

    draw:function(){
        ctx.drawImage(sprite,this.sX,this.sY,this.w,this.h,this.x,this.y,this.w,this.h);
        ctx.drawImage(sprite,this.sX,this.sY,this.w,this.h,this.x+this.w,this.y,this.w,this.h);
    },

    update:function(){
        if(state.current==state.game){
            this.x=(this.x-this.dx)%(this.w/2);
        }
    }
}

const bird={
   animation:[
        {sX:276, sY:114},
        {sX:276, sY:141},
        {sX:276, sY:166},
        {sX:276, sY:141},

    ],
    x:50,
    y:152,
    w:64,
    h:39,

    frame:0,

    speed:0,
    gravity:0.25,
    jump:4.6,
    rotation:0,
    radius:12,


    draw:function(){
        let bird=this.animation[this.frame];

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.drawImage(sprite,bird.sX,bird.sY,this.w,this.h,-this.w/2,-this.h/2,this.w,this.h);

        ctx.restore();
    },

    flap:function(){
        this.speed=-this.jump;
    },

    update:function(){
        if(state.current==state.getReady){
            DIE.pause();
            DIE.currentTime=0;
           READY.play();
            this.y=150;     //reset pozicije na gameover
            
        }else if(state.current==state.game){
            READY.pause();
            READY.currentTime=0;
            this.speed+=this.gravity;
            this.y+=this.speed;
            PLAY.play();
          
            
            if(this.y+this.h/2 >= cvs.height-fg.h){
                this.y = cvs.height - fg.h - this.h/2;
                state.current = state.over;
             } 
        } else if(state.current==state.over){
       
           PLAY.pause();
            PLAY.currentTime=0;
            DIE.play();          
        }
    },

    speedReset:function(){
        this.speed=0;
    }
}

const getReady={
    sX:0,
    sY:235,
    w:200,
    h:152,
    x:cvs.width/2-200/2,
    y:80,

    draw: function(){
        if(state.current==state.getReady){
        ctx.drawImage(sprite,this.sX,this.sY,this.w,this.h,this.x,this.y,this.w,this.h);
        }
    }
}

const gameOver={
    sX:248,
    sY:235,
    w:255,
    h:202,
    x:cvs.width/2-255/2,
    y:96,

    draw: function(){
        if(state.current==state.over){
        ctx.drawImage(sprite,this.sX,this.sY,this.w,this.h,this.x,this.y,this.w,this.h);
        }
    }
}

//STUBOVI
const pipes = {
    position : [],
    
    top : {
        sX : 553,
        sY : 0
    },
    bottom:{
        sX : 502,
        sY : 0
    },
    
    w : 53,
    h : 400,
    gap : 85,
    maxYPos : -150,
    dx : 2,
    
    draw : function(){
        for(let i  = 0; i < this.position.length; i++){
            let p = this.position[i];
            
            let topYPos = p.y;
            let bottomYPos = p.y + this.h + this.gap;
            
            // top pipe
            ctx.drawImage(sprite, this.top.sX, this.top.sY, this.w, this.h, p.x, topYPos, this.w, this.h);  
            
            // bottom pipe
            ctx.drawImage(sprite, this.bottom.sX, this.bottom.sY, this.w, this.h, p.x, bottomYPos, this.w, this.h);  
        }
    },
    
    update: function(){
        if(state.current !== state.game) return;
        
        if(frames%100 == 0){
            this.position.push({
                x : cvs.width,
                y : this.maxYPos * ( Math.random() + 1)
            });
        }
        for(let i = 0; i < this.position.length; i++){
            let p = this.position[i];
            
            let bottomPipeYPos = p.y + this.h + this.gap;
            
           // COLLISION DETECTION
            // TOP PIPE
            if(bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + this.w && bird.y + bird.radius > p.y && bird.y - bird.radius < p.y + this.h){
                state.current = state.over;
                    DIE.play();
                    PLAY.pause();
                    PLAY.currentTime=0;
                  
              
            }
            // BOTTOM PIPE
            if(bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + this.w && bird.y + bird.radius > bottomPipeYPos && bird.y - bird.radius < bottomPipeYPos + this.h){
                state.current = state.over;
                DIE.play();
                PLAY.pause();
                PLAY.currentTime=0;
                
               
            }
            
            // MOVE THE PIPES TO THE LEFT
            p.x -= this.dx;
            
            // if the pipes go beyond canvas, we delete them from the array
            if(p.x + this.w <= 0){
                this.position.shift();
                score.value += 1;
               
                score.best = Math.max(score.value, score.best);
                localStorage.setItem("best", score.best);
            }
        }
    },
    
    reset : function(){
        this.position = [];
    }

}

const score={
    best: parseInt(localStorage.getItem("best")) || 0,
    value: 0,

    draw:function(){
        ctx.fillStyle="#FFF";
        ctx.strokeStyle = "#000";

        if(state.current == state.game){
            ctx.lineWidth=2;
            ctx.font = "35px Teko";
            ctx.fillText(this.value, cvs.width/2, 50);
            ctx.strokeText(this.value, cvs.width/2, 50);

       }else if(state.current == state.over){
           //REZULTAT
           ctx.font = "35px Teko";
             ctx.fillText(this.value, 100, 200);
            ctx.strokeText(this.value, 100, 200);
            //NAJBOLJI REZULTAT
            ctx.fillText(this.best, 225, 200);
            ctx.strokeText(this.best, 225, 200);
        }
    },
    reset:function(){
        this.value=0;
    }
}


function draw(){
    ctx.fillStyle="black";
    ctx.fillRect(0,0,cvs.width,cvs.height);
    bg.draw();
    pipes.draw();
    fg.draw();
    bird.draw();
    getReady.draw();
    gameOver.draw();
    score.draw();
}

function update(){
    bird.update();
    fg.update();
    pipes.update();
}

function loop(){
    update();
    draw();
    frames++;
    requestAnimationFrame(loop);
}
loop();

