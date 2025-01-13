import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import DayAvailability from './DayAvailability';
import axiosInstance from '../../utils/axiosInstance';

const ManageAvailability = () => {
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Fetch availability data on page load
  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const response = await axiosInstance.get('/appointments/availability/');
        setAvailability(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load availability. Please try again.');
        setLoading(false);
      }
    };

    fetchAvailability();
  }, []);

  // Handle Save Changes
  const handleSaveChanges = async () => {
    try {
      await axiosInstance.post('/appointments/availability/', availability);
      setSuccess(true);

      // Reload the page after successful save
      setTimeout(() => {
        window.location.reload();
      }, 1000); // Add a small delay to show the success message
    } catch (err) {
      setError('Failed to save changes. Please try again.');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom>
        Manage Weekly Availability
      </Typography>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {/* Render DayAvailability components for each day */}
      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(
        (day) => (
          <DayAvailability
            key={day.toLowerCase()}
            day={day}
            availability={availability}
            setAvailability={setAvailability}
          />
        )
      )}

      {/* Save Changes Button */}
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSaveChanges}
        >
          Save Changes
        </Button>
      </Box>

      {/* Snackbar Notifications */}
      <Snackbar
        open={success}
        autoHideDuration={1000} // Short duration before page reload
        onClose={() => setSuccess(false)}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Availability saved successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ManageAvailability;
