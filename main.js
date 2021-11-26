// setup canvas
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const showTime = document.querySelector('h2');

var width = canvas.width = window.innerWidth;
var height = canvas.height = window.innerHeight;

function resizeWindow() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeWindow);


// setup parameter
const nHeart = 5;
const ul = document.querySelector('ul');
for (let i = 1; i <= nHeart; i++) {
    const li = document.createElement('li');
    li.setAttribute('class', 'hp' + i);
    li.textContent = "💛";
    ul.appendChild(li);
}


function random(min, max) {
    // function to generate random number
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    return num;
}

function Ball(x, y, velX, velY, color, size) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.color = color;
    this.size = size;
    this.nCollision = 0;
}

function degToRad(angle) {
    return angle * Math.PI / 180;
}

Ball.prototype.draw = function() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, degToRad(0), degToRad(360));
    ctx.fill();
}

Ball.prototype.update = function() {
    if ((this.x + this.size) >= width) {
        this.velX = -(this.velX);
    }
    if ((this.x - this.size) <= 0) {
        this.velX = -(this.velX);
    }
    if ((this.y + this.size) >= height) {
        this.velY = -(this.velY);
    }
    if ((this.y - this.size) <= 0) {
        this.velY = -(this.velY);
    }

    this.x += this.velX;
    this.y += this.velY;
}

Ball.prototype.collisionDetect = function() {
    for (let j = 0; j < balls.length; j++) {
        if (!(this === balls[j])) {
            const dx = this.x - balls[j].x;
            const dy = this.y - balls[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.size + balls[j].size) {
                // balls[j].coxlor = this.color = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')';
                this.nCollision++;
            }

        }
    }
}

let balls = [];
let nBalls = 10;
// var nBalls = location.search.split("=")[1];

function returnBall() {
    let size = random(10, 20);
    let ball = new Ball(
        random(0 + size, width - size),
        random(0 + size, height - size),
        random(-7, 7),
        random(-7, 7),
        // 'rgba(255,0,255)',
        'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')',
        size
    );
    return ball;
}
while (balls.length < nBalls) {
    let ball = returnBall();
    balls.push(ball);
}

// Player Ball
const image = new Image();
image.src = 'smile.png';
// console.log(image.naturalWidth, image.naturalHeight);
let myball = new Ball(100, 100, 0, 0, 'rgba(255,0,255)', 10);
myball.size = 20;
myball.draw = function() {
    // ctx.beginPath();
    // ctx.fillStyle = this.color;
    // ctx.arc(this.x, this.y, this.size, degToRad(0), degToRad(360));
    // ctx.fill();
    ctx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight,
        this.x - this.size, this.y - this.size, 2 * this.size, 2 * this.size);
}

function mousemove(e) {
    myball.x = e.clientX;
    myball.y = e.clientY;
    myball.draw();
}
canvas.addEventListener('mousemove', mousemove);
balls.push(myball);

function updateHp(nCollision) {
    let li = document.querySelectorAll('li');
    li[nCollision - 1].textContent = '💙';
}

var counter = 0;
var myballDamage = 0;
var timeDamage = 0;
let time = 0;

function loop() {

    time = Math.floor(counter / 60);
    ctx.fillStyle = 'rgba(255, 255, 0, 0.25)';
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < balls.length; i++) {
        balls[i].draw();
        balls[i].update();
        balls[i].collisionDetect();
    }

    // ゲーム終了条件
    if (myballDamage >= nHeart) {
        document.location.href = "gameover.html" + "?time=" + time;
        return;
    }

    // HP減少条件 (1回以上の衝突 and 前回の衝突から10フレーム経過)
    if (balls[balls.length - 1].nCollision > 1 && (counter - timeDamage) >= 50) {
        timeDamage = counter;
        myballDamage++;
        updateHp(myballDamage);
        // balls[balls.length - 1].nCollision = 0;
    }
    if ((counter - timeDamage) <= 50) {
        image.src = 'pien.png';
    } else {
        image.src = 'smile.png'
    }
    console.log(counter - timeDamage);

    // タイミング緩和(前回の衝突から10フレームは衝突していてもノーカウント)
    if ((counter - timeDamage) <= 50) {
        balls[balls.length - 1].nCollision = 0;
    }

    console.log(time);


    showTime.textContent = 'Time:' + time;

    requestAnimationFrame(loop);

    counter++;
    if (counter % 300 == 0) {
        balls.unshift(returnBall());
    }


}

loop();