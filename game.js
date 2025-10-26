const qs = (selector) => document.querySelector(selector);

const isStarted = () => qs("#canvas").classList.contains("started");

const matrix = [];

const makeCell = (x, y) => {
  const cell = document.createElement("div");
  cell.onclick = () => {
    if (!isStarted()) {
      cell.classList.toggle("alive");
    }
  };

  if (!matrix[x]) {
    matrix[x] = [];
  }
  matrix[x][y] = cell;

  return cell;
};

qs("#start-button").onclick = () => {
  qs("#canvas").classList.toggle("started");
  qs("#start-button").innerText = isStarted() ? "Stop" : "Start game";
  qs("form").classList.toggle("disabled");
  qs(".form").classList.toggle("disabled");
  game();
};

qs("#pattern-select").onchange = (event) => {
  loadPattern(qs("#pattern-select").value);
};

const getNeighbours = (x, y) => {
  const neighbours = [];
  neighbours.push(matrix?.[x - 1]?.[y - 1]);
  neighbours.push(matrix?.[x - 1]?.[y]);
  neighbours.push(matrix?.[x - 1]?.[y + 1]);

  neighbours.push(matrix?.[x]?.[y - 1]);
  neighbours.push(matrix?.[x]?.[y + 1]);

  neighbours.push(matrix?.[x + 1]?.[y - 1]);
  neighbours.push(matrix?.[x + 1]?.[y]);
  neighbours.push(matrix?.[x + 1]?.[y + 1]);

  return neighbours.filter((n) => !!n);
};

const getAliveNeighbours = (x, y) => {
  return getNeighbours(x, y).filter((n) => n.classList.contains("alive"));
};

const game = () => {
  if (!isStarted()) {
    return;
  }
  for (let x = 0; x < matrix.length; x += 1) {
    for (let y = 0; y < matrix[x].length; y += 1) {
      const cell = matrix[x][y];
      const numberOfAliveNeighbours = getAliveNeighbours(x, y).length;
      const isAlive = cell.classList.contains("alive");

      if (isAlive) {
        if (numberOfAliveNeighbours !== 2 && numberOfAliveNeighbours !== 3) {
          // Any live cell with two or three live neighbours survives.
          cell.dataset.change = "1";
        }
      } else {
        if (numberOfAliveNeighbours === 3) {
          // Any dead cell with three live neighbours becomes a live cell.
          cell.dataset.change = "1";
        }
      }
    }
  }
  for (let x = 0; x < matrix.length; x += 1) {
    for (let y = 0; y < matrix[x].length; y += 1) {
      const cell = matrix[x][y];
      if (cell.dataset.change === "1") {
        cell.classList.toggle("alive");
        delete cell.dataset.change;
      }
    }
  }
  setTimeout(game, interval);
};

const loadPattern = (pattern) => {
  // Pattern definitions (relative coordinates)
  const patterns = {
    empty: [],
    // Oscillators
    blinker: [
      [0, 0],
      [0, 1],
      [0, 2],
    ],
    toad: [
      [0, 1],
      [0, 2],
      [0, 3],
      [1, 0],
      [1, 1],
      [1, 2],
    ],
    pulsar: [
      [2, 4],
      [2, 5],
      [2, 6],
      [2, 10],
      [2, 11],
      [2, 12],
      [4, 2],
      [4, 7],
      [4, 9],
      [4, 14],
      [5, 2],
      [5, 7],
      [5, 9],
      [5, 14],
      [6, 2],
      [6, 7],
      [6, 9],
      [6, 14],
      [7, 4],
      [7, 5],
      [7, 6],
      [7, 10],
      [7, 11],
      [7, 12],
      [9, 4],
      [9, 5],
      [9, 6],
      [9, 10],
      [9, 11],
      [9, 12],
      [10, 2],
      [10, 7],
      [10, 9],
      [10, 14],
      [11, 2],
      [11, 7],
      [11, 9],
      [11, 14],
      [12, 2],
      [12, 7],
      [12, 9],
      [12, 14],
      [14, 4],
      [14, 5],
      [14, 6],
      [14, 10],
      [14, 11],
      [14, 12],
    ],
    "penta-decathlon": [
      [0, 2],
      [0, 5],
      [1, 0],
      [1, 1],
      [1, 3],
      [1, 4],
      [1, 6],
      [1, 7],
      [2, 2],
      [2, 5],
    ],
    // Spaceships
    glider: [
      [0, 1],
      [1, 2],
      [2, 0],
      [2, 1],
      [2, 2],
    ],
    lwss: [
      [0, 1],
      [0, 4],
      [1, 0],
      [2, 0],
      [2, 4],
      [3, 0],
      [3, 1],
      [3, 2],
      [3, 3],
    ],
    mwss: [
      [0, 1],
      [0, 5],
      [1, 0],
      [2, 0],
      [2, 5],
      [3, 0],
      [3, 1],
      [3, 2],
      [3, 3],
      [3, 4],
    ],
    hwss: [
      [0, 1],
      [0, 6],
      [1, 0],
      [2, 0],
      [2, 6],
      [3, 0],
      [3, 1],
      [3, 2],
      [3, 3],
      [3, 4],
      [3, 5],
    ],
    // Methuselahs
    "r-pentomino": [
      [0, 1],
      [0, 2],
      [1, 0],
      [1, 1],
      [2, 1],
    ],
    diehard: [
      [0, 6],
      [1, 0],
      [1, 1],
      [2, 1],
      [2, 5],
      [2, 6],
      [2, 7],
    ],
    acorn: [
      [0, 1],
      [1, 3],
      [2, 0],
      [2, 1],
      [2, 4],
      [2, 5],
      [2, 6],
    ],
    // Guns
    "gosper-glider-gun": [
      [5, 1],
      [5, 2],
      [6, 1],
      [6, 2],
      [3, 13],
      [3, 14],
      [4, 12],
      [4, 16],
      [5, 11],
      [5, 17],
      [6, 11],
      [6, 15],
      [6, 17],
      [6, 18],
      [7, 11],
      [7, 17],
      [8, 12],
      [8, 16],
      [9, 13],
      [9, 14],
      [1, 25],
      [2, 23],
      [2, 25],
      [3, 21],
      [3, 22],
      [4, 21],
      [4, 22],
      [5, 21],
      [5, 22],
      [6, 23],
      [6, 25],
      [7, 25],
      [3, 35],
      [3, 36],
      [4, 35],
      [4, 36],
    ],
    "simkin-glider-gun": [
      [1, 1],
      [1, 2],
      [2, 1],
      [2, 2],
      [1, 8],
      [1, 9],
      [2, 8],
      [2, 9],
      [4, 5],
      [4, 6],
      [5, 5],
      [5, 6],
      [10, 23],
      [10, 24],
      [10, 26],
      [10, 27],
      [11, 22],
      [11, 28],
      [12, 22],
      [12, 29],
      [13, 22],
      [13, 23],
      [13, 24],
      [13, 28],
      [14, 27],
      [18, 21],
      [18, 22],
      [19, 21],
      [20, 22],
      [20, 23],
      [20, 24],
      [21, 24],
      [12, 32],
      [12, 33],
      [13, 32],
      [13, 33],
    ],
  };

  // Clear board
  for (let x = 0; x < matrix.length; x++) {
    for (let y = 0; y < matrix[x].length; y++) {
      matrix[x][y].classList.remove("alive");
    }
  }

  // Get pattern and center it
  const coords = patterns[pattern];
  if (!coords) return;
  const size = matrix.length;
  // Find min/max for pattern width/height
  let minX = 0,
    minY = 0,
    maxX = 0,
    maxY = 0;
  coords.forEach(([x, y]) => {
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
  });
  const patternWidth = maxX - minX + 1;
  const patternHeight = maxY - minY + 1;
  const offsetX = Math.floor((size - patternWidth) / 2) - minX;
  const offsetY = Math.floor((size - patternHeight) / 2) - minY;
  coords.forEach(([x, y]) => {
    const px = x + offsetX;
    const py = y + offsetY;
    if (matrix[px] && matrix[px][py]) {
      matrix[px][py].classList.add("alive");
    }
  });
};

let interval = 500;

const initialize = () => {
  const params = new URLSearchParams(window.location.search);
  const size = parseInt(params.get("size") || 50, 10);
  interval = parseInt(params.get("interval") || 500, 10);

  qs("#size").value = size;
  qs("#interval").value = interval;

  for (let x = 0; x < size; x += 1) {
    const row = document.createElement("div");
    row.className = "row";

    for (let y = 0; y < size; y += 1) {
      row.append(makeCell(x, y));
    }

    qs("#canvas").append(row);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  initialize();
  qs("#pattern-select").onchange();
});
