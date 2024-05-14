import React from 'react';
import Square from './Square';
import { motion } from 'framer-motion';

const Board = ({ squares, onClick }) => (
  <motion.div
    style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1 }}
  >
    {squares.map((square, i) => (
      <Square key={i} value={square} onClick={() => onClick(i)} />
    ))}
  </motion.div>
);

export default Board;