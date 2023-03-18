import './style.css';

// variavel para salvar o id do baralho
let deckId;

// botoes
const shuffleButton = document.querySelector('.shuffle');
const drawButton = document.querySelector('.draw');
const stopButton = document.querySelector('.stop');
const resetButton = document.getElementsByClassName('reset')[0];

// variável para salvar os valores de cada jogador (1: player e 2: comp)
const playersScore = {
  1: 0,
  2: 0,
};
const jackNumber = 21;

const startNewGame = () => {
  fetch('https://deckofcardsapi.com/api/deck/new/shuffle/')
    .then((response) => response.json())
    .then((data) => {
      // console.log(data);
      deckId = data.deck_id;
      shuffleButton.disabled = true;
      stopButton.disabled = false;
      drawButton.disabled = false;
    })
    .catch((error) => {
      console.log(`Erro ao fazer a requisicao: ${error.message}`);
    });
};

const stopGame = () => {
  const resultDiv = document.getElementsByClassName('hidden')[0];
  const result = document.getElementById('result');
  const { 1: player, 2: computer } = playersScore;
  if (player > jackNumber || (player < computer && computer <= jackNumber)) {
    resultDiv.src = 'src/imgs/lose.png';
    result.innerText = 'VOCÊ PERDEU';
  } else {
    result.innerText = 'VOCÊ GANHOU';
  }
  resultDiv.classList.remove('hidden');
  const scoreDiv = document.querySelector('.player-2.score');
  scoreDiv.textContent = computer;
  stopButton.disabled = true;
  drawButton.disabled = true;
  resetButton.disabled = false;
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
  if (playersScore[1] >= jackNumber) {
    stopGame();
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
};

// vamos chamar as funcões ao clicar nos botoes
shuffleButton.addEventListener('click', startNewGame);
drawButton.addEventListener('click', drawCard);
stopButton.addEventListener('click', stopGame);
resetButton.addEventListener('click', () => {
  window.location.reload(true);
});
