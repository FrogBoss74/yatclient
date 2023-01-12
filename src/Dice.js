import React from "react";

import Die from "./Die.js";

export default function Dice(props){

  if (props.display === true) {

  return (
    <div>
    <svg height = "4em"  width = "270px"> {
      props.roll.map( (e,i) => 
     <Die key={"dobj"+i} index = {i} val = {e}  handleClickHold = {props.handleClickHold}/>  )}
    </svg>
    </div>);
  } 
  else {
    return (<div><svg height = "4em"  width = "270px"></svg></div>)
    }
}
