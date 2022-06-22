import './Leaderboard.css'
import React, { useEffect,useState } from 'react'

const Leaderboard = ({setLeaderboardIsOpen,leaderboardData,fetchLeaderboard}) => {

    const [dropdownButton,setDropdownButton] = useState(false)

    const toggleDDButton = () => {
        setDropdownButton(!dropdownButton)
    }

    return ( 
        <div className='leaderboardWrapper absolute'>
            <button className="relative hover:text-white" onClick={()=>{setLeaderboardIsOpen(false)}}>X</button>
        	<div className='grid grid-cols-6 gap 10 h-20' style={{maxHeight:"10vh"}}>
                <div><h2>Email:</h2></div>
                <div><h2>time:</h2></div>
                <div><h2>dificulty:</h2></div>
                <div><h2>date:</h2></div>
                <div><h2>jokers:</h2></div>
                <div className='cursor-pointer'>
                    <div onClick={()=>{toggleDDButton()}} className="sortDiv flex justify-between">
                        <div>sortBy</div>
                        {
                            dropdownButton ? 
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                            </svg>
                            :
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                        }
                        
                    </div>
                    <div style={{display: !dropdownButton && "none"}} onClick={()=>{toggleDDButton()
                        fetchLeaderboard('dificulty')
                    }} className="sortDiv">DIFICULTY</div>
                    <div style={{display: !dropdownButton && "none"}} onClick={()=>{toggleDDButton()
                        fetchLeaderboard('default')
                    }} className="sortDiv">EMAIL</div>
                    <div style={{display: !dropdownButton && "none"}} onClick={()=>{toggleDDButton()
                        fetchLeaderboard('time')
                    }} className="sortDiv">TIME</div>
                    <div style={{display: !dropdownButton && "none"}} onClick={()=>{toggleDDButton()
                        fetchLeaderboard('date')
                    }} className="sortDiv">DATE</div>
                    <div style={{display: !dropdownButton && "none"}} onClick={()=>{toggleDDButton()
                        fetchLeaderboard('jokersUsed')
                    }} className="sortDiv">JOKERS</div>
                </div>
            </div>
            {leaderboardData ? <>
                    {leaderboardData && leaderboardData.map((item,i)=>{
                        return (
                            <div className='grid grid-cols-6 gap 20 items-center' style={{backgroundColor: i % 2 === 0 ? "Gray" : "lightGray"}} key={i}>
                                <div style={{wordWrap:"break-word",color:"blue",textDecoration:"underline"}}>
                                    {item.email}
                                </div>
                                <div className="text-center">
                                    {item.timePlayed.forDisplay}
                                </div>   
                                <div  style={{textAlign:"center"}}>
                                    {item.dificulty}
                                </div>   
                                <div className=" text-center">
                                    {item.createdAt.slice(0,10)}
                                </div>   
                                <div style={{marginLeft:"2px",textAlign:"center"}}>
                                    {item.jokersUsed}
                                </div>   
                            </div>
                        )
                    })}
            </> : <>Loading...</>}
        </div>
    );
}
 
export default Leaderboard;