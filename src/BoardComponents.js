import {useState, useEffect, useContext, useRef, useCallback} from 'react';
import { BoardContext, ThemeContext } from './App';

function Cross() { return (<div className="cross"> X </div>); }

function Circle() { return (<div className="circle"> O </div>); }

const styleClasses = {
  3: "square-large",
  4: "square-medium",
  5: "square-small"
};

function Square({props, row, col, id}) {
  const [mark, setMark] = useState("null");
  const [isMarked, setIsMarked] = useState(false);
  const [styleClass, setStyleClass] = useState("square-large")
  const prevMark = useRef(mark);
  const themeProps = useContext(ThemeContext);

  const markTypes = {
    "X": function() {
      setMark(Cross()); setIsMarked(true);
    },
    "O": function() {
      setMark(Circle()); setIsMarked(true);
    },
    "null": function() {
      setMark("null"); setIsMarked(false);
    }
  };

  let theme = themeProps.theme;

  const {board, updateBoard, size, newGame, turn, handleTurn, won} = props;

  useEffect(() => {
    setStyleClass(styleClasses[size]);
  }, [size])

  useEffect(() => {
    if (newGame) {
      setMark("null");
      setIsMarked(false);
    }
  }, [newGame])

  useEffect(() => {
    const readMark = board[row][col];
    markTypes[readMark]();
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

