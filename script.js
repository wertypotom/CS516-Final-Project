'use strict';

// ✅ Extract and store id_token from URL hash
const hash = window.location.hash;
const idToken = new URLSearchParams(hash.substring(1)).get('id_token');
if (idToken) {
  localStorage.setItem('id_token', idToken);
  window.history.replaceState(null, null, window.location.pathname); // Clean up URL
}

const player_0 = document.querySelector('.player--0');
const player_1 = document.querySelector('.player--1');
const playerName_0 = document.querySelector('#name--0');
const score0 = document.querySelector('#score--0');
const current0 = document.querySelector('#current--0');
const playerName_1 = document.querySelector('#name--1');
const score1 = document.querySelector('#score--1');
const current1 = document.querySelector('#current--1');
const dice = document.querySelector('.dice');
const hold = document.querySelector('.hold');
const again = document.querySelector('.again');
const roll = document.querySelector('.roll');

// 🔁 Game logic variables
let scores, currentScore, activePlayer, playing;

// 🔁 UI functions
const switchPlayer = function () {
  document.getElementById(`current--${activePlayer}`).textContent = 0;
  currentScore = 0;
  player_0.classList.toggle('player-active');
  player_1.classList.toggle('player-active');
};

const disabled = function () {
  dice.disabled = true;
  hold.disabled = true;
  roll.disabled = true;
};

const init = function () {
  scores = [0, 0];
  currentScore = 0;
  activePlayer = 0;
  playing = true;

  dice.classList.add('hidden');
  score0.textContent = 0;
  score1.textContent = 0;
  current0.textContent = 0;
  current1.textContent = 0;
  player_0.classList.remove('player--winner');
  player_1.classList.remove('player--winner');
  player_0.classList.add('player-active');
  player_1.classList.remove('player-active');
};

// ✅ Send scores to AWS Lambda via API Gateway
const sendFinalScore = async () => {
  const token = localStorage.getItem('id_token');
  if (!token) return console.error('🚫 No id_token found.');

  const payload = {
    player1Score: parseInt(score0.textContent),
    player2Score: parseInt(score1.textContent)
  };

  try {
    const response = await fetch(
      'https://nxg4uhjhbe.execute-api.us-east-1.amazonaws.com/saveGame', // ✅ Your actual endpoint
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      }
    );

    const result = await response.json();
    console.log('✅ Game saved to DB:', result);
  } catch (err) {
    console.error('❌ Failed to save score:', err);
  }
};

// ⛳ Init game
init();

// 🎲 Rolling dice
roll.addEventListener('click', function () {
  if (playing) {
    const randomNumber = Math.floor(Math.random() * 6) + 1;
    dice.classList.remove('hidden');
    dice.src = `dice-${randomNumber}.png`;

    if (randomNumber !== 1) {
      currentScore += randomNumber;
      document.getElementById(`current--${activePlayer}`).textContent = currentScore;
    } else {
      switchPlayer();
      activePlayer = activePlayer === 0 ? 1 : 0;
    }
  }
});

// 🧷 Hold button
hold.addEventListener('click', function () {
  if (playing) {
    scores[activePlayer] += currentScore;
    document.querySelector(`#score--${activePlayer}`).textContent = scores[activePlayer];
    switchPlayer();

    if (scores[activePlayer] >= 100) {
      document.querySelector(`.player--${activePlayer}`).classList.add('player--winner');
      document.querySelector(`.player--${activePlayer}`).classList.remove('player-active');
      document
        .querySelector(`.player--${activePlayer == 1 ? 0 : 1}`)
        .classList.toggle('player-active');
      dice.classList.add('hidden');
      disabled();

      // 🛰 Send final score
      sendFinalScore();
    }

    activePlayer = activePlayer === 0 ? 1 : 0;
  }
});

// 🔁 Restart game
again.addEventListener('click', function () {
  init();
});

// ℹ️ How-to overlay
document.querySelector('.how').addEventListener('click', () => {
  document.querySelector('.how-screen').classList.remove('none');
});
document.querySelector('.how-text-screen-exit').addEventListener('click', () => {
  document.querySelector('.how-screen').classList.add('none');
});
