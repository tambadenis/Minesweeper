let gameComponents = {
    rowsNum : 12,
    colsNum : 24,
    bombsNum : 55,
    bomb : '💥',
    stillAlive : true,
    colors : {1: 'chocolate', 2: 'darkgreen', 3: 'deeppink', 4: 'khaki', 5: 'lime', 6: 'magenta', 7: 'navy', 8: 'turquoise'}
}

function startGame () {
    gameComponents.bombs = insertBombs();
    document.getElementById('field').appendChild(createTable());
}

function cellID (i, j) {
    return 'cell-' + i + '-' + j;
}

function createTable () {
    let table, row, td, i, j;
    table = document.createElement('table');
    
    for (i = 0; i < gameComponents.rowsNum; ++i) {
        row = document.createElement('tr');
        for (j = 0; j < gameComponents.colsNum; ++j) {
            td = document.createElement('td');
            td.id = cellID(i, j);
            row.appendChild(td);
            addCellListeners(td, i, j);
        }
        table.appendChild(row);
    }
    return table;
}

function handleCellClick (cell, i, j) {
    if (!gameComponents.stillAlive) {
        return;
    }

    if (cell.flagged) {
        return;
    }

    cell.clicked = true;

    if (gameComponents.bombs[i][j]) {
        cell.style.color = 'red';
        cell.textContent = gameComponents.bomb;
        gameOver();
        
    } else {
        cell.style.backgroundColor = 'lightGrey';
        bombsNum = adjacentBombs(i, j);
        if (bombsNum) {
            cell.style.color = gameComponents.colors[bombsNum];
            cell.textContent = bombsNum;
        } else {
            clickAdjacentBombs(i, j);
        }
    }
}

function addCellListeners (td, i, j) {
    td.addEventListener('mousedown', function(event) {
        if (!gameComponents.stillAlive) {
            return;
        }
        gameComponents.mousewhiches += event.which;
        if (event.which === 3) {
            return;
        }
        if (this.flagged) {
            return;
        }
        this.style.backgroundColor = 'lightGrey';
    });

    td.addEventListener('mouseup', function(event) {
        if (!gameComponents.stillAlive) {
            return;
        }

        if (this.clicked && gameComponents.mousewhiches == 4) {
            performMassClick(this, i, j);
        }

        gameComponents.mousewhiches = 0;
        
        if (event.which === 3) {
            if (this.clicked) {
                return;
            }

            if (this.flagged) {
                this.flagged = false;
                this.textContent = '';
            } else {
                this.flagged = true;
                this.textContent = gameComponents.flag;
            }

            event.preventDefault();
            event.stopPropagation();
          
            return false;
        } else {
            handleCellClick(this, i, j);
        }
    });

    td.oncontextmenu = function() { 
        return false; 
    };
}

function insertBombs () {
    let i, rows = [];
    for (i = 0; i < gameComponents.bombsNum; ++i) {
        insertOneBomb(rows);
    }
    return rows;
} 

function insertOneBomb (bombs) {
    let randomRow, randomColumn, row, col;

    randomRow = Math.floor(Math.random() * gameComponents.rowsNum);
    randomColumn = Math.floor(Math.random() * gameComponents.colsNum);
    row = bombs[randomRow];
    
    if (!row) {
        row = [];
        bombs[randomRow] = row;
    }
    
    col = row[randomColumn];
    
    if (!col) {
        row[randomColumn] = true;
        return
    } else {
        insertOneBomb(bombs);
    }
}

function adjacentBombs (row, col) {
    let i, j, bombsNum;
    bombsNum = 0;

    for (i =- 1; i < 2; ++i) {
        for (j =- 1; j < 2; ++j) {
            if (gameComponents.bombs[row + i] && gameComponents.bombs[row + i][col + j]) {
                bombsNum++;
            }
        }
    }
    return bombsNum;
}

function adjacentFlags (row, col) {
    let i, j, flagsNum;
    flagsNum = 0;

    for (i=-1; i<2; ++i) {
        for (j=-1; j<2; ++j) {
            cell = document.getElementById(cellID(row + i, col + j));
            if (!!cell && cell.flagged) {
                flagsNum++;
            }
        }
    }
    return flagsNum;
}

function clickAdjacentBombs (row, col) {
    let i, j, cell;
    
    for (i=-1; i<2; ++i) {
        for (j=-1; j<2; ++j) {
            if (i === 0 && j === 0) {
                continue;
            }
            cell = document.getElementById(cellID(row + i, col + j));
            if (!!cell && !cell.clicked && !cell.flagged) {
                handleCellClick(cell, row + i, col + j);
            }
        }
    }
}

function performMassClick (cell, row, col) {
    if (adjacentFlags(row, col) === adjacentBombs(row, col)) {
        clickAdjacentBombs(row, col);
    }
}

function gameOver() {
    gameComponents.stillAlive = false;
    document.getElementById('lost').style.display="block";
    
}

function reload() {
    window.location.reload();
}

window.addEventListener('load', function() {
    document.getElementById('lost').style.display="none";
    startGame();
});