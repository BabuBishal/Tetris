import React, { useState } from 'react'
import Stage from './Stage'
import Display from './Display'
import StartButton from './StartButton'

import { StyledTetris, StyledTetrisWrapper } from './styles/StylesTetris'
import { createStage, checkCollision } from './gameHelpers'

import { usePlayer } from '../hooks/usePlayer'
import { useStage } from '../hooks/useStage'
import { useInterval } from '../hooks/useInterval'
import { useGameStatus } from '../hooks/useGameStatus'

const Tetris = () => {

  const [dropTime, setDropTime ] = useState(null);
  const [gameOver, setGameOver] = useState(false)

  const  [player, updatePlayerPos, resetPlayer, playerRotate] = usePlayer();
  const [stage, setStage, rowsCleared] = useStage(player, resetPlayer);
  const [score, setScore, rows, setRows, level, setLevel] = useGameStatus(rowsCleared)

  // console.log('re-render')

  const movePlayer = (dir) => {
    if(!checkCollision(player, stage, {x: dir, y: 0})){
      updatePlayerPos({x: dir, y: 0 })
    }
  }

  const startGame = () => {
    setStage(createStage());
    setDropTime(1000)
    resetPlayer();
    setRows(0);
    setLevel(0);
    setScore(0);
    setGameOver(false);

  }

  const drop = () => {
    // increase level when cleared 10 rows
    if(rows >= (level +1)*10){
      setLevel(prev => prev + 1);
    // increase speed
    setDropTime(1000/ (level + 1) + 200);


    }

    if(!checkCollision(player, stage, {x: 0, y: 1})){
      updatePlayerPos({x: 0, y: 1, collided: false})
    }else{
      //gameover
      if(player.pos.y < 1){
        console.log("Game Over!!!");
        setGameOver(true);
        setDropTime(null);
      }
      updatePlayerPos({x: 0, y: 0, collided: true})

    }

  }

  const keyUp = ({keyCode}) => {
    if(!gameOver){
      if(keyCode === 40){
        if(level === 0) {
          setDropTime(1000)
        }else{

          setDropTime(1000/ (level + 1) )
        }
      }
    }
  }

  const dropPlayer = () => {
    setDropTime(null)
    drop()
  }

  const move = ({ keyCode }) => {
     if(!gameOver){
      if(keyCode === 37){
        movePlayer(-1);
      }else if(keyCode === 39){
        movePlayer(1);
      }else if(keyCode === 40){
       dropPlayer();
      }else if(keyCode === 38){
        playerRotate(stage, 1); 
      }
     }
  }

  useInterval(() => {
    drop()
  }, dropTime)

  return (
    <StyledTetrisWrapper role="button" tabIndex="0" onKeyDown={e => move(e)} onKeyUp={keyUp}>
        <StyledTetris>
        <Stage stage={stage}/>
        <aside>
          {gameOver ? (
            <Display gameOver={gameOver} text="Game Over" />
          ) :(
            <div>
              <Display text={`Score: ${score}`}/> 
              <Display text={`Rows: ${rows}`} /> 
              <Display text={`Level: ${level}`} /> 
            </div>
            ) }
            <StartButton callback={startGame}/>
          
        </aside>
        </StyledTetris>
    </StyledTetrisWrapper>            
  )
}

export default Tetris