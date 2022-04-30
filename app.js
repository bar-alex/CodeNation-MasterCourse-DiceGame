// dice roll function
// total function
// visually roll the dice function -> parent of the dice? animate the dice, setTimeout then change to final value?


console.log( 'js runs' );

// totals foe player 1 and player 2
const totals = {
    1: 0,           // player 1
    2: 0,           // player 2
};
// a record of variables 
const vars = {
    players: 1,             // number of players in the game
    winning_score: 20,
    anim_duration: 1000,    // how long will the animation run
    dice_anim: '1.5s linear 100ms infinite dice-slider',      // rolling animation
    dice_face: 'calc(var(--dice-width,60) * %dice% * -1px )', // the transition to a certain value
    text_shadow_win: '#FC0 1px 0 10px',
    text_shadow_lose: 'red 1px 0 10px',
    // restart_span: 'linear-gradient(to bottom,darkred,white 20% 80%,darkred)',   // for backgroundImage
};
let timeoutSink=0; // will hold the timeout id

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




// rolls the dice
const diceRoll = (sides = 6) => Math.ceil(Math.random()*(sides));  // lowest is 1

// work on the scores for both players
const clearTotals   = () => [ totals[1], totals[2] ] = [ 0, 0 ];
const addToTotal    = (value,player=1) => totals[player] += value;
const showScore     = (player=1) => ( player==1 ? scoreTextOne.textContent = totals[1] : scoreTextTwo.textContent = totals[2] );

const disableButton = (player=1) => ( player==1 ? btnRollDiceOne.disabled = true : btnRollDiceTwo.disabled = true );
const enableButton  = (player=1) => ( player==1 ? btnRollDiceOne.disabled = false : btnRollDiceTwo.disabled = false );

const diceAnimate   = (player=1) => ( player==1 ? diceOne.style.animation = vars.dice_anim : diceTwo.style.animation = vars.dice_anim);
const diceSetFace   = (value, player=1) => {
    const diceElem = (player == 1 ? diceOne : diceTwo);
    // nice and smooth
    diceElem.style.transition = 'filter .5s, backgroundPosition .5s';
    diceElem.style.filter = 'blur(1px)';    
    setTimeout( () => {
        diceElem.style.animation = 'none';
        diceElem.style.backgroundPosition = vars.dice_face.replace( '%dice%', (value-1).toString() );
        diceElem.style.filter = 'blur(0px)';
    },300);
};

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
    gameWinLose.childNodes[1].innerHTML = "<p>Congrats!<br>" + ( vars.players==2 ? `Player #${player} won the game!` : "You won the game!" ) + "</p>";
    gameWinLose.style.textShadow = vars.text_shadow_win;
    gameWinLose.style.display = 'flex';
};
const showLoseScreen = (player) => {
    gameWinLose.childNodes[1].innerHTML = "<p>Unfortunately!<br>" + ( vars.players==2 ? `Player #${player} lost the game!` : "You lost the game!" ) + "</p>";
    gameWinLose.style.textShadow = vars.text_shadow_lose;
    gameWinLose.style.display = 'flex';
};


// // will display the restart span and attract the user's attention to it briefly
// const showRestartSpan = () => {


//     setTimeout( () => {
//         diceElem.style.animation = 'none';
//         diceElem.style.backgroundPosition = vars.dice_face.replace( '%dice%', (value-1).toString() );
//         diceElem.style.filter = 'blur(0px)';
//     },300);

// };

// // fixes an issue where an animation 
// const clearDiceRollTimeout = () {

    // enable the buttons
    // document.querySelectorAll('.roll-dice').forEach( elem => {
    //     // sometimes setTimout fires after i restart the game
    //     const timeoutId = elem.getAttribute('timeout_id');
    //     if(timeoutId != undefined) clearTimeout(timeoutId);
    //     // enable the buttons
    //     elem.disabled = false;
    //     elem.textContent = 'Roll dice!';
    // } );


// }
    

// will restart the game
const gameRestart = () => {
    
    // hide the replay span
    // spanRestartGame.style.display = 'none';
    // spanStartGame.style.display = 'none';
    hideWinLoseScreen();
    
    clearTotals();
    showScore(1);
    showScore(2);

    // if single player hide the 2nd scene, hide divider as well
    if(vars.players==1) hideSceneTwo(); else showSceneTwo();
    
    // both dices are animated (??)
    //diceAnimate(1);
    //diceAnimate(2);
    diceSetFace(0,1);
    diceSetFace(0,2);
    
    // if two players, 2nd button is starting disabled
    enableButton(1);
    disableButton(2);   // doesn't mater if 1 or 2 players
};


// game is won - print message and alow of restart
const gameWin = (player) => {
    // animate the dices after 1 second
    timeoutSink = setTimeout(()=>{
        diceAnimate(1);
        diceAnimate(2);
    },1000);
    // show the winning screen
    showWinScreen(player);
};


// game is lost - print message and alow for restart
const gameLose = (player) => {
    // animate the dices after 1 second
    timeoutSink = setTimeout(()=>{
        diceAnimate(1);
        diceAnimate(2);
    },1000);
    // show the winning screen
    showLoseScreen(player);
};


// called from the roll dice button: 
// - will disable button, run dice animation; generate a number; set the dice image to the number; will add number to total; 
// - will check if winner or looser and run gameWin() or gameLose()
const gameRollDice = (evt) => {
    //console.log(evt);
    const player = evt.target.parentElement.getAttribute('player');
    //console.log(player_no);
    const buttonThis = (player == 1 ? btnRollDiceOne : btnRollDiceTwo);
    const buttonNext = (totals.players == 1 ? buttonThis : (player == 2 ? btnRollDiceOne : btnRollDiceTwo));
        
    // disable buttons
    disableButton(1);
    disableButton(2);
    // buttonThis.disabled = true;
    // buttonNext.disabled = true;
    
    // start animation
    diceAnimate(player);

    // generate dice
    const diceValue = diceRoll();
    //console.log('dice value: ', diceValue);
   
    // once the timer ends, 
    const timeoutId = setTimeout(() => {
        // ste the dice face
        //console.log('backgroundPosition', vars.dice_face.replace( '%dice%', diceValue.toString() ) );
        diceSetFace(diceValue);

        if(diceValue == 1) 
            gameLose(player);
        else {
            // add dice value to total
            const total = addToTotal(diceValue, player);
            // print score
            showScore(player);
            // check if game is won
            if( total >= vars.winning_score ) gameWin(player);
            else enableButton( (vars.players==2 && player==1 ? 2 : 1) );
        }
    },vars.anim_duration);

    // keep this to clear later in restart
    // buttonThis.setAttribute('timeout_id', timeoutId);
};







// starts the game
gameRestart();

// restart the game
// document.getElementById('restart-game').addEventListener('click', () => gameRestart() );
spanRestartGame.addEventListener('click', () => gameRestart() );

// from here on i bind the functions to the events
spanSelectMode.addEventListener('click', (evt) => {
    // switch players and display
    totals.players = (totals.players==1 ? 2 : 1);
    spanSelectMode.textContent = (totals.players==1 ? 'one' : 'two');
    // restart the game: variables, scene
    gameRestart();
});


btnRollDiceOne.addEventListener('click', gameRollDice );
btnRollDiceTwo.addEventListener('click', gameRollDice );

diceOne.addEventListener('dblclick', gameRollDice );
diceTwo.addEventListener('dblclick', gameRollDice );
//     const duration  = 1000; // 1s       - duration of animation
//     const interval  = 100;  // 100ms    - interval between frames
//     const step_pos  = 60;   // the width/height of the dice

//     let position    = step_pos;

//     console.log('dur,interv,step,posit,elem: ',duration,interval,step_pos,position, elem);

//     const tId = setInterval( () => {
//         elem.style.backgroundPosition = `-${position}px 0px`;
        
//         if(position < step_pos*6)
//             position += step_pos;
//         else 
//             position = step_pos;

//     }, interval );

//     const toId = setTimeout( () => {
//         clearInterval( tId );
//     }, duration );
// };


// rolls the dice visually ~ spins / transitions an element to a final value
// const diceRollVisually = (value, element) => {

// };



// const dice = document.querySelector('.dice')[0];
// dice.addEventListener( 'click', (e) => {
//     const diceNo = diceRoll();
//     console.log(diceNo, e.currentTarget, e);
    
//     animateDice( e.currentTarget );
// });


// document.getElementById('test-div').addEventListener('click', () => {
//     let dice  = diceRoll();
//     let total = 0;
//     if(dice%2==0)
//         total = addToTotal( dice, 1);
//     else 
//         total = addToTotal( dice, 2);
//     console.log('dice/total/object: ', dice, total, totals);
// });

