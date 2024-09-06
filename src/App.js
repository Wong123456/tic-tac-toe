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

  function handleTurn(){
    setTurn(turn + 1);
    setNewGame(false);
    // scan(3);
    if (!won){
      handleAnnouncement(turn + 1);
    }
    else {
      handleAnnouncement(100);
    }

  }

  function restartTurn(){
    setTurn(0);
    handleAnnouncement(0);
    setNewGame(true);
    setWon(false);
  }

  function handleAnnouncement(turn){
    let mark = turn % 2 == 0 ? "X" : "O";
    let string = "";
    if (turn == 100) {string = "Game end, " + winner + "wins!";}
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

  function scan(size){
    let marks = []
    for (let i = 1; i <= size^2; i++){
      marks.push(document.getElementById(i).value);
    }
    if ((marks[0] == marks[1] == marks[2]) && (marks[0] != "")) {setWon(true); setWinner(marks[0]);}
    if (marks[3] == marks[4] == marks[5]) {setWon(true); setWinner(marks[3]);}
    if (marks[6] == marks[7] == marks[8]) {setWon(true); setWinner(marks[6]);}
    if (marks[0] == marks[3] == marks[6]) {setWon(true); setWinner(marks[0]);}
    if (marks[1] == marks[4] == marks[7]) {setWon(true); setWinner(marks[1]);}
    if (marks[2] == marks[5] == marks[8]) {setWon(true); setWinner(marks[2]);}
    if (marks[0] == marks[4] == marks[8]) {setWon(true); setWinner(marks[0]);}
    if (marks[2] == marks[4] == marks[6]) {setWon(true); setWinner(marks[2]);}
  }

  // useEffect(() =>{
  //   scan();
  // }, [turn])

  return (
    <div className="App">
      <h1>{announcement}</h1>
      <h2>{newGame}</h2>
      <FullBoard turn={turn} handleTurn={handleTurn} newGame={newGame} size={size}/>
      <RestartButton restartTurn={restartTurn}/>
    </div>
  );
}

function Square({turn, handleTurn, newGame, id}){
  const [mark, setMark] = useState("");
  const [isMarked, setIsMarked] = useState(false);

  useEffect(() =>{
    if (newGame){
    setMark("");
    setIsMarked(false);
    }
  }, [newGame])

  function clearMark(){
    setMark("");
    setIsMarked(false);
  }

  function handleMark(){
    if (!isMarked){
      if (turn %2 === 0) {setMark("X");}
      else {setMark("O");}
      handleTurn();
      setIsMarked(true);
      console.log(id + ", " + mark);
    }
  }


  return(
    <>
      <button id={id} className="square" onClick={handleMark}>{mark}</button>
    </>
  );
}

function BoardRow({turn, handleTurn, newGame, size, rowNum}){
  let row = [];
  for (let i = 1; i <= size; i++) {
    let id = 0;
    if (rowNum == 1){
      id = i;
    }
    else if (rowNum == 2){
      id = i + size;
    }
    else if (rowNum == 3){
      id = i + (size * 2);
    }
    row.push(Square({turn, handleTurn, newGame, id}));
  }
  return <div>{row}</div>
}

function FullBoard({turn, handleTurn, newGame, size}){
  let rows = [];
  let rowNum = 1;
  while (rowNum <= size) {
    rows.push(BoardRow({turn, handleTurn, newGame, size, rowNum}));
    rowNum++;
  }
  return rows;
}

function RestartButton({restartTurn}){

  function restart(){
    const squares = document.getElementsByClassName("square");
    for (let square of squares){
      square.innerText = "";
    }
    // document.getElementById("square").innerText = "";
    restartTurn();
  }

  return(
    <button className="restartButton" onClick={restart}>Restart</button>
  );

}

export default App; 
