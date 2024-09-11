import './App.css';
import {useState} from 'react';
import {useEffect} from 'react';



function App() {
  const [turn, setTurn] = useState(1);
  const [announcement, setAnnouncement] = useState("Turn 1, O's move");
  const [newGame, setNewGame] = useState(true);
  const [won, setWon] = useState(false);
  const [winner, setWinner] = useState("");
  const [size, setSize] = useState(3);
  const [board, setBoard] = useState(emptyBoard());
  const [history, setHistory] = useState(emptyHistory());
  const [undid, setUndid] = useState(emptyHistory());
  const [undoState, setUndoState] = useState(false);

  function emptyBoard(){
    return [...Array(5)].map(() => Array(5).fill("null"));
  }

  function emptyHistory(){
    return [];
  }

  function updateBoard(newBoard){
    setBoard([...newBoard]);
  }

  function toggleUndoState(){
    setUndoState(!undoState);
  }

  function addHistory(history){
    setHistory(prevHistory => [...prevHistory, history]);
  }

  function addUndid(history){
    setUndid(prevUndid => [...prevUndid, history]);
  }

  function updateSize(size){
    setSize(size);
  }

  function handleTurn(){
    addHistory(structuredClone(board));
    setTurn(turn + 1);
    setNewGame(false);
    handleAnnouncement(turn + 1);
  }

  useEffect(() =>{
    console.log("History:");
    console.log(history);
  }, [history])

  useEffect(() =>{
    console.log("Board:");
    console.log(board);
  }, [board])

  function undo(){
    let curTurn = turn - 1;
    let prevTurn = turn - 2;
    setTurn(prevTurn);
    handleAnnouncement(turn - 1);
    updateBoard(history[prevTurn - 1]);
  }

  function restartTurn(){
    setTurn(1);
    setBoard(emptyBoard());
    setHistory(emptyHistory());
    handleAnnouncement(1);
    setNewGame(true);
    setWon(false);
  }

  function handleAnnouncement(turn){
    let mark = turn % 2 == 0 ? "X" : "O";
    let string = "";
    if (turn == 100) {string = "Game end, " + winner + " wins!";}
    else{
      if (turn <= size*size) {
        string = "Turn " + turn + ", " + mark + "'s move";
      }
      else{
        string = "All blocks filled, game ended";
      }
    }
    setAnnouncement(string);
  }

  function scanBoard(size){
    // if (size == 3){
    //   if ((board[0][0] == board[0][1] && board[0][1] == board[0][2]) && (board[0][0] != "null")) {setWon(true); setWinner(board[0][0]);}
    //   if ((board[1][0] == board[1][1] && board[1][1] == board[1][2]) && (board[1][0] != "null")) {setWon(true); setWinner(board[1][0]);}
    //   if ((board[2][0] == board[2][1] && board[2][1] == board[2][2]) && (board[2][0] != "null")) {setWon(true); setWinner(board[2][0]);}
    //   if ((board[0][0] == board[1][0] && board[1][0] == board[2][0]) && (board[0][0] != "null")) {setWon(true); setWinner(board[0][0]);}
    //   if ((board[0][1] == board[1][1] && board[1][1] == board[2][1]) && (board[0][1] != "null")) {setWon(true); setWinner(board[0][1]);}
    //   if ((board[0][2] == board[1][2] && board[1][2] == board[2][2]) && (board[0][2] != "null")) {setWon(true); setWinner(board[0][2]);}
    //   if ((board[0][0] == board[1][1] && board[1][1] == board[2][2]) && (board[0][0] != "null")) {setWon(true); setWinner(board[0][0]);}
    //   if ((board[2][0] == board[1][1] && board[1][1] == board[0][2]) && (board[2][0] != "null")) {setWon(true); setWinner(board[2][0]);}
    // }
    // else if (size == 4){
    //   if ((board[0][0] == board[0][1] && board[0][1] == board[0][2] && board[0][2] == board[0][3]) && (board[0][0] != "null")) {setWon(true); setWinner(board[0][0]);}
    //   if ((board[1][0] == board[1][1] && board[1][1] == board[1][2]) && (board[1][0] != "null")) {setWon(true); setWinner(board[1][0]);}
    //   if ((board[2][0] == board[2][1] && board[2][1] == board[2][2]) && (board[2][0] != "null")) {setWon(true); setWinner(board[2][0]);}
    //   if ((board[0][0] == board[1][0] && board[1][0] == board[2][0]) && (board[0][0] != "null")) {setWon(true); setWinner(board[0][0]);}
    //   if ((board[0][1] == board[1][1] && board[1][1] == board[2][1]) && (board[0][1] != "null")) {setWon(true); setWinner(board[0][1]);}
    //   if ((board[0][2] == board[1][2] && board[1][2] == board[2][2]) && (board[0][2] != "null")) {setWon(true); setWinner(board[0][2]);}
    //   if ((board[0][0] == board[1][1] && board[1][1] == board[2][2]) && (board[0][0] != "null")) {setWon(true); setWinner(board[0][0]);}
    //   if ((board[2][0] == board[1][1] && board[1][1] == board[0][2]) && (board[2][0] != "null")) {setWon(true); setWinner(board[2][0]);}
    // }
    checkRow(size);
    checkCol(size);
    checkDiag(size);
  }

  function allEqual(arr){
    return arr.every(val => val === arr[0] && arr[0] != "null");
  }

  function checkRow(size){
    for (let row = 0; row < size; row++){
      let rowMarks = [];
      for (let col = 0; col < size; col++){
        rowMarks.push(board[row][col]);
      }
      if (allEqual(rowMarks)){
        setWon(true);
        setWinner(board[row][0]);
      }
    }
  }

  function checkCol(size){
    for (let col = 0; col < size; col++){
      let colMarks = [];
      for (let row = 0; row < size; row++){
        colMarks.push(board[row][col]);
      }
      if (allEqual(colMarks)){
        setWon(true);
        setWinner(board[0][col]);
      }
    }
  }

  function checkDiag(size){
    let leftDiag = [];
    let rightDiag = [];
    for (let i = 0, j = size - 1; i < size && j >= 0; i++, j--){
      rightDiag.push(board[i][i]);
      leftDiag.push(board[i][j]);
    }
    if (allEqual(leftDiag) || allEqual(rightDiag)){
      setWon(true);
      setWinner(leftDiag[1]);
    }
  }

  useEffect(() =>{
    restartTurn();
  }, [size])

  useEffect(() => {
    if (turn > 4) {scanBoard(size);}
  }, [turn])

  useEffect(() => {
    if (won){
      handleAnnouncement(100);
      // setWon(false);
    }
  }, [won])

  const small = 3;
  const medium = 4;
  const large = 5;
 
  return (
    <div className="App">
      <h1>{announcement}</h1>
      {/* <h2>{newGame}</h2> */}
      <FullBoard turn={turn} handleTurn={handleTurn} newGame={newGame} size={size} boardState={board} updateBoard={updateBoard} won={won}/>
      <UndoButton undo={undo} undoState={undoState}/>
      <RestartButton restartTurn={restartTurn}/>
      <div className="sizeRows">
        <SizeButton size={small} setSize={updateSize}/>
        <SizeButton size={medium} setSize={updateSize}/>
        <SizeButton size={large} setSize={updateSize}/>
      </div>
    </div>
  );
}

function UndoButton({undo}){
  return(
    <button className='undo' onClick={undo}>Undo</button>
  );
}

function Cross(){
  return(
    <div className="cross">
      X
    </div>
  );
}

function Circle(){
  return(
    <div className="circle">
      O
    </div>
  );
}

function Square({turn, handleTurn, newGame, id, row, col, boardState, updateBoard, won, size}){
  const [mark, setMark] = useState("null");
  const [isMarked, setIsMarked] = useState(false);
  const [styleClass, setStyleClass] = useState("square-large")

  let board = boardState;
  useEffect(() => {
    if (size == 3) {setStyleClass("square-large");}
    if (size == 4) {setStyleClass("square-medium");}
    if (size == 5) {setStyleClass("square-small");}
  }, [size])

  useEffect(() =>{
    if (newGame){
    setMark("null");
    setIsMarked(false);
    }
  }, [newGame])

  useEffect(() =>{
    const readMark = board[row][col];
    if (readMark == "X") {setMark(Cross()); setIsMarked(true);}
    else if (readMark == "O") {setMark(Circle()); setIsMarked(true);}
    else if (readMark === "null"){
      setMark("null");
      setIsMarked(false);
    }
    console.log("Square:");
    console.log(board);
  }, [board])

  function handleMark(){
    if (!isMarked && !won){
      if (turn %2 === 0) {
        // setMark(Cross());
        board[row][col] = "X";
      }
      else {
        // setMark(Circle());
        board[row][col] = "O";
      }

      handleTurn();
      // setIsMarked(true);
      updateBoard(board);
    }
  }

  return(
    <>
      <button id={id} className={styleClass} onClick={handleMark}>{mark}</button>
    </>
  );
}

function BoardRow({turn, handleTurn, newGame, size, row, boardState, updateBoard, won}){
  let squares = [];
  let col = 0;
  for (let i = 1; i <= size; i++) {
    let id = 0;
    id = i + (size * row);
    col = i - 1;
    // squares.push(Square({turn, handleTurn, newGame, id, row, col, boardState, updateBoard, won}));
    squares.push(
      <Square turn={turn} handleTurn={handleTurn} newGame={newGame} id={id} row={row} col={col} 
      boardState={boardState} updateBoard={updateBoard} won={won} size={size}/>
    )
  }
  return <div className="row">{squares}</div>
}

function FullBoard({turn, handleTurn, newGame, size, boardState, updateBoard, won}){
  let rows = [];
  let row = 0;
  while (row <= size-1) {
    // rows.push(BoardRow({turn, handleTurn, newGame, size, row, boardState, updateBoard, won}));
    rows.push(
      <BoardRow turn={turn} handleTurn={handleTurn} newGame={newGame} size={size} row={row} 
      boardState={boardState} updateBoard={updateBoard} won={won}/>
    )
    row++;
  }
  return rows;          
}

function RestartButton({restartTurn}){

  return(
    <button className="restartButton" onClick={restartTurn}>Restart</button>
  );

}

function SizeButton({size, setSize}){
  let btnSize = size;

  function updateSize(btnSize){
    setSize(size);
  }

  return (
    <button className="sizeButton" onClick={updateSize}>{btnSize} x {btnSize}</button>
  );
}

export default App; 