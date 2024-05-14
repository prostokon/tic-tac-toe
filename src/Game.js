import React, { useState, useEffect, useRef } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Board from './Board';

const Game = () => {
  const [history, setHistory] = useState([{ squares: Array(9).fill(null) }]);
  const [stepNumber, setStepNumber] = useState(0);
  const [xIsNext, setXIsNext] = useState(true);
  const [score, setScore] = useState({ X: 0, O: 0 });
  const [timer, setTimer] = useState({ X: 120, O: 120 });
  const [gameOver, setGameOver] = useState(false);
  const intervalRef = useRef(null);
  const [showReset, setShowReset] = useState(false);
  const [showResetScore, setShowResetScore] = useState(false);

  useEffect(() => {
    startTimer();
    return () => clearInterval(intervalRef.current);
  }, [xIsNext]);

  const startTimer = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setTimer((prevTimer) => {
        const currentPlayer = xIsNext ? 'X' : 'O';
        const newTime = prevTimer[currentPlayer] - 1;

        if (newTime <= 0) {
          clearInterval(intervalRef.current);
          const winner = xIsNext ? 'O' : 'X';
          setScore((prevScore) => ({
            ...prevScore,
            [winner]: prevScore[winner] + 1,
          }));
          setGameOver(true);
          setShowResetScore(true);
          return {
            X: 120,
            O: 120,
          };
        }

        return {
          ...prevTimer,
          [currentPlayer]: newTime,
        };
      });
    }, 1000);
  };

  const handleClick = (i) => {
    if (gameOver) {
      return;
    }
    const newHistory = history.slice(0, stepNumber + 1);
    const current = newHistory[newHistory.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = xIsNext ? 'X' : 'O';
    setHistory(newHistory.concat([{ squares }]));
    setStepNumber(newHistory.length);
    setXIsNext(!xIsNext);
  };

  const resetGame = () => {
    setHistory([{ squares: Array(9).fill(null) }]);
    setStepNumber(0);
    setXIsNext(true);
    setTimer({ X: 120, O: 120 });
    clearInterval(intervalRef.current);
    startTimer();
    setShowReset(true);
    setShowResetScore(true);
    setGameOver(false);
  };

  const resetScore = () => {
    setScore({ X: 0, O: 0 });
    setShowResetScore(false);
    resetGame();
  };
  const hideButtons = () => {
    setShowReset(false);
    setShowResetScore(false);
  };
  const current = history[stepNumber];
  const winner = calculateWinner(current.squares);

  useEffect(() => {
    if (winner) {
      clearInterval(intervalRef.current);
      setScore((prevScore) => ({
        ...prevScore,
        [winner]: prevScore[winner] + 1,
      }));
      setShowResetScore(true);
    } else if (current.squares.every((square) => square !== null)) {
      setShowResetScore(true);
    }
  }, [winner, current.squares]);

  let status;
  if (gameOver) {
    if (winner) {
      status = `Победитель: ${winner}`;
    } else if (current.squares.every((square) => square !== null)) {
      status = 'Ничья!';
    } else {
      status = `Время вышло! Победитель: ${xIsNext ? 'O' : 'X'}`;
    }
  } else {
    status = `Следующий ход: ${xIsNext ? 'X' : 'O'}`;
  }
  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        mt: 5,
        p: 3,
        borderRadius: 2,
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        backgroundColor: '#ffffff',
        border: '1px solid #e0e0e0',
      }}
    >
      <Typography variant="h4" gutterBottom sx={{ color: '#3f51b5', mb: 2 }}>
        Крестики-Нолики
      </Typography>
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          mb: 2,
          p: 2,
          border: '2px solid',
          borderRadius: 2,
          backgroundColor: xIsNext ? '#3f51b5' : '#f50057',
          color: '#ffffff',
          width: 'fit-content',
        }}
      >
        {status}
      </Typography>
      <Board squares={current.squares} onClick={handleClick} />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '100%',
          mt: 2,
        }}
      >
        <Box
          sx={{
            border: '1px solid #3f51b5',
            borderRadius: 2,
            p: 1,
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            maxWidth: '150px',
          }}
        >
          <Typography variant="body1" sx={{ color: '#3f51b5' }}>
            X
          </Typography>
          <Typography variant="body1" sx={{ color: '#3f51b5', mb: 1 }}>
            Счёт: {score.X}
          </Typography>
          <Typography variant="body1" sx={{ color: '#3f51b5' }}>
            Время: {Math.floor(timer.X / 60)}:{(timer.X % 60).toString().padStart(2, '0')}
          </Typography>
        </Box>
        <Box
          sx={{
            border: '1px solid #f50057',
            borderRadius: 2,
            p: 1,
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            maxWidth: '150px',
          }}
        >
          <Typography variant="body1" sx={{ color: '#f50057' }}>
            O
          </Typography>
          <Typography variant="body1" sx={{ color: '#f50057', mb: 1 }}>
            Счёт: {score.O}
          </Typography>
          <Typography variant="body1" sx={{ color: '#f50057' }}>
            Время: {Math.floor(timer.O / 60)}:{(timer.O % 60).toString().padStart(2, '0')}
          </Typography>
        </Box>
      </Box>
      {showResetScore && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button
            variant="contained"
            onClick={()=>{resetGame(); hideButtons();}} 
            sx={{
              bgcolor: '#ffffff',
              color: '#3f51b5',
              boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
              '&:hover': {
                bgcolor: '#f0f0f0',
              },
              borderRadius: '16px',
              padding: '10px 24px',
              border: '1px solid #e0e0e0',
              mr: 2,
            }}
          >
            Повторить игру
          </Button>
          <Button
            variant="contained"
            onClick={()=>{resetScore(); hideButtons();}}
            sx={{
              bgcolor: '#ffffff',
              color: '#f50057',
              boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
              '&:hover': {
                bgcolor: '#f0f0f0',
              },
              borderRadius: '16px',
              padding: '10px 24px',
              border: '1px solid #e0e0e0',
            }}
          >
            Обнулить счёт
          </Button>
        </Box>
      )}
    </Container>
  );
};

const calculateWinner = (squares) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
};

export default Game;