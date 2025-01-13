import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Slider,
  CircularProgress,
  TextField,
} from '@mui/material';
import axiosInstance from '../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import Autocomplete from 'react-google-autocomplete';
import './SearchLandingPage.css'; // Import custom CSS

const SearchLandingPage = () => {
  const [skills, setSkills] = useState('');
  const [location, setLocation] = useState('');
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [radius, setRadius] = useState(10);
  const [topExperts, setTopExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopExperts = async () => {
      try {
        const response = await axiosInstance.get('/search/experts');
        setTopExperts(response.data.slice(0, 3));
        setLoading(false);
      } catch (err) {
        console.error('Error fetching top experts:', err);
        setLoading(false);
      }
    };

    fetchTopExperts();
  }, []);

  const handleSearch = () => {
    if (!latitude || !longitude) {
      alert('Please select a valid location from the dropdown.');
      return;
    }

    navigate(
      `/search-results?search=${skills}&latitude=${latitude}&longitude=${longitude}&radius=${radius}&location=${location}`
    );
  };

  return (
    <Box
      sx={{
        background: 'linear-gradient(180deg, #f8f9fa, #e9ecef)',
        minHeight: '100vh',
        py: 5,
        px: 2,
      }}
    >
      {/* Search Section */}
      <Box
        sx={{
          width: '100%',
          maxWidth: '1200px',
          mx: 'auto',
          mb: 5,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        {/* Left Side - Search Inputs */}
        <Box
          sx={{
            flex: 1,
            pr: 4,
            textAlign: { xs: 'center', md: 'left' },
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <Typography variant="h2" fontWeight="bold" gutterBottom>
            Find Financial Experts Near You
          </Typography>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            Connect with top-rated accountants, advisors, and financial planners.
          </Typography>
          <TextField
            label="Specialization / Skills"
            fullWidth
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            variant="outlined"
          />
          <Autocomplete
            apiKey="YOUR_GOOGLE_PLACES_API_KEY"
            onPlaceSelected={(place) => {
                setLocation(place.formatted_address);
                setLatitude(place.geometry.location.lat());
                setLongitude(place.geometry.location.lng());
            }}
            types={['(regions)']}
            className="autocomplete-input"
            placeholder="Enter Location"
            />

          <Box>
            <Typography>Search Radius: {radius} miles</Typography>
            <Slider
              value={radius}
              onChange={(e, newValue) => setRadius(newValue)}
              min={1}
              max={500}
              valueLabelDisplay="auto"
            />
          </Box>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSearch}
            fullWidth
            sx={{ py: 1.5 }}
          >
            Search Experts
          </Button>
        </Box>

        {/* Right Side - Illustration */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            mt: { xs: 4, md: 0 },
          }}
        >
          <img
            src={require('../assets/financial-illustration.png')}
            alt="Financial Experts Illustration"
            style={{
              maxWidth: '100%',
              width: '350px',
              objectFit: 'contain',
            }}
          />
        </Box>
      </Box>

      {/* Top Experts Section */}
      <Box sx={{ width: '100%', maxWidth: '1200px', mx: 'auto' }}>
        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{ mb: 3, textAlign: 'center' }}
        >
          Top-rated Financial Experts
        </Typography>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={4}>
            {topExperts.map((expert) => (
              <Grid item xs={12} sm={6} md={4} key={expert.user.id}>
                <Box
                  sx={{
                    backgroundColor: '#fff',
                    borderRadius: 4,
                    boxShadow: 3,
                    p: 3,
                    textAlign: 'center',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    },
                    cursor: 'pointer',
                  }}
                    onClick={() => navigate(`/expert-details/${expert.user.id}`)}
                >
                  <img
                    src={expert.profile_photo || 'https://via.placeholder.com/150'}
                    alt={`${expert.user.first_name} ${expert.user.last_name}`}
                    style={{
                      width: '100px',
                      height: '100px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      marginBottom: '10px',
                    }}
                  />
                  <Typography fontWeight="bold">
                    {expert.user.first_name} {expert.user.last_name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    {expert.specialization || 'No specialization listed'}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Location: {expert.location}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2, py: 1 }}
                    onClick={() => navigate(`/expert-details/${expert.user.id}`)}
                  >
                    Book Now
                  </Button>
                </Box>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default SearchLandingPage;
