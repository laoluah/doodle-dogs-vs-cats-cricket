const canvas = document.getElementById('cricketCanvas');
const ctx = canvas.getContext('2d');

let batX = 370, batY = 560, batWidth = 60, batHeight = 20;
let ballX = 400, ballY = 200, ballRadius = 18;
let ballSpeedX = 5, ballSpeedY = 8;
let score = 0, gameOver = false;

function drawField() {
    ctx.fillStyle = '#c5e1a5';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Pitch
    ctx.fillStyle = '#fffde7';
    ctx.fillRect(350, 100, 100, 400);
}

function drawBat() {
    ctx.fillStyle = '#795548';
    ctx.fillRect(batX, batY, batWidth, batHeight);
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#f44336';
    ctx.fill();
    ctx.closePath();
}

function drawScore() {
    ctx.font = '28px Segoe UI';
    ctx.fillStyle = '#388e3c';
    ctx.fillText('Score: ' + score, 30, 40);
}

function drawGameOver() {
    ctx.font = '50px Segoe UI';
    ctx.fillStyle = '#f44336';
    ctx.fillText('Game Over!', 250, 300);
    ctx.font = '30px Segoe UI';
    ctx.fillStyle = '#388e3c';
    ctx.fillText('Final Score: ' + score, 310, 350);
    ctx.font = '22px Segoe UI';
    ctx.fillStyle = '#333';
    ctx.fillText('Press Space to Restart', 300, 410);
}

function resetBall() {
    ballX = 400;
    ballY = 200;
    ballSpeedX = 5 + Math.random() * 4 * (Math.random()<0.5?-1:1);
    ballSpeedY = 8;
}

function update() {
    if (gameOver) return;
    ballX += ballSpeedX;
    ballY += ballSpeedY;
    // Side walls
    if (ballX < ballRadius) {
        ballX = ballRadius;
        ballSpeedX *= -1;
    }
    if (ballX > canvas.width - ballRadius) {
        ballX = canvas.width - ballRadius;
        ballSpeedX *= -1;
    }
    // Bat collision
    if (
        ballY + ballRadius > batY &&
        ballY - ballRadius < batY + batHeight &&
        ballX > batX &&
        ballX < batX + batWidth
    ) {
        ballSpeedY *= -1;
        ballY = batY - ballRadius;
        score++;
        ballSpeedX += (Math.random() - 0.5) * 2;
    }
    // Missed bat
    if (ballY > canvas.height) {
        gameOver = true;
    }
}

function draw() {
    drawField();
    drawBat();
    drawBall();
    drawScore();
    if (gameOver) drawGameOver();
}

function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    let mouseX = e.clientX - rect.left;
    batX = mouseX - batWidth / 2;
    if (batX < 0) batX = 0;
    if (batX + batWidth > canvas.width) batX = canvas.width - batWidth;
});

document.addEventListener('keydown', e => {
    if (gameOver && e.code === 'Space') {
        gameOver = false;
        score = 0;
        resetBall();
    }
});

resetBall();
loop();
