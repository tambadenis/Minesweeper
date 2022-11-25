let board = document.getElementById("board");
generateBoard();

function generateBoard() {
  board.innerHTML = "";
  for (let i = 0; i < 9; ++i) {
    row = board.insertRow(i);
    for (let j = 0; j < 9; ++j) {
      cell = row.insertCell(j);
      cell.onclick = function() { clickCell(this); };
      let mine = document.createAttribute("data-mine");       
      mine.value = "false";             
      cell.setAttributeNode(mine);
    }
  }
  insertMines();
}

function insertMines() {
  for (let i = 0; i < 10; i++) {
    let row = Math.floor(Math.random() * 9);
    let col = Math.floor(Math.random() * 9);
    let cell = board.rows[row].cells[col];
    cell.setAttribute("data-mine","true");
  }
}

function showMines() {
    for (let i = 0; i < 9; ++i) {
      for(let j = 0; j < 9; ++j) {
        let cell = board.rows[i].cells[j];
        if (cell.getAttribute("data-mine")=="true") cell.className="mine";
      }
    }
}

function checkGameStatus() {
  let isGameWon = true;
    for (let i = 0; i < 9; ++i) {
      for(let j = 0; j < 9; ++j) {
        if ((board.rows[i].cells[j].getAttribute("data-mine")=="false") && (board.rows[i].cells[j].innerHTML=="")) isGameWon=false;
      }
  }
  if (isGameWon) {
    alert("You Win!");
    showMines();
  }
}

function clickCell(cell) {
  if (cell.getAttribute("data-mine")=="true") {
    showMines();
    alert("Game Over");
  } else {
    cell.className="clicked";
    let mineCount=0;
    let cellRow = cell.parentNode.rowIndex;
    let cellCol = cell.cellIndex;
    for (let i=Math.max(cellRow-1,0); i<=Math.min(cellRow+1,8); i++) {
      for(let j=Math.max(cellCol-1,0); j<=Math.min(cellCol+1,8); j++) {
        if (board.rows[i].cells[j].getAttribute("data-mine")=="true") mineCount++;
      }
    }
    cell.innerHTML=mineCount;
    if (mineCount==0) { 
      for (let i=Math.max(cellRow-1,0); i<=Math.min(cellRow+1,8); i++) {
        for(let j=Math.max(cellCol-1,0); j<=Math.min(cellCol+1,8); j++) {
          if (board.rows[i].cells[j].innerHTML=="") clickCell(board.rows[i].cells[j]);
        }
      }
    }
    checkGameStatus();
  }
}
