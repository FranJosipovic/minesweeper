import React, { useState } from "react";
import './DropdownMenu.css'

const DropdownMenu = ({setMinesNum,setArrSize,startGame,setLeaderboardIsOpen,setJokerTriesByDificulty}) => {
    const options = [
        {key:1, minesNum:10,arrSize:9,jokerTries:5, label: 'Easy'},
        {key:2, minesNum:40,arrSize:14,jokerTries:10, label: 'Medium'},
        {key:3, minesNum:99,arrSize:20,jokerTries:20, label: 'Hard'},
    ];

    const [dropDownTitle,setDropDownTitle] = useState(options[0].label)

    const selectDificulty = (e) => {
        
        setJokerTriesByDificulty(e.jokerTries)
        setDropDownTitle(e.label)
        setArrSize(e.arrSize)
        setMinesNum(e.minesNum)
        startGame()
        setLeaderboardIsOpen(false)
    }

    return ( 
        <div className="dropdown">
            <button className="dropbtn">{dropDownTitle}</button>
            <div className="dropdown-content">
            <a onClick={()=> {selectDificulty(options[0])}}>{options[0].label}</a>
            <a onClick={()=> {selectDificulty(options[1])}}>{options[1].label}</a>
            <a onClick={()=> {selectDificulty(options[2])}}>{options[2].label}</a>
            </div>
        </div>
    );
}
 
export default DropdownMenu;