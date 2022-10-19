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
});
