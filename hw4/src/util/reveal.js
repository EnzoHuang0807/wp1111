/****************************************************************************
  FileName      [ reveal.js ]
  PackageName   [ src/util ]
  Author        [ Cheng-Hua Lu ]
  Synopsis      [ This file states the reaction when left clicking a cell. ]
  Copyright     [ 2022 10 ]
****************************************************************************/

export const revealed = (board, x, y, newNonMinesCount, boardSize) => {
    
    // Advanced TODO: reveal cells in a more intellectual way.
    // Useful Hint: If the cell is already revealed, do nothing.
    //              If the value of the cell is not 0, only show the cell value.
    //              If the value of the cell is 0, we should try to find the value of adjacent cells until the value we found is not 0.
    //              The input variables 'newNonMinesCount' and 'board' may be changed in this function.
  
  board[x][y].revealed = true;
  newNonMinesCount--;

  let tmp = [];
  tmp.push([x,y]);

  while (board[x][y].value == 0 && tmp.length > 0){

    let a = tmp[0][0];
    let b = tmp[0][1];

    for (let i = -1; i <= 1; i++){
      for (let j = -1; j <= 1; j++){

        if (a + i < 0 || a + i >= boardSize)
          continue;
        if (b + j < 0 || b + j >= boardSize)
          continue;

        if (board[a + i][b + j].flagged == true) 
          continue;

        if (board[a + i][b + j].revealed == false){

            if (board[a + i][b + j].value == 0)
              tmp.push([a + i, b + j])

            board[a + i][b + j].revealed = true;
            newNonMinesCount--;
        }
      }
    }
    tmp.splice(0, 1);
  }
  return { board, newNonMinesCount };
};
