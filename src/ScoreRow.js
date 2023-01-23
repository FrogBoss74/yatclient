import React from "react";
import "./style.css";

export default function ScoreRow(props) {

  const i =props.row;

  const rows = props.scoreRow;

  const displayPreview = (i) => (props.allowHover && props.display_preview)?props.score_preview[i]:" ";

  const clickhandle = (e) =>  props.handleClickScore(e,i);

  return ( <tr>
            <td key={"sctdh"}
                className={props.allowHover?"CanClick":"CannotClick"}
                onClick={clickhandle}>
                <span>{props.labels}</span><em>{displayPreview(i)}</em>
            </td>
            {rows.map( (e,i) => <td key={"sctd"+i}>{e}</td>)}  
           </tr>  );
  }
