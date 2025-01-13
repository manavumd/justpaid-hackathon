import React from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  TextField,
  IconButton,
  Divider,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const DayAvailability = ({ day, availability, setAvailability }) => {
  const [startTime, setStartTime] = React.useState('');
  const [endTime, setEndTime] = React.useState('');

  // Utility function to format time to HH:mm
  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes}`;
  };

  const handleAddSlot = () => {
    if (!startTime || !endTime) {
      alert('Please provide both start and end times.');
      return;
    }

    const newSlot = {
      day_of_week: day.toLowerCase(),
      start_time: formatTime(startTime),
      end_time: formatTime(endTime),
    };

    setAvailability((prev) => [...prev, newSlot]);
    setStartTime('');
    setEndTime('');
  };

  const handleRemoveSlot = (index) => {
    setAvailability((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Box
      sx={{
        backgroundColor: '#f5f5f5',
        p: 3,
        borderRadius: 2,
        boxShadow: 2,
        mb: 3,
        maxWidth: '800px',
        mx: 'auto', // Center align
      }}
    >
      {/* Day Title */}
      <Typography
        variant="h6"
        sx={{
          fontWeight: 'bold',
          mb: 2,
          color: '#333',
        }}
      >
        {day}
      </Typography>

      {/* Time Input Fields and Add Button */}
      <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Grid item xs={4}>
          <TextField
            label="Start Time"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            fullWidth
            InputProps={{
              startAdornment: <AccessTimeIcon sx={{ mr: 1, color: '#555' }} />,
            }}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            label="End Time"
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            fullWidth
            InputProps={{
              startAdornment: <AccessTimeIcon sx={{ mr: 1, color: '#555' }} />,
            }}
          />
        </Grid>
        <Grid item xs={4}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddSlot}
            fullWidth
          >
            Add
          </Button>
        </Grid>
      </Grid>

      {/* Display Slots */}
      {availability
        .filter((slot) => slot.day_of_week === day.toLowerCase())
        .map((slot, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              p: 2,
              mb: 1,
              border: '1px solid #ddd',
              borderRadius: 2,
              backgroundColor: '#fff',
            }}
          >
            <Typography>
              {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
            </Typography>
            <IconButton onClick={() => handleRemoveSlot(index)}>
              <DeleteIcon color="error" />
            </IconButton>
          </Box>
        ))}

      {/* Divider */}
      <Divider sx={{ mt: 2 }} />
    </Box>
  );
};

export default DayAvailability;
