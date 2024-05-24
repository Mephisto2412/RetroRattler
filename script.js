//define HTML elements
const board=document.getElementById('game-board');
const instructionText=document.getElementById('instruction-text');
const logo= document.getElementById('logo');
const score= document.getElementById('score');
const highScoreText= document.getElementById('highScore');
const highS= document.getElementById('highS');

//define game variables
const gridSize=20;
let snake=[{x:10, y:10}]
let highScore=0;
let food=generateFood();
let direction= 'right';
let gameInterval;
let gameSpeedDelay=200;
let gameStarted=false;
// let  a=0;

//draw game map, food, snake
function draw(){
    //resets the board after each game
    board.innerHTML='';
    drawSnake();
    drawFood();
    updateScore();
}

function drawSnake(){
    snake.forEach((segment) =>{
        const snakeElement=createGameElement('div','snake');
        setPosition(snakeElement,segment);
        board.appendChild(snakeElement);
    })

}

//creating a snake or a food cube
function createGameElement(tag,className){
    const element=document.createElement(tag);
    element.className=className;
    return element;
}
//set the position of food or snake
function setPosition(element,position){
    element.style.gridColumn=position.x;
    element.style.gridRow=position.y;
}

//Testing draw function
// draw();

//drawing food
function drawFood(){
    if(gameStarted){
        const foodElement=createGameElement('div','food');
        setPosition(foodElement,food);
        board.appendChild(foodElement);
    }
}

//generating food
function generateFood(){
    const x=Math.floor(Math.random()*gridSize) + 1;
    const y=Math.floor(Math.random()*gridSize) + 1;
    return {x,y};
}

//moving the snake
function move(){
    const head={...snake[0]};
    switch (direction) {
        case 'right':
            head.x++;
            if(direction=='left'){
                resetGame();
            }
            break;
        case 'left':
            if(direction=='right'){
                resetGame();
            }
            head.x--;
            break;
        case 'up':
            if(direction=='down'){
                resetGame();
            }
            head.y--;
            break;
        case 'down':
            if(direction=='up'){
                resetGame();
            }
            head.y++;
            break;
    }
    snake.unshift(head);
    // snake.pop();
    if(head.x== food.x && head.y==food.y){
        food=generateFood();
        increaseSpeed();
        // a++;
        clearInterval(gameInterval); // clear past interval
        gameInterval=setInterval(()=>{
            move();
            checkCollision();
            draw();
        },gameSpeedDelay);
    }
    else{
        snake.pop();
    }
}

// test moving
// setInterval(()=>{
//     move();//move first
//     draw();//then draw again the new position
// },200);


//start game function
function startGame() {
    gameStarted=true; // keep track of a running game
    instructionText.style.display= 'none';
    logo.style.display= 'none';
    gameInterval=setInterval(()=>{
        move();
        checkCollision(); 
        draw();

    },gameSpeedDelay);
}

//Keypress event listener
function handleKeyPress(event){
    if((!gameStarted && event.code ==='Space') || (!gameStarted && event.key ===' ')){
        startGame();
    }
    else{
        switch (event.key){
            case 'ArrowUp':
                direction='up';
                break;
            case 'ArrowDown':
                direction='down';
                break;
            case 'ArrowLeft':
                direction='left';
                break;
            case 'ArrowRight':
                direction='right';
                break;
        }
    }
}

document.addEventListener('keydown',handleKeyPress);

function increaseSpeed(){
    console.log(gameSpeedDelay);
    if (gameSpeedDelay>150){
        gameSpeedDelay-=5;
    }
    else if (gameSpeedDelay>100){
        gameSpeedDelay-=3;
    }
    else if (gameSpeedDelay>50){
        gameSpeedDelay-=2;
    }
    else if (gameSpeedDelay>25){
        gameSpeedDelay-=1;
    }
}

function checkCollision(){
    const head=snake[0];
    if(head.x<1 || head.x>gridSize || head.y<1 || head.y>gridSize){
        resetGame();
    }
    // if(a>3){
        for(let i=1;i<gridSize;i++){
            if(snake[i]){
                if(snake[i].x===head.x && snake[i].y===head.y){
                    resetGame();
                    console.log(snake[i]);
                }
            }
        }
    // if(a==1)
    // resetGame();
    // }
}

function resetGame(){
    updateHighScore();
    stopGame();
    direction='right';
    snake=[{x:10,y:10}];
    food=generateFood();
    gameSpeedDelay=200;
    updateScore();
    // a=0;
}

function updateScore(){
    const currentScore=snake.length-1;
    score.textContent=currentScore.toString().padStart(3,'0');
}

function stopGame(){
    clearInterval(gameInterval);
    gameStarted=false;
    instructionText.style.display='block';
    logo.style.display='block';
}

function updateHighScore(){
    const currentScore=snake.length-1;
    if(currentScore>highScore){
        highScore=currentScore;
        highScoreText.textContent=highScore.toString().padStart(3,'0');
    }
    highScoreText.style.display='block';
    highS.style.display='block';
}