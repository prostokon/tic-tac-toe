import React from 'react';
import Button from '@mui/material/Button';
import { motion } from 'framer-motion';

const Square = ({ value, onClick }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <Button
        variant="contained"
        onClick={onClick}
        sx={{
          width: 100,
          height: 100, 
          fontSize: 36, 
          minWidth: 'auto',
          padding: 0,
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: value ? (value === 'X' ? '#3f51b5' : '#f50057') : '#f5f5f5',
          color: value ? '#fff' : '#000',
          '&:hover': {
            backgroundColor: value ? (value === 'X' ? '#303f9f' : '#c51162') : '#e0e0e0',
          },
        }}
      >
        {value}
      </Button>
    </motion.div>
  );
};
export default Square;