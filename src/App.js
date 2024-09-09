import logo from './logo.svg';
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

  function emptyBoard(){
    return [...Array(3)].map(() => Array(3).fill("null"));
  }

  function updateBoard(newBoard){
    setBoard([...newBoard]);
  }

  function handleTurn(){
    setTurn(turn + 1);
    setNewGame(false);
    handleAnnouncement(turn + 1);

    // scanBoard();
    // if (!won) {
    //   handleAnnouncement(turn + 1);
    // }
    // else{
    //   handleAnnouncement(100);
    // }
  }

  function restartTurn(){
    setTurn(1);
    setBoard(emptyBoard());
    handleAnnouncement(1);
    setNewGame(true);
    setWon(false);
  }

  function handleAnnouncement(turn){
    let mark = turn % 2 == 0 ? "X" : "O";
    let string = "";
    if (turn == 100) {string = "Game end, " + winner + " wins!";}
    else{
      if (turn <= 9) {
        string = "Turn " + turn + ", " + mark + "'s move";
      }
      else{
        string = "All blocks filled, game ended";
      }
    }
    setAnnouncement(string);
  }

  function scanBoard(){
    if ((board[0][0] == board[0][1] && board[0][1] == board[0][2]) && (board[0][0] != "null")) {setWon(true); setWinner(board[0][0]);}
    if ((board[1][0] == board[1][1] && board[1][1] == board[1][2]) && (board[1][0] != "null")) {setWon(true); setWinner(board[1][0]);}
    if ((board[2][0] == board[2][1] && board[2][1] == board[2][2]) && (board[2][0] != "null")) {setWon(true); setWinner(board[2][0]);}
    if ((board[0][0] == board[1][0] && board[1][0] == board[2][0]) && (board[0][0] != "null")) {setWon(true); setWinner(board[0][0]);}
    if ((board[0][1] == board[1][1] && board[1][1] == board[2][1]) && (board[0][1] != "null")) {setWon(true); setWinner(board[0][1]);}
    if ((board[0][2] == board[1][2] && board[1][2] == board[2][2]) && (board[0][2] != "null")) {setWon(true); setWinner(board[0][2]);}
    if ((board[0][0] == board[1][1] && board[1][1] == board[2][2]) && (board[0][0] != "null")) {setWon(true); setWinner(board[0][0]);}
    if ((board[2][0] == board[1][1] && board[1][1] == board[0][2]) && (board[2][0] != "null")) {setWon(true); setWinner(board[2][0]);}
  }

  useEffect(() =>{
    setBoard(board);
  }, [board])

  useEffect(() => {
    if (turn > 4) {scanBoard();}
  }, [turn])

  useEffect(() => {
    if (won){
      handleAnnouncement(100);
      // setWon(false);
      console.log("global won: ");
    }
  }, [won])
 
  return (
    <div className="App">
      <h1>{announcement}</h1>
      <h2>{newGame}</h2>
      <FullBoard turn={turn} handleTurn={handleTurn} newGame={newGame} size={size} boardState={board} updateBoard={updateBoard} won={won}/>
      <RestartButton restartTurn={restartTurn}/>
    </div>
  );
}

function Cross(){
  return(
    <h3 className="cross">
      X
    </h3>
  );
}

function Circle(){
  return(
    <h3 className="circle">
      O
    </h3>
  );
}

function Square({turn, handleTurn, newGame, id, row, col, boardState, updateBoard, won}){
  const [mark, setMark] = useState("null");
  const [isMarked, setIsMarked] = useState(false);

  let board = boardState;

  useEffect(() =>{
    if (newGame){
    setMark("null");
    setIsMarked(false);
    }
  }, [newGame])

  function handleMark(){
    console.log(row, col);

    if (!isMarked && !won){
      if(won) {console.log("won");}
      else if (!won) {console.log("not won");}
      if (turn %2 === 0) {
        setMark(Cross());
        board[row][col] = "X";
      }
      else {
        setMark(Circle());
        board[row][col] = "O";
      }

      handleTurn();
      setIsMarked(true);
      updateBoard(board);
    }
  }

  return(
    <>
      <button id={id} className="square" onClick={handleMark}>{mark}</button>
    </>
  );
}

function BoardRow({turn, handleTurn, newGame, size, row, boardState, updateBoard, won}){
  let squares = [];
  let col = 0;
  for (let i = 1; i <= size; i++) {
    let id = 0;
    if (row == 0){
      id = i;
    }
    else if (row == 1){
      id = i + size;
    }
    else if (row == 2){
      id = i + (size * 2);
    }
    col = i - 1;
    squares.push(Square({turn, handleTurn, newGame, id, row, col, boardState, updateBoard, won}));
  }
  return <div>{squares}</div>
}

function FullBoard({turn, handleTurn, newGame, size, boardState, updateBoard, won}){
  let rows = [];
  let row = 0;
  while (row <= size-1) {
    rows.push(BoardRow({turn, handleTurn, newGame, size, row, boardState, updateBoard, won}));
    row++;
  }
  return rows;          
}

function RestartButton({restartTurn}){

  return(
    <button className="restartButton" onClick={restartTurn}>Restart</button>
  );

}

export default App; 