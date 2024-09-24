import {useState, useEffect, useContext, useRef, useCallback} from 'react';
import { BoardContext } from './App';

function Cross() { return (<div className="cross"> X </div>); }

function Circle() { return (<div className="circle"> O </div>); }

function Square({props, row, col, id}) {
  const [mark, setMark] = useState("null");
  const [isMarked, setIsMarked] = useState(false);
  const [styleClass, setStyleClass] = useState("square-large")
  const prevMark = useRef(mark);

  let board = props.board;
  let updateBoard = props.updateBoard;
  let size = props.size;
  let newGame = props.newGame;
  let turn = props.turn;
  let handleTurn = props.handleTurn;
  let won = props.won;


  useEffect(() => {
    if (size == 3) { setStyleClass("square-large"); }
    if (size == 4) { setStyleClass("square-medium"); }
    if (size == 5) { setStyleClass("square-small"); }
  }, [size])

  useEffect(() => {
    if (newGame) {
      setMark("null");
      setIsMarked(false);
    }
  }, [newGame])

  useEffect(() => {
    const readMark = board[row][col];
    console.log("prev: " + prevMark.current + ", cur: " + readMark);
    // if (readMark != prevMark.current){
        console.log("rendered");
    //     prevMark.current = readMark;
        if (readMark == "X") {
        setMark(Cross()); setIsMarked(true);
        } else if (readMark == "O") {
        setMark(Circle()); setIsMarked(true);
        } else if (readMark === "null") {
        setMark("null"); setIsMarked(false);
        }
    // }
  }, [board[row][col]])

  function handleMark() {
    if (!isMarked && !won) {
      if (turn % 2 === 0) { board[row][col] = "X"; } else { board[row][col] = "O"; }

      handleTurn();
      updateBoard(board);
    }
  }

  return (
    <button id={id} className={styleClass} onClick={handleMark}>{mark}</button>
  );
}

function BoardRow({props, row}) {
  // let squares = [];
  // let col = 0;

  // for (let i = 1; i <= size; i++) {
  //   let id = 0; id = i + (size * row);
  //   col = i - 1;
  //   squares.push(<Square turn={turn} handleTurn={handleTurn} newGame={newGame} id={id} row={row}
  //     col={col} boardState={boardState} updateBoard={updateBoard} won={won} size={size} />)
  //   }
  //   return <div className="row">{squares}</div>


  //self try recursion
  // let squares = [];
  // function generateSquares(col, squares){
  //   let arr = squares;
  //   arr.push(<Square turn={turn} handleTurn={handleTurn} newGame={newGame} id={col + 1 + size * row}
  //     row={row} col={col} boardState={boardState} updateBoard={updateBoard} won={won} size={size} />);

  //   if (col >= size - 1) {return arr;}
  //   return generateSquares(col + 1, arr);
  // }

  //advanced recursion (model answer by blackbox)
  function generateSquares(col){
    if (col >= props.size) return [];
    return[
    <Square props={props} row={row} col={col} id={col + 1 + props.size * row}/>,
      ...generateSquares(col + 1)
    ];
  }

  return (
  <div>{generateSquares(0)}</div>
  );

  }

export function FullBoard() {
  const props = useContext(BoardContext);
  let rows = [];
  let row = 0;
  while (row <= props.size - 1) {
    rows.push(<BoardRow props={props} row={row}/>);
    row++;
  }
  return rows;

  // const renderBoard = useCallback(() =>{
  //   let rows = [];
  //   let row = 0;
  //   while (row <= props.size - 1) {
  //     rows.push(<BoardRow props={props} row={row}/>);
  //     row++;
  //   }
  //   return rows;
  // }, [props.size])

  // renderBoard();

  // function generateRows(row){
  //   if (row >= props.size) return [];
  //   return[
  //     <BoardRow props={props} row={row}/>,
  //     ...generateRows(row + 1)
  //   ];  
  // }
  
  // return generateRows(0);
  
}

