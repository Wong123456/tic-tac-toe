export function UndoButton({undo}){
    return(
        <button className="undo" onClick={undo}>Undo</button>
    );
}

export function RedoButton({redo}){
    return (
        <button className="redo" onClick={redo}>Redo</button>
    );
}