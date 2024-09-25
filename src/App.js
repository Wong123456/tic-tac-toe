import './App.css'; 
import { useState, useEffect, createContext, useCallback } from 'react';
import {FullBoard} from './BoardComponents';
import {RedoButton, UndoButton, RestartButton, SizeButton} from './TurnManagementComponents';
import { ThemeButton } from './Theme';

export const BoardContext = createContext(null);
export const ThemeContext = createContext(null);

function App() {
  const [turn, setTurn] = useState(1); 
  const [announcement, setAnnouncement] = useState("Turn 1, O's move"); 
  const [newGame, setNewGame] = useState(true); 
  const [won, setWon] = useState(false);
  const [winner, setWinner] = useState(""); 
  const [size, setSize] = useState(3); 
  const [board, setBoard] = useState(emptyBoard()); 
  const [history, setHistory] = useState(emptyHistory()); 
  const [undoState, setUndoState] = useState(false); 
  const [historyPtr, setHistoryPtr] = useState(0);
  const [theme, setTheme] = useState("light");

  let props = {
    turn: turn,
    newGame: newGame,
    won: won,
    winner: winner,
    size: size,
    board: board,
    undoState: undoState,
    handleTurn: handleTurn,
    updateBoard: updateBoard
  }

  function emptyBoard() { 
    return [...Array(5)].map(() => Array(5).fill("null")); 
  }

  function emptyHistory() { 
    return [[emptyBoard(), 0]]; 
  }  

  function updateBoard(newBoard) { 
    setBoard([...newBoard]); 
  }

  function toggleUndoState() { 
    setUndoState(!undoState); 
  }

  function addHistory(history) { 
    setHistory(prevHistory => [...prevHistory, history]); 
  }

  function updateSize(size) { 
    setSize(size); 
  }

  function handleTurn() {
    addHistory([structuredClone(board), turn]); 
    if (undoState) { 
      setHistoryPtr(history.length); 
      toggleUndoState(); 
    } 
    else {
      setHistoryPtr(historyPtr + 1); 

    }
    setNewGame(false);
    setTurn(turn + 1);
  }

  useEffect(() => { restartTurn(); }, [size])

  useEffect(() => { 
    handleAnnouncement(turn); 
    if (turn > 4) { 
      scanBoard(size); 
    } 
  }, [turn])

  useEffect(() => { if (won) { handleAnnouncement(100); } }, [won])

  useEffect(() => { 
    if (undoState) { 
      updateBoard(structuredClone(getHistoryBoard)); 
      let lastRoundTurn = getHistoryTurn; 
      setTurn(lastRoundTurn + 1); 
    } 
  }, [historyPtr])

  const curry = (fn) => {
    let curried = (...args) =>{
        if (fn.length !== args.length){
            return curried.bind(null, ...args);
        }
        return fn(...args);
    };
    return curried;
  }

  function getBoardHistory(ptr, entry){
    return history[ptr][entry];
  }

  const curriedGetBoardHistory = curry(getBoardHistory);
  const getHistoryEntry = curriedGetBoardHistory(historyPtr);
  const getHistoryTurn = getHistoryEntry(1);
  const getHistoryBoard = getHistoryEntry(0);

  function undo() { 
    if (historyPtr != 0) { 
      if (won) { 
        setWon(false); 
      } 
      setHistoryPtr(historyPtr - 1); 
      setUndoState(true); 
    } 
  }

  function redo() { 
    if (historyPtr < history.length - 1) { 
      setHistoryPtr(historyPtr + 1); 
    } 
  }

  function restartTurn() { 
    setTurn(1); 
    setBoard(emptyBoard()); 
    setHistory(emptyHistory()); 
    setHistoryPtr(0);
    setNewGame(true); 
    setWon(false); 
  }

  function handleAnnouncement(turn) { 
    let mark = turn % 2 == 0 ? "X" : "O"; let string = ""; 
    if (turn == 100) { 
      string = "Game end, " + winner + " wins!"; 
    } 
    else { 
      if (turn <= size * size) { 
        string = "Turn " + turn + ", " + mark + "'s move"; 
      } 
      else { 
        string = "All blocks filled, game ended"; 
      } 
    } 
    setAnnouncement(string); 
  }

  function scanBoard(size) { 
    checkRow(size); 
    checkCol(size); 
    checkDiag(size); 
  }

  function allEqual(arr) { 
    return arr.every(val => val === arr[0] && arr[0] != "null"); 
  }

  function checkRow(size) { 
    // for (let row = 0; row < size; row++) {
    //   let rowMarks = []; 
    //   for (let col = 0; col < size; col++) { 
    //     rowMarks.push(board[row][col]); 
    //   } 
    //   if (allEqual(rowMarks)) { 
    //     setWon(true); setWinner(board[row][0]); 
    //   } 
    // } 

    function getRow(row){
      function getSquare(col){
        if (col >= size) return [];
        return [board[row][col], ...getSquare(col + 1)];
      }
      const rowMarks = getSquare(0);
      if (allEqual(rowMarks)){
        setWon(true); setWinner(rowMarks[0]);
      }
      if (row >= size) {return;}
      return getRow(row + 1);
    }

    return getRow(0);
  }

  function checkCol(size) { 
    for (let col = 0; col < size; col++) { 
      let colMarks = []; 
      for (let row = 0; row < size; row++) {
         colMarks.push(board[row][col]); 
        } 
        if (allEqual(colMarks)) { 
          setWon(true); 
          setWinner(board[0][col]); 
        } 
      } 
    }

  function checkDiag(size) { 
    let leftDiag = []; let rightDiag = []; 
    for (let i = 0, j = size - 1; i < size && j >= 0; i++, j--) { 
      rightDiag.push(board[i][i]); leftDiag.push(board[i][j]); 
    } 
    if (allEqual(leftDiag) || allEqual(rightDiag)) {
       setWon(true); setWinner(leftDiag[1]); 
      } 
    }

  const small = 3; 
  const medium = 4; 
  const large = 5;
  const lightTheme = "light";
  const darkTheme = "dark";

  useEffect(() =>{
    console.log(theme);
  }, [theme])

  return (
  <div className="App"> 
  <ThemeContext.Provider value={{theme, setTheme}}>
    <h1>{announcement}</h1> 
    <BoardContext.Provider value={props}><FullBoard /></BoardContext.Provider>
    <UndoButton undo={undo} /> 
    <RestartButton restartTurn={restartTurn} /> 
    <RedoButton redo={redo} /> 
    <div className="sizeRows"> 
      <SizeButton size={small} setSize={updateSize} /> 
      <SizeButton size={medium} setSize={updateSize} /> 
      <SizeButton size={large} setSize={updateSize} /> 
    </div>
    <ThemeButton theme={lightTheme} />
    <ThemeButton theme={darkTheme} />
  </ThemeContext.Provider>
  </div>);
}

export default App;