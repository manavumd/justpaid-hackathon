import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import axiosInstance from '../utils/axiosInstance';
import { useNavigate, useLocation } from 'react-router-dom';

const Search = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [filters, setFilters] = useState({
    search: '',
    location: '',
    minHourlyRate: '',
    maxHourlyRate: '',
    minExperience: '',
  });
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchName, setSearchName] = useState('');

  // Initialize search: pre-populate filters or fetch all experts
  useEffect(() => {
    const initializeSearch = async () => {
      if (location.state?.filters) {
        setFilters(location.state.filters);
        await performSearch(location.state.filters); // Apply filters if passed
      } else {
        await fetchExperts(); // Fetch all experts
      }
    };

    initializeSearch();
  }, [location.state]);

  // Fetch all experts
  const fetchExperts = async () => {
    try {
      const response = await axiosInstance.get('/search/experts/');
      setResults(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load experts. Please try again.');
    }
  };

  // Perform search with filters
  const performSearch = async (searchFilters) => {
    try {
      const params = {
        search: searchFilters.search,
        'user__location__icontains': searchFilters.location,
        'hourly_rate__gte': searchFilters.minHourlyRate,
        'hourly_rate__lte': searchFilters.maxHourlyRate,
        'experience__gte': searchFilters.minExperience,
      };

      const response = await axiosInstance.get('/search/experts/', { params });
      setResults(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch search results. Please try again.');
    }
  };

  // Handle input changes for filters
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  // Handle search button click
  const handleSearch = async () => {
    await performSearch(filters);
  };

  // Open save search dialog
  const openSaveDialog = () => {
    setIsDialogOpen(true);
  };

  // Close save search dialog
  const closeSaveDialog = () => {
    setIsDialogOpen(false);
  };

  // Save search to backend
  const handleSaveSearch = async () => {
    try {
      await axiosInstance.post('/search/saved-searches/', {
        name: searchName,
        filters,
      });
      alert('Search saved successfully!');
      closeSaveDialog();
    } catch (err) {
      setError('Failed to save search. Please try again.');
    }
  };

  return (
    <Box sx={{ p: 3, backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      {/* Back to Dashboard Button */}
      <Button
        variant="outlined"
        color="primary"
        onClick={() => navigate('/dashboard/business')}
        sx={{ mb: 2 }}
      >
        Back to Dashboard
      </Button>

      {/* Title */}
      <Typography variant="h4" gutterBottom>
        Search for Experts
      </Typography>

      {/* Search Filters */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          backgroundColor: '#fff',
          p: 3,
          borderRadius: 2,
          boxShadow: 2,
        }}
      >
        <TextField
          label="Keyword Search"
          name="search"
          variant="outlined"
          value={filters.search}
          onChange={handleInputChange}
          placeholder="Enter skills, name, etc."
        />
        <TextField
          label="Location"
          name="location"
          variant="outlined"
          value={filters.location}
          onChange={handleInputChange}
        />
        <TextField
          label="Min Hourly Rate"
          name="minHourlyRate"
          type="number"
          variant="outlined"
          value={filters.minHourlyRate}
          onChange={handleInputChange}
        />
        <TextField
          label="Max Hourly Rate"
          name="maxHourlyRate"
          type="number"
          variant="outlined"
          value={filters.maxHourlyRate}
          onChange={handleInputChange}
        />
        <TextField
          label="Min Experience"
          name="minExperience"
          type="number"
          variant="outlined"
          value={filters.minExperience}
          onChange={handleInputChange}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSearch}
          sx={{ alignSelf: 'center' }}
        >
          Search
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={openSaveDialog}
          sx={{ alignSelf: 'center' }}
        >
          Save Search
        </Button>
      </Box>

      {/* Error Message */}
      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

      {/* Search Results */}
      <Box sx={{ mt: 4 }}>
        {results.length === 0 ? (
          <Typography variant="body1" color="textSecondary">
            No results found.
          </Typography>
        ) : (
            <Grid container spacing={3}>
            {results.map((expert, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{ p: 2, cursor: 'pointer' }}
                  onClick={() => navigate(`/expert-details/${expert.user.id}`)} // Navigate to the expert details page
                >
                  <CardContent>
                    {/* Avatar */}
                    <Avatar sx={{ mb: 2 }}>
                      {expert.user.first_name
                        ? expert.user.first_name[0].toUpperCase()
                        : 'N/A'}
                    </Avatar>
          
                    {/* Name */}
                    <Typography variant="h6">
                      {expert.user.first_name || 'Anonymous'}{' '}
                      {expert.user.last_name || ''}
                    </Typography>
          
                    {/* Location */}
                    <Typography variant="body2" color="textSecondary">
                      Location: {expert.user.location || 'Not specified'}
                    </Typography>
          
                    {/* Skills */}
                    <Typography variant="body2" color="textSecondary">
                      Skills: {expert.skills || 'Not specified'}
                    </Typography>
          
                    {/* Hourly Rate */}
                    <Typography variant="body2" color="textSecondary">
                      Hourly Rate: ${expert.hourly_rate}/hr
                    </Typography>
          
                    {/* Experience */}
                    <Typography variant="body2" color="textSecondary">
                      Experience: {expert.experience} years
                    </Typography>
          
                    {/* Rating */}
                    <Typography variant="body2" color="textSecondary">
                      Rating: {expert.rating} / 5 ({expert.reviews_count} reviews)
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          
        )}
      </Box>

      {/* Save Search Dialog */}
      <Dialog open={isDialogOpen} onClose={closeSaveDialog}>
        <DialogTitle>Save Search</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter a name for your search:
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Search Name"
            type="text"
            fullWidth
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeSaveDialog}>Cancel</Button>
          <Button onClick={handleSaveSearch} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Search;
