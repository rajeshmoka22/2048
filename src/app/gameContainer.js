import React, {Component} from 'react';
import ReactTouchEvents from "react-touch-events";
import colors from '../utils/colors';

class GameContainer extends Component {
  gameOverMessage = 'Game over';
  state = {
    numArray: [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],
    length: 4,
    score: 0,
    gameOver: false
  };

  componentDidMount() {
    document.querySelector('body').addEventListener('keydown', (e) => this.keyIdentifier(e));
    window.addEventListener('beforeunload', this.saveData);
    if(localStorage.getItem('matrix')) {
      const matrix = JSON.parse(localStorage.getItem('matrix'));
      const score = JSON.parse(localStorage.getItem('score'));
      this.removeData();
      this.setState({ numArray: matrix, score });
    } else this.populateExtraNumber();
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.saveData);
  }

  removeData = () => {
    localStorage.removeItem('matrix');
    localStorage.removeItem('score');
  }

  saveData = () => {
    const { numArray, score } = this.state;
    if (score > 0) {
      localStorage.setItem('matrix', JSON.stringify(numArray));
      localStorage.setItem('score', `${score}`);
    }
  }

  populateExtraNumber = () => {
    let { numArray } = this.state;
    numArray = this.pushNumberAtEmptySpot(numArray);
    this.setState({ numArray });
  }

  keyIdentifier = (e) => {
    switch(e.key) {
      case 'ArrowRight':
        this.handleSwipeRight();
        this.populateExtraNumber();
        break;
      case 'ArrowLeft':
        this.handleSwipeLeft();
        this.populateExtraNumber();
        break;
      case 'ArrowUp':
        this.handleArrowUp();
        this.populateExtraNumber();
        break;
      case 'ArrowDown':
        this.handleArrowDown();
        this.populateExtraNumber();
        break;
      default:
        // It does nothing.
    }
  }

  handleSwipe = (direction) => {
    switch(direction){
      case 'right':
        this.handleSwipeRight();
        this.populateExtraNumber();
        break;
      case 'left':
        this.handleSwipeLeft();
        this.populateExtraNumber();
        break;
      case 'top':
        this.handleArrowUp();
        this.populateExtraNumber();
        break;
      case 'bottom':
        this.handleArrowDown();
        this.populateExtraNumber();
        break;
      default:
          // It does nothing.
    }
  }

  removeZeros = (arr) => {
    return arr.filter(value =>  value > 0);
  }

  handleSwipeLeft = () => {
    const { numArray, length, score } = this.state;
    let scoreToBeAdded = 0;
    for(let i=0; i<length; i+=1) {
      let temp = [...numArray[i]];
      temp = this.removeZeros(temp);
      if(temp.length){
        for(let j=0; j<=temp.length-1;j+=1){
          if(temp[j] === temp[j+1]) {
            temp[j] *=2;
            temp[j+1]=0;
            scoreToBeAdded += temp[j];
          }
        }
        temp = this.removeZeros(temp);
      }
      for(let j=temp.length; j < length; j+=1){
        temp.push(0);
      }
      numArray[i] = temp;
    }
    this.setState({ numArray, score: score+scoreToBeAdded });
  }

  handleSwipeRight = () => {
    const { numArray, length, score } = this.state;
    let scoreToBeAdded = 0;
    for(let i=0; i<length; i+=1) {
      let temp = [...numArray[i]];
      temp = this.removeZeros(temp);
      if(temp.length){
        for(let j=temp.length-1; j>0;j-=1){
          if(temp[j] === temp[j-1]) {
            temp[j] *=2;
            temp[j-1]=0;
            scoreToBeAdded += temp[j];
          }
        }
      }
      temp = this.removeZeros(temp);
      for(let j = temp.length; j < length; j+=1){
        temp.unshift(0);
      }
      numArray[i] = temp;
    }
    this.setState({ numArray, score: score+scoreToBeAdded });
  }

  handleArrowUp = () => {
    const { numArray, length, score } = this.state;
    let scoreToBeAdded = 0;
    for(let i=0; i < length; i+=1){
      let temp = [];
      for(let j=0; j < length; j+=1) {
        if(numArray[j][i] > 0) temp.push(numArray[j][i]);
      }
      if(temp.length){
        for(let j=0;j<temp.length-1;j+=1){
          if(temp[j] === temp[j+1]){
            temp[j] *= 2;
            temp[j+1] = 0;
            scoreToBeAdded += temp[j];
          }
        }
      }
      temp = this.removeZeros(temp);
      for(let j=temp.length; j<length; j+=1){
        temp.push(0);
      }
      for(let j=0; j < length; j+=1) {
        numArray[j][i] = temp[j];
      }
    }
    this.setState({ numArray, score: score+scoreToBeAdded });
  }

  handleArrowDown = () => {
    const { numArray, length, score } = this.state;
    let scoreToBeAdded = 0;
    for(let i=0; i < length; i+=1){
      let temp = [];
      for(let j=0; j < length; j+=1) {
        if(numArray[j][i] > 0) temp.push(numArray[j][i]);
      }
      if(temp.length){
        for(let j=temp.length-1;j>0;j-=1){
          if(temp[j] === temp[j-1]){
            temp[j] *= 2;
            temp[j-1] = 0;
            scoreToBeAdded += temp[j];
          }
        }
      }
      temp = this.removeZeros(temp);
      for(let j=temp.length; j<length; j+=1){
        temp.unshift(0);
      }
      for(let j=0; j < length; j+=1) {
        numArray[j][i] = temp[j];
      }
    }
    this.setState({ numArray, score: score+scoreToBeAdded });
  }

  restartGame = () => {
    let numArray = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
    numArray = this.pushNumberAtEmptySpot(numArray);
    this.setState({ numArray, score: 0, gameOver: false });
  }

  pushNumberAtEmptySpot = (numArray) => {
    const emptySpots = [];
    for(let i=0; i<numArray.length; i+=1){
      for(let j=0; j<numArray.length; j+=1){
        if(!numArray[i][j]){ //check if element is 0
          emptySpots.push({
            x: i,
            y: j
          });
        }
      }
    }
    if(emptySpots.length){
      const spot = emptySpots[Math.floor(Math.random()*emptySpots.length)];
      numArray[spot.x][spot.y] = Math.floor(Math.random()*2) ? 2 : 4;
    } else this.isGameOver();
    return numArray;
  }

  isGameOver = () => {
    const { numArray, length } = this.state;
    let gameOver = true;
    let row = 0, col = 0;
    while(row < length-1) {
      for(let tempRow = row; tempRow < length-1; tempRow += 1){
        if(numArray[tempRow][col] === numArray[tempRow+1][col]) {
          gameOver = false;
          break;
        }
      }
      row += 1;
    }
    if (!gameOver) {
      while(col < length-1) {
        for(let tempCol = col; tempCol < length-1; tempCol += 1){
          if(numArray[row][tempCol] === numArray[row][tempCol+1]) {
            gameOver = false;
            break;
          }
        }
        col += 1;
      }
    }
    this.setState({ gameOver });
  }
  
  render(){
    const { numArray, score, gameOver } = this.state;
    const flattenedArray = numArray.flat(1);
    return (
      <>
        <div className="heading">2048</div>
        <div className="optionsContainer">
          <div className="scoreContainer">
            <span className="scoreText">Score</span>
            <div className="score">{score}</div>
          </div>
          <div>
            <button onClick={this.restartGame} className="restartButton"> New Game </button>
          </div>
        </div>
        <ReactTouchEvents
          onSwipe={this.handleSwipe}
        >
          <div className="gameContainer">
            <ul className="matrix">
              {
                flattenedArray.map((value,index) => {
                  return <li className="numberContainer" key={index} style={{ backgroundColor: colors[value] }}>{value || ''}</li>
                })
              }
              {gameOver && (<div className="gameOver">
                  <div className="padding-8">Game Over</div>
                  <button onClick={this.restartGame} className="restartButton"> New Game </button>
                </div>)}
            </ul>
          </div>
        </ReactTouchEvents>
      </>
    )
  }
}

export default GameContainer;