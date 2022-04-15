const board = document.querySelector('.board');

/*101
p5

Found by Achim Flammenkamp in August 1994.
The name was suggested by Bill Gosper,
noting that the phase shown below displays the period in binary.
*/

let initialState = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0],
  [0,0,0,0,1,1,0,1,0,0,0,0,0,0,0,0,0,0,1,0,1,1,0,0,0],
  [0,0,0,0,1,1,0,1,0,1,0,0,1,1,0,0,1,0,1,0,1,1,0,0,0],
  [0,0,0,0,0,0,0,1,0,1,0,1,0,0,1,0,1,0,1,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,1,0,1,0,1,0,0,1,0,1,0,1,0,0,0,0,0,0],
  [0,0,0,0,1,1,0,1,0,1,0,0,1,1,0,0,1,0,1,0,1,1,0,0,0],
  [0,0,0,0,1,1,0,1,0,0,0,0,0,0,0,0,0,0,1,0,1,1,0,0,0],
  [0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
];

tileWidth = 7;
boardWidth = (tileWidth+1)*initialState[0].length;

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
  initialState.forEach((column, index) => {
    populateColumn(column, index);
  })
}

function isValidCoordinates(column, line) {
  const validLine = (line > -1 && line < initialState[0].length);
  const validColumn = (column > -1 && column < initialState.length);
  return validLine && validColumn;
}

function getNeighbours(cIndex, lIndex) { 
  const neighbourCells = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1], [0, 1],
    [1, -1], [1, 0], [1, 1]
  ];
  const line = initialState[cIndex][lIndex];
  let aliveNeighbours = 0;
  let deadNeighbours = 0;
  neighbourCells.forEach(([nColumn, nLine]) => {
    const cNeighbour = cIndex+nColumn
    const lNeighbour = lIndex+nLine;
    if (isValidCoordinates(cNeighbour, lNeighbour) && initialState[cNeighbour][lNeighbour]) {
      return aliveNeighbours += 1;
    }
    if(line && isValidCoordinates(cNeighbour, lNeighbour)) {
      document.getElementById(`${cNeighbour}/${lNeighbour}`).style.background = 'green';

    }
    deadNeighbours += 1
  })

  return [deadNeighbours, aliveNeighbours];
}

function handleLiveConditions() {
  const newState = initialState.map((column, cIndex) => {
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
  initialState = newState;
  board.innerHTML = '';
  boardCreator();
};

//board.addEventListener('click', handleLiveConditions)
setInterval(handleLiveConditions, 300)

boardCreator();