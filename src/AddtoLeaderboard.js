import React, { useEffect, useState } from "react";

const AddtoLeaderboard = ({minesNum,timeforDisplay,timeforSort,jokersUsed}) => {

    const [email,setEmail] = useState('')
    const [canSave,setCanSave] = useState()
    const [isSubmiting,setIsSubmiting] = useState(false)

    useEffect(()=>{
        setCanSave(true)
    },[])

    const saveRecord = () =>{
        setIsSubmiting(true)
        let dificulty
        if(minesNum === 10){
            dificulty = 'easy'
        }else if(minesNum === 40){
            dificulty = 'medium'
        }else if(minesNum === 99){
            dificulty = 'hard'
        }
        fetch('https://francorsproxy.herokuapp.com/addToLeaderboard',{
            method : "POST",
            headers:{
                "Content-Type":"Application/json",
            },
            body:JSON.stringify({
                email:email,
                dificulty : dificulty,
                timePlayedforDisplay : timeforDisplay,
                timePlayedforSort : timeforSort,
                jokersUsed : jokersUsed
            })
        }).then(res=>res.json())
        .then((response)=> {
            if(response.success){  
                setIsSubmiting(false)
                setCanSave(false)   
                window.alert(response.success)
            }else{
                setIsSubmiting(false)
                window.alert(response.error)
            }
        })     
    }
    return ( 
        <div>
            <input className="text-black" placeholder="unesi email" value={email} onChange={e => {setEmail(e.target.value)}}/>
            <button className="rounded-sm border-2 text-white hover:bg-white hover:text-black ml-2" onClick={() => {saveRecord()}} style={{display:!canSave && "none"}}>spremi</button>
            {isSubmiting && 
                <div>
                    Uploading to database...
                </div>
            }
        </div>
     );
}
 
export default AddtoLeaderboard;