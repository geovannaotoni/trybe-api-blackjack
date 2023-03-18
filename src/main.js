import './style.css';

// variavel para salvar o id do baralho
let deckId;

// botoes
const shuffleButton = document.querySelector('.shuffle');
const drawButton = document.querySelector('.draw');
const stopButton = document.querySelector('.stop');

const startNewGame = () => {
  fetch('https://deckofcardsapi.com/api/deck/new/shuffle/')
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      deckId = data.deck_id;
      shuffleButton.disabled = true;
      stopButton.disabled = false;
      drawButton.disabled = false;
    })
    .catch((error) => {
      console.log(`Erro ao fazer a requisicao: ${error.message}`);
    });
};

const playersScore = {
  1: 0,
  2: 0,
};

const stopGame = () => {
  const jackNumber = 21;
  const resultDiv = document.getElementsByClassName('hidden')[0];
  const { 1: player, 2: computer } = playersScore;
  if (player > jackNumber) {
    console.log('voce perdeu', playersScore);
    resultDiv.src = 'src/imgs/lose.png';
  } else if (computer > jackNumber) {
    console.log('voce ganhou', playersScore);
  } else if (player > computer) {
    console.log('voce ganhou', playersScore);
  } else if (playersScore[1] < computer) {
    resultDiv.src = 'src/imgs/lose.png';
  }
  resultDiv.classList.remove('hidden');
  const scoreDiv = document.querySelector('.player-2.score');
  scoreDiv.textContent = computer;
};

const addCardToPlayer = (card, playerNumber) => {
  if (playerNumber === 1) {
    const img = document.createElement('img');
    img.src = card.image;
    img.alt = `${card.value} of ${card.suit}`;
    img.classList.add('card');
    document.querySelector(`.player-${playerNumber}.cards`).appendChild(img);
  }
  switch (card.value) {
  case 'ACE':
    playersScore[playerNumber] += 1;
    break;
  case 'JACK':
    playersScore[playerNumber] += 11;
    break;
  case 'QUEEN':
    playersScore[playerNumber] += 12;
    break;
  case 'KING':
    playersScore[playerNumber] += 13;
    break;
  default:
    playersScore[playerNumber] += Number(card.value);
  }
  const scoreDiv = document.querySelector(`.player-${playerNumber}.score`);
  if (playerNumber === 1) {
    scoreDiv.textContent = playersScore[playerNumber];
  }
};

const drawCard = () => {
  fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw`)
    .then((response) => response.json())
    .then((data) => {
      const card = data.cards[0];
      addCardToPlayer(card, 1);
    });
  fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw`)
    .then((response) => response.json())
    .then((data) => {
      const card = data.cards[0];
      addCardToPlayer(card, 2);
    });
  const maxScore = 20;
  if (playersScore[1] > maxScore) {
    stopGame();
  }
};

// vamos chamar as funcões ao clicar nos botoes
shuffleButton.addEventListener('click', startNewGame);
drawButton.addEventListener('click', drawCard);
stopButton.addEventListener('click', stopGame);
