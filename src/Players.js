import React from "react";
import "./style.css";

export default function Players(props){

  const activePlayerClass =  (i) => i == props.activePlayerInd ? "PlayerActive" : "PlayerPassive";

  return ( 
    <tr>
      <td >
         <button onClick={props.handleClickRoll}>Roll</button>
         <button onClick={props.handleClickUndo}>Undo</button>
      </td>
      {props.players.map((p,i) => <td key={p+i} className={activePlayerClass(i)}>{p}</td>)}
    </tr> );
  }
