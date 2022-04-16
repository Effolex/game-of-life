import initialState from './grid.js';
const condition = ['dead', 'alive'];
let currentState = initialState;
const tileWidth = 10;
const boardWidth = (tileWidth+1)*currentState[0].length;
const board = document.querySelector('.board');
board.style.width = `${boardWidth}px`;



function populateColumn(column, columnIndex) {
  column.forEach((line, index) => {
    const lineElement = document.createElement('div');
    lineElement.classList.add('tile');
    lineElement.classList.add(line ? 'alive' : 'dead');
    lineElement.id = `${columnIndex}/${index}`;
    board.appendChild(lineElement);
  })
}

function boardCreator() {
  board.innerHTML = '';
  currentState.forEach((column, index) => {
    populateColumn(column, index);
  })
}

function isValidCoordinates(column, line) {
  const validLine = (line > -1 && line < currentState[0].length);
  const validColumn = (column > -1 && column < currentState.length);
  return validLine && validColumn;
}

function getNeighbours(cIndex, lIndex) { 
  const neighbourCells = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1], [0, 1],
    [1, -1], [1, 0], [1, 1]
  ];
  let aliveNeighbours = 0;
  let deadNeighbours = 0;
  neighbourCells.forEach(([nColumn, nLine]) => {
    const cNeighbour = cIndex+nColumn;
    const lNeighbour = lIndex+nLine;
    if (isValidCoordinates(cNeighbour, lNeighbour) && currentState[cNeighbour][lNeighbour]) {
      return aliveNeighbours += 1;
    }
    deadNeighbours += 1
  })

  return [deadNeighbours, aliveNeighbours];
}

function boardUpdate() {
  currentState.forEach((column, columIndex) => {
    column.forEach((line, lineIndex) => {
      const cell = document.getElementById(`${columIndex}/${lineIndex}`);
      const isAlive = cell.classList.contains('alive');
      cell.classList.replace(condition[+isAlive], condition[line]);
    });
  })
}

function callNextCicle() {
  const newState = currentState.map((column, cIndex) => {
    return column.map((cell, lIndex) => {
      const [ deadNeighbours, aliveNeighbours ] = getNeighbours(cIndex, lIndex);
      if (aliveNeighbours === 3 && cell === 0) {
        return 1;
      }
      if ( (aliveNeighbours === 2 || aliveNeighbours === 3) && cell === 1) {
        return 1;
      }
      return 0;
    });
  });
  currentState = newState;

  boardUpdate();
};

const startButton = document.getElementById('start');
const resetButton = document.getElementById('reset');
const speedInput = document.getElementById('speed');
const saveBoard = document.getElementById('save-board');
const loadBoard = document.getElementById('load-board');

saveBoard.addEventListener('click', () => {
  localStorage.setItem('board',JSON.stringify(currentState));
})
loadBoard.addEventListener('click', () => {
  const localBoard = localStorage.getItem('board');
  if (!localBoard) return;

  currentState = JSON.parse(localBoard);
  boardUpdate();
})

resetButton.addEventListener('click', () => {
  currentState = initialState;
  boardCreator();
});

let isPlaying = false;
let interval = 0;
let speed = 80;
speedInput.value = speed;
speedInput.addEventListener('input', () => {
  speed = speedInput.value
})
function handlePlaying() {
  
  if (!isPlaying) {
    interval = setInterval(callNextCicle, speed);
    isPlaying = true;
    startButton.textContent = 'Stop';
    return;
  }
  clearInterval(interval);
  isPlaying = false;
  startButton.textContent = 'Start';
}
startButton.addEventListener('click', handlePlaying);

function handleCellmod({ target }) {
  const { classList, id } = target;
  if(!classList.contains('tile')) {
    return;
  }
  const [column, line] = id.split('/');
  const isAlive = classList.contains('alive');
  classList.replace(
    condition[+isAlive],
    condition[+(!isAlive)]
  )
  console.log(column, line);
  currentState[column][line] = +(!isAlive);

    
}

board.addEventListener('click', handleCellmod)

boardCreator();