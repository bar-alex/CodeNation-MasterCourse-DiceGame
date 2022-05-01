// dice roll function
// total function
// visually roll the dice function -> parent of the dice? animate the dice, setTimeout then change to final value?


console.log( 'js runs' );

// a record of variables 
const vars = {
    winning_score: 20,
    anim_duration: 1000,        // how long will the animation run
    wait_winlose_anim: 2000,    // wait untill dice anim starts behind win/lose screen
    anim_blur_dur: 300,         // how long to keep it blurred while changing to dice face

    players: 1,                 // number of players in the game
    player_turn: 1,             // which player is next
    rolling: false,             // block dblclick events while rolling

    // dice_anim: '1.5s linear 100ms infinite dice-slider',      // rolling animation
    dice_anim: '1.5s cubic-bezier(.65,1.79,.47,-0.89) 100ms infinite dice-slider',
    dice_face: 'calc(var(--dice-width,60) * %dice% * -1px )', // the transition to a certain value
    text_shadow_win: '#FC0 1px 0 10px',
    text_shadow_lose: 'red 1px 0 10px',
    text_shadow_greet: 'green 1px 0 10px',
    score_gradient: 'linear-gradient(.25turn, #FF724C, %proc%%, rgba(255, 255, 255, 0.100))',
    // score_gradient: 'linear-gradient(.25turn, #FF724C, %proc%%, white)',
    //score_gradient: 'linear-gradient(.25turn, lightskyblue, %proc%%, white)',
    // restart_span: 'linear-gradient(to bottom,darkred,white 20% 80%,darkred)',   // for backgroundImage
};
// totals foe player 1 and player 2
const totals = {
    1: 0,           // player 1
    2: 0,           // player 2
};
// will hold the timeout id
let timeoutSink = 0; 

// roll dice buttons
// const spanRestartGame                   = document.getElementById('restart-game');      // the restart game span
const spanRestartGame                   = document.querySelector('#win-lose-text span');      // the restart game span
const gameWinLose                       = document.getElementById('win-lose-text');     // the win lose text div
const sectionDivider                    = document.getElementById("divider");           // divider between game scenes
const [gameSceneOne, gameSceneTwo]      = document.querySelectorAll(".game-scene[player]");
const [scoreTextOne, scoreTextTwo]      = document.querySelectorAll('.score-text');     // the score text
const [diceOne, diceTwo]                = document.querySelectorAll('.dice');           // the dices - run animation on these
const [btnRollDiceOne, btnRollDiceTwo]  = document.querySelectorAll('.roll-dice');      // the buttons
const spanSelectMode                    = document.getElementById("select-mode");           // divider between game scenes

const diceSound  = new Audio('/assets/dice-sound.wav');
const cheerSound = new Audio('/assets/win-sound.mp3');
const loseSound  = new Audio('/assets/lose-sound.mp3');


// rolls the dice
const diceRoll = (sides = 6) => Math.ceil(Math.random()*(sides));  // lowest is 1

// work on the scores for both players
const clearTotals   = () => [ totals[1], totals[2] ] = [ 0, 0 ];
const addToTotal    = (value,player=1) => totals[player] += value;
const showScore     = (player=1) => {
    if(player==1){
        scoreTextOne.textContent = totals[1];
        let calcProc = Math.ceil( totals[1] * 5 );
        // fill gauge the closer you get to max points
        scoreTextOne.style.backgroundImage = vars.score_gradient.replace('%proc%',calcProc);
    } else {
        scoreTextTwo.textContent = totals[2];
        let calcProc = Math.ceil( totals[1] * 5 );
        // fill backwards
        scoreTextTwo.style.backgroundImage = vars.score_gradient.replace('%proc%',calcProc).replace('.25turn','-.25turn');
    }
};

const disableButton = (player=1) => ( player==1 ? btnRollDiceOne.disabled = true : btnRollDiceTwo.disabled = true );
const enableButton  = (player=1) => ( player==1 ? btnRollDiceOne.disabled = false : btnRollDiceTwo.disabled = false );

const diceAnimate   = (player=1) => ( player==1 ? diceOne.style.animation = vars.dice_anim : diceTwo.style.animation = vars.dice_anim);
const diceSetFace   = (value, player=1) => {
    const diceElem = (player == 1 ? diceOne : diceTwo);
    // nice and smooth
    diceElem.style.transition = 'filter .5s, backgroundPosition .5s';
    diceElem.style.filter = 'blur(1px)';    
    // keep it blurred for 1/3 sec while change to dice face
    setTimeout( () => {
        diceElem.style.animation = 'none';
        diceElem.style.backgroundPosition = vars.dice_face.replace( '%dice%', (value-1).toString() );
        diceElem.style.filter = 'blur(0px)';
    },vars.anim_blur_dur);
};

const playSound = (soundObj) => { timeoutSink = setTimeout( ()=>{soundObj.play(); soundObj.currentTime=0;},300); };

const hideSceneTwo = () => {
    gameSceneTwo.style.display = 'none';
    sectionDivider.style.display = 'none';
};
const showSceneTwo = () => {
    gameSceneTwo.style.display = 'flex';
    sectionDivider.style.display = 'block';
};

const hideWinLoseScreen  = () => gameWinLose.style.display = 'none' ;
const showWinScreen  = (player) => {
    gameWinLose.childNodes[1].innerHTML = "<p>Congrats!<br>" + 
        ( vars.players==2 ? `Player #${player} won the game!` : "You won the game!" ) + 
        `<br><${player==1?totals[1]:totals[2]}>` + "</p>";
    gameWinLose.childNodes[1].style.fontSize = '3.5rem';
    gameWinLose.childNodes[3].textContent = 'play again';
    gameWinLose.style.textShadow = vars.text_shadow_win;
    gameWinLose.style.display = 'flex';
    
};
const showLoseScreen = (player) => {
    gameWinLose.childNodes[1].innerHTML = "<p>Unfortunately!<br>" + 
        ( vars.players==2 ? `Player #${player} lost the game!` : "You lost the game!" ) + "</p>";
    gameWinLose.childNodes[1].style.fontSize = '3.5rem';
    gameWinLose.childNodes[3].textContent = 'play again';
    gameWinLose.style.textShadow = vars.text_shadow_lose;
    gameWinLose.style.display = 'flex';
};
const showGreetScreen = () => {
    gameWinLose.childNodes[1].innerHTML = "<p>Welcome to my dice game!<br><br>You win with a score of 20+<br>You lose when you roll 1</p>";
    gameWinLose.childNodes[1].style.fontSize = '3rem';
    gameWinLose.childNodes[3].textContent = 'start';
    gameWinLose.style.textShadow = vars.text_shadow_greet;
    gameWinLose.style.display = 'flex';
};
    

// will restart the game
const gameRestart = () => {
    
    // clear pending timeout if any
    if(timeoutSink != undefined) clearTimeout(timeoutSink);

    hideWinLoseScreen();

    vars.player_turn = 1;
    vars.rolling = false;
    
    clearTotals();
    showScore(1);
    showScore(2);

    // if single player hide the 2nd scene, hide divider as well
    if(vars.players==1) hideSceneTwo(); else showSceneTwo();
    
    // empty dices - waiting to be rolled
    diceSetFace(0,1);
    diceSetFace(0,2);
    
    // if two players, 2nd button is starting disabled
    enableButton(1);
    disableButton(2);   // doesn't mater if 1 or 2 players
};


// game is won - print message and alow of restart
const gameWin = (player) => {
    // animate the dices after 2 second
    timeoutSink = setTimeout(()=>{
        diceAnimate(1);
        diceAnimate(2);
    },vars.wait_winlose_anim);
    // show the winning screen
    showWinScreen(player);
    // win sound
    playSound(cheerSound);
};


// game is lost - print message and alow for restart
const gameLose = (player) => {
    // animate the dices after 2 second
    timeoutSink = setTimeout(()=>{
        diceAnimate(1);
        diceAnimate(2);
    },vars.wait_winlose_anim);
    // show the winning screen
    showLoseScreen(player);
    // play lose sound
    playSound(loseSound);
};


// called from the roll dice button: 
// - will disable button, run dice animation; generate a number; set the dice image to the number; will add number to total; 
// - will check if winner or looser and run gameWin() or gameLose()
const gameRollDice = (evt) => {
    //console.log(evt);
    //evt.preventDefault();

    const player = // have to get he player from corresponding <game-scene>
        evt.target.parentElement.hasAttribute('player') ?   // for click on <roll-dice>
        evt.target.parentElement.getAttribute('player') : 
        evt.target.parentElement.parentElement.hasAttribute('player') ? // for dbl-click on <dice>
        evt.target.parentElement.parentElement.getAttribute('player') :
        1;  // default to one
    console.log( 'gameRollDice player ', player );
    
    // prevent only one player db-clicking the dice repeatedly
    if(player!=vars.player_turn) return;
    if(vars.rolling) return;

    // disable buttons
    disableButton(1);
    disableButton(2);
    
    // start animation
    diceAnimate(player);
    // play sound
    playSound(diceSound);

    // generate dice
    const diceValue = diceRoll();
    //console.log('dice value: ', diceValue);
   
    vars.rolling = true;

    // once the timer ends, 
    timeoutSink = setTimeout(() => {
        // set the dice face
        diceSetFace(diceValue,player);

        if(diceValue == 1) 
            gameLose(player);
        else {
            vars.rolling = false;
            // add dice value to total
            const total = addToTotal(diceValue, player);
            // print score
            showScore(player);
            // check if game is won
            if( total >= vars.winning_score ) gameWin(player);
            else vars.player_turn = (vars.players==2 && vars.player_turn==1 ? 2 : 1);
            // enable the button for who's next
            enableButton( vars.player_turn );
        }
    },vars.anim_duration);
};







// starts the game
gameRestart();
// show the greeting
showGreetScreen();
// have an animation behind
timeoutSink = setTimeout( diceAnimate, vars.wait_winlose_anim )

// document.getElementById('restart-game').addEventListener('click', () => gameRestart() );
spanRestartGame.addEventListener('click', () => gameRestart() );

// from here on i bind the functions to the events
spanSelectMode.addEventListener('click', (evt) => {
    // switch players and display
    vars.players = (vars.players==1 ? 2 : 1);
    spanSelectMode.textContent = (totals.players==1 ? 'one' : 'two');
    // restart the game: variables, scene
    gameRestart();
});

// roll-dice buttons
btnRollDiceOne.addEventListener('click', gameRollDice );
btnRollDiceTwo.addEventListener('click', gameRollDice );
// dice themselves
diceOne.addEventListener('dblclick', gameRollDice );
diceTwo.addEventListener('dblclick', gameRollDice );

// spanSelectMode.addEventListener('click', () => {
//     vars.players = ( vars.players==1 ? 2 : 1 );
//     gameRestart();
// });