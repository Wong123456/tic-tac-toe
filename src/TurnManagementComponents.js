export function RedoButton({ redo }) { return (<button className='redo' onClick={redo}>Redo</button>); }

export function UndoButton({ undo }) { return (<button className='undo' onClick={undo}>Undo</button>); }

export function RestartButton({ restartTurn }) {
    return (<button className="restartButton" onClick={restartTurn}>Restart</button>);
  }
  
export function SizeButton({ size, setSize }) {
    let btnSize = size;
    function updateSize(btnSize) { setSize(size); }
  
    return (<button className="sizeButton" onClick={updateSize}>{btnSize} x {btnSize}</button>);
  }