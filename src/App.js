import logo from './logo.svg';
import './App.css';
import {useState} from 'react';
import {useEffect} from 'react';



function App() {
  const [turn, setTurn] = useState(1);
  const [announcement, setAnnouncement] = useState("Turn 1, O's move");

  function handleTurn(){
    setTurn(turn + 1);
    handleAnnouncement(turn + 1);
  }

  function handleAnnouncement(turn){
    let mark = turn % 2 == 0 ? "X" : "O";
    let string = "";
    if (turn <= 9) {
      string = "Turn " + turn + ", " + mark + "'s move";
    }
    else{
      string = "All blocks filled, game ended";
    }
    setAnnouncement(string);
  }

  useEffect(() =>{
    setTurn(1);
  }, [])


  return (
    <div className="App">
      <h1>{announcement}</h1>
      <Board turn={turn} handleTurn={handleTurn}/>
    </div>
  );
}

function Square({turn, handleTurn}){
  const [mark, setMark] = useState("");
  const [isMarked, setIsMarked] = useState(false);

  function handleMark(){
    if (!isMarked){
      if (turn %2 == 0) {setMark("X");}
      else {setMark("O");}
      handleTurn();
      setIsMarked(true);
    }
  }

  return(
    <>
      <button className="square" onClick={handleMark}>{mark}</button>
    </>
  );
}


function Board({turn, handleTurn}){
  return(
  <>
    <div>
      <Square turn = {turn} handleTurn={handleTurn}/>
      <Square turn = {turn} handleTurn={handleTurn}/>
      <Square turn = {turn} handleTurn={handleTurn}/>
    </div>
    <div>
      <Square turn = {turn} handleTurn={handleTurn}/>
      <Square turn = {turn} handleTurn={handleTurn}/>
      <Square turn = {turn} handleTurn={handleTurn}/>
    </div>
    <div>
      <Square turn = {turn} handleTurn={handleTurn}/>
      <Square turn = {turn} handleTurn={handleTurn}/>
      <Square turn = {turn} handleTurn={handleTurn}/>
    </div>
  </>
  )
}

export default App;
