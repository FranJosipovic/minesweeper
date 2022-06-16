import './App.css';
import React,{ useState,useEffect,useRef} from 'react';
import flag from './images/flag.webp'
import minica from './images/mine.png'
import DropdownMenu from './DropdownMenu';
import AddtoLeaderboard from './AddtoLeaderboard';
import Leaderboard from './Leaderboard';

function App() {

const [minesMatrix,setMinesMatrix] = useState()
const [arrSize,setArrSize] = useState(9)
const [minesNum,setMinesNum] = useState(10)
const [flagNum,setFlagNum] = useState(minesNum)
const [placesToFree,setPlacesToFree] = useState((arrSize * arrSize)-minesNum)
const [gameIsFinished,setGameIsFinished] = useState(false)
const [gameIsWon,setGameIsWon] = useState(undefined)
const [timePlayed,setTimePlayed] = useState(0)
const [timerOn,setTimerOn] = useState(false)
const [leaderboardIsOpen,setLeaderboardIsOpen] = useState(false)
const [leaderboardData,setLeaderboardData] = useState()
const [jokerIsActive,setJokerIsActive] = useState(false)
const [jokerTriesByDificulty,setJokerTriesByDificulty] = useState(5)
const [jokerTries,setJokerTries] = useState(jokerTriesByDificulty)
const [jokersUsed,setJokersUsed] = useState()

const arrSizeRef = useRef(0)
const numMinesRef = useRef(0)

arrSizeRef.current = arrSize
numMinesRef.current = minesNum

const getMinsAndSecs = (time) => {
  let mind = time % 3600;
  let minutes = Math.floor(mind / 60);
  let secd = mind % 60;
  let seconds = Math.ceil(secd);

  if(minutes === 0){
    return `${seconds}sec`
  }
  return `${minutes}min : ${seconds}sec`
}

useEffect(() => {
  startGame()
},[minesNum])


useEffect(()=>{
  if(jokerTries <= 0){
    setJokerIsActive(false)
  }
},[jokerTries])

useEffect(()=> {
  if(gameIsWon){
    setJokersUsed(jokerTriesByDificulty-jokerTries)
    revealWholeField()
  }
},[gameIsWon])

useEffect(()=>{
  let interval = null
  
  if(timerOn){
      interval = setInterval(() => {
          setTimePlayed(prevTime => prevTime + 1)
      }, 1000);
  }else{
      clearInterval(interval)
  }

  return ()=>clearInterval(interval)
},[timerOn])

const startGame = () => {
  setJokersUsed(0)
  setJokerTries(jokerTriesByDificulty)
  setGameIsFinished(false)
  setGameIsWon(undefined)
  setFlagNum(minesNum)
  setTimePlayed(0)
  setTimerOn(true)
  let counter = 0
  let grid = Array(arrSizeRef.current).fill(0).map(row => new Array(arrSizeRef.current).fill(0))
  
  for(let i = 0;i<arrSizeRef.current;i++){
    for (let j = 0; j < arrSizeRef.current; j++) {
      counter ++
      let obj = {
        id : counter,
        isMine : false,
        value : 0,
        showBack : true,
        color : "red",
        isFlaged : false
      }
      grid[i][j] = obj
    }

  }  
  
  for (let i = 0; i < numMinesRef.current; i++) {
    let tr = true
    while(tr){
      let x = randomNumberInRange(0,arrSizeRef.current-1)
      let y = randomNumberInRange(0,arrSizeRef.current-1)
      if(!grid[x][y].isMine){
        grid[x][y].isMine = true
        grid[x][y].value = 'mine'
        tr = false
      }
    }
  }  
  
  for(let i = 0 ;i<arrSizeRef.current;i++){
    for(let j = 0;j<arrSizeRef.current;j++){
      let counter2 = 0
      if(grid[i][j].value !== 'mine'){
        if(isValid(i-1,j-1)){
          if(grid[i-1][j-1].isMine){
            counter2 ++
          }
        }
        if(isValid(i-1,j)){
          if(grid[i-1][j].isMine){
            counter2 ++
          }
        }
        if(isValid(i-1,j+1)){
          if(grid[i-1][j+1].isMine){
            counter2 ++
          }
        }
        if(isValid(i,j-1)){
          if(grid[i][j-1].isMine){
            counter2 ++
          }
        }
        if(isValid(i,j+1)){
          if(grid[i][j+1].isMine){
            counter2 ++
          }
        }
        if(isValid(i+1,j-1)){
          if(grid[i+1][j-1].isMine){
            counter2 ++
          }
        }
        if(isValid(i+1,j)){
          if(grid[i+1][j].isMine){
            counter2 ++
          }
        }
        if(isValid(i+1,j+1)){
          if(grid[i+1][j+1].isMine){
            counter2 ++
          }
        }
        grid[i][j].value = counter2
      }
    }
  }

  for(let i = 0;i<arrSizeRef.current;i++){
    for(let j = 0;j<arrSizeRef.current;j++){
      if(grid[i][j].value === 1){
        grid[i][j].color = "blue"
      }else if(grid[i][j].value === 2){
        grid[i][j].color = "green"
      }else if(grid[i][j].value === 3){
        grid[i][j].color = "red"
      }else if(grid[i][j].value === 4){
        grid[i][j].color = "purple"
      }else if(grid[i][j].value === 5){
        grid[i][j].color = "orange"
      }else if(grid[i][j].value === 6){
        grid[i][j].color = "cyan"
      }
    }
  }
  let counter3 = 0
  for(let i=0;i<arrSizeRef.current;i++){
    for(let j = 0;j<arrSizeRef.current;j++){
      if(!grid[i][j].isMine){
        counter3++
      }
    }
  }
  setPlacesToFree(counter3)
  setMinesMatrix(grid)
}

const randomNumberInRange = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const isValid = (x,y)=> {
  if(x >= arrSize || x < 0 || y >= arrSize || y < 0){
    return false
  }else{
    return true
  }
}

const revealMines = () => {
  for (let i = 0; i < arrSize; i++) {
    for(let j = 0;j<arrSize;j++){
      if(minesMatrix[i][j].isMine){
        setMinesMatrix(prevState =>{
          return prevState.map(arr => {
            return arr.map(item => {
              if(item.id === minesMatrix[i][j].id){
                return {...item,showBack:false}
              }else {
                return item
              }
            })
          })
        })
      }
    }
  }
}

const revealWholeField = () => {
  setMinesMatrix(prevState => { 
    return prevState.map(dio=>{
      return dio.map(djelicDijela =>{ 
        return {...djelicDijela,showBack:false}
      })
      })
  })
}

const getMatrixPosition = (item,m,n) => {
  if(jokerIsActive){
    setJokerTries(jokerTries-1)
    setMinesMatrix(prevState => { 
      return prevState.map(dio=>{
        return dio.map(djelicDijela => 
        {if(djelicDijela.id === item.id){
          return {...djelicDijela,showBack:false}
        }else{
          return djelicDijela
        }})
        })
    })
    return
  }
  if(placesToFree === 1){
    setTimerOn(false)
    setGameIsFinished(true)
    setGameIsWon(true)
    return
  }
  if(item.isFlaged){
    return
  }
  if(item.isMine){
    revealMines()
    setGameIsFinished(true)
    setGameIsWon(false)
    setTimerOn(false)
  }
  setPlacesToFree(placesToFree - 1)
  if(item.value !== 0){
    setMinesMatrix(prevState => { 
      return prevState.map(dio=>{
        return dio.map(djelicDijela => 
        {if(djelicDijela.id === item.id){
          return {...djelicDijela,showBack:false}
        }else{
          return djelicDijela
        }})
        })
    })
  }else{
    let arr = [...minesMatrix]
    let newArr = openFieldAlgorithm(m,n,arr)
    let counter3 = 0
    let counterMines = 0
    for(let i=0;i<arrSize;i++){
      for(let j = 0;j<arrSize;j++){
        if(newArr[i][j].showBack){
          counter3++
        }
        if(newArr[i][j].isMine){
          counterMines++
        }
      }
    }
    if(placesToFree === 0){
      setTimerOn(false)
      setGameIsFinished(true)
      setGameIsWon(true)
      return
    }
    setPlacesToFree(counter3-counterMines)
    setMinesMatrix(newArr)
  }
}

const openFieldAlgorithm = (i,j,arr) =>{    
  arr[i][j].showBack = false
  if(isValid(i-1,j-1)){
    if(arr[i-1][j-1].value !== 'mine'){
      if(arr[i-1][j-1].value === 0 && arr[i-1][j-1].showBack === true){
        arr = openFieldAlgorithm(i-1,j-1,arr)
      }
      arr[i-1][j-1].showBack = false
    }
  }
  
  if(isValid(i-1,j)){
    if(arr[i-1][j].value !== 'mine'){
      if(arr[i-1][j].value === 0 && arr[i-1][j].showBack === true){
        arr = openFieldAlgorithm(i-1,j,arr)
      }
      arr[i-1][j].showBack = false
    } 
  }
  
  if(isValid(i-1,j+1)){
    if(arr[i-1][j+1].value !== 'mine'){
      if(arr[i-1][j+1].value === 0 && arr[i-1][j+1].showBack === true){
        arr = openFieldAlgorithm(i-1,j+1,arr)
      }
      arr[i-1][j+1].showBack = false
    }  
  }
  
  if(isValid(i,j-1)){
    if(arr[i][j-1].value !== 'mine'){
      if(arr[i][j-1].value === 0 && arr[i][j-1].showBack === true){
        arr = openFieldAlgorithm(i,j-1,arr)
      }
      arr[i][j-1].showBack = false
    }  
  }
  
  if(isValid(i,j+1)){
    if(arr[i][j+1].value !== 'mine'){
      if(arr[i][j+1].value === 0 && arr[i][j+1].showBack === true){
        arr = openFieldAlgorithm(i,j+1,arr)
      }
      arr[i][j+1].showBack = false
    }  
  }
  
  if(isValid(i+1,j-1)){
    if(arr[i+1][j-1].value !== 'mine'){
      if(arr[i+1][j-1].value === 0 && arr[i+1][j-1].showBack === true){
        arr = openFieldAlgorithm(i+1,j-1,arr)
      }
      arr[i+1][j-1].showBack = false
    }  
  }
  
  if(isValid(i+1,j)){
    if(arr[i+1][j].value !== 'mine'){
      if(arr[i+1][j].value === 0 && arr[i+1][j].showBack === true){
        arr = openFieldAlgorithm(i+1,j,arr)
      }
      arr[i+1][j].showBack = false
    }
  }
  
  if(isValid(i+1,j+1)){
    if(arr[i+1][j+1].value !== 'mine'){
      if(arr[i+1][j+1].value === 0 && arr[i+1][j+1].showBack === true){
        arr = openFieldAlgorithm(i+1,j+1,arr)
      }
      setPlacesToFree(placesToFree-1)
      arr[i+1][j+1].showBack = false
    }
  }
  return arr
}
  
const toggleFlag = (item) =>{
  if((flagNum === 0 && !item.isFlaged) || item.showBack === false){
    return 
  }
  if(!item.isFlaged){
    setFlagNum(flagNum-1)
  }else{
    setFlagNum(flagNum+1)
  }
  setMinesMatrix(prevState => { 
    return prevState.map(dio=>{
      return dio.map(djelicDijela => 
      {if(djelicDijela.id === item.id){
        return {...djelicDijela,isFlaged:!djelicDijela.isFlaged}
      }else{
        return djelicDijela
      }})
      })
  })
}

const fetchLeaderboard = (typeSort) => {
  fetch(`https://react-mines-fran.herokuapp.com/getLeaderboard/${typeSort}`,{
    method:"GET",
  }).then(res=>res.json())
  .then(data=>{
    setLeaderboardData(data.result)
  })
  setLeaderboardIsOpen(true)
}

const activateJoker = () => {
  if(jokerTries <= 0){
    return
  }
  setJokerIsActive(!jokerIsActive)
}


return (
  <div className="App">
    <div style={{width:"98.9wv"}}><DropdownMenu setJokerTriesByDificulty={setJokerTriesByDificulty} setLeaderboardIsOpen={setLeaderboardIsOpen} setArrSize={setArrSize} setMinesNum={setMinesNum} startGame={startGame} minesNum={minesNum}/></div>
    <div style={{display:"flex",justifyContent:"center",flexDirection:"row",alignItems:"center"}}>
      <button style={{marginRight:"100px"}} onClick={()=>{fetchLeaderboard('default')}}>open leaderboard</button>
      <h5><img src={flag} alt="flag" style={{width:"20px",height:"20px"}}/> : {flagNum}</h5>
      
      <h3 style={{marginLeft:"50px"}}>Vrijeme =&gt; {getMinsAndSecs(timePlayed)}</h3>
      <div style={{display:"flex",flexDirection:"row"}}>
        <div onClick={()=>{activateJoker()}} style={{maxWidth:"15vw",textAlign:"center",marginLeft:"20px",height:"30px",borderRadius:"2px",border:"1px solid black",cursor:"pointer",backgroundColor: jokerIsActive ? "lightGreen":""}}> joker zovi : {jokerTries}</div>
      </div>
      
    </div>
    <div className='appWrap' style={{pointerEvents:gameIsFinished ? "none" : ""}}>
      {minesMatrix && minesMatrix.map((item,i) => {
        return (
          <div className='rowWrap' key={i}>{
          item.map((jItem,j) => {
            return (
              <div className="forHover" key={j} onClick={()=>{getMatrixPosition(jItem,i,j)}} 
              onContextMenu={(e)=>{e.preventDefault() 
                toggleFlag(jItem,i,j)
                }}>
                {jItem.showBack ?
                  <div className='item' style={{backgroundColor : (j % 2 === 0) ? i % 2 === 0 ? "green" : "lightgreen" : i % 2 !== 0 ? "green" : "lightgreen"}}>
                    {jItem.isFlaged && <img style={{width:"100%",height:"100%"}} src={flag} alt="flag"/>}
                  </div>
                :
                  <div className='item' style={{color:jItem.color,fontWeight:"20000",backgroundColor : (j % 2 === 0) ? i % 2 === 0 ? "rgb(179, 175, 175)" : "lightgrey" : i % 2 !== 0 ? "rgb(179, 175, 175)" : "lightgrey"}}>{jItem.value === 0 ? <></> : jItem.isMine ? <><img style={{width :"100%",height:"100%",backgroundColor:"red"}} src={minica} alt="mine" /></>:<>{jItem.value}</> }</div>
                }
              </div>
            )
          })}
          </div>)})}
      </div>
      {gameIsFinished &&
        <div className='showEndGame'>
          {gameIsWon ?
          <div style={{display:"flex",justifyContent:"center",alignItems:"center",flexDirection:"column",marginTop:"10vh"}}>
            <div style={{color:"white",marginBottom:"30px"}}>Bravo pobijedio si</div>
            {jokersUsed && <AddtoLeaderboard minesNum={minesNum} timeforDisplay={getMinsAndSecs(timePlayed)} timeforSort={timePlayed} jokersUsed={jokersUsed}/>}
            <h2 style={{color:"white"}}>Iskoristeno jokera : {jokersUsed}</h2>
            <h1 style={{color:"white",marginLeft:"20px",marginTop:"-20px"}}>Vrijeme igre : {getMinsAndSecs(timePlayed)}</h1>
            <button onClick={()=>{startGame()}}>Igraj Ponovno</button>
          </div> 
          :
          <div style={{display:"flex",justifyContent:"center",alignItems:"center",flexDirection:"column"}}>
            <div style={{color:"white",marginBottom:"30px",marginTop:"30%"}}>IZGUBIO SI</div>
            <button style={{width:"30%",height:"5vh",borderRadius:"6px"}} onClick={()=>{startGame()}}>Igraj Ponovno</button>
          </div> 
          }
        </div>
      }
    <div className='leaderboard' style={leaderboardIsOpen ? {display:"block"}:{display:"none"}}>
        <Leaderboard setLeaderboardIsOpen={setLeaderboardIsOpen} leaderboardData={leaderboardData} fetchLeaderboard={fetchLeaderboard}/>
    </div>
  </div>
);
}

export default App;