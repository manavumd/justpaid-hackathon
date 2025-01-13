import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
  Avatar,
} from '@mui/material';
import axiosInstance from '../utils/axiosInstance';
import { Autocomplete } from '@react-google-maps/api';

const ExpertProfile = () => {
  const [profile, setProfile] = useState({
    skills: '',
    hourly_rate: '',
    experience: '',
    location: '',
    latitude: '',
    longitude: '',
    description: '',
    specialization: '',
    profile_photo: '',
  });
  const [profilePhotoPreview, setProfilePhotoPreview] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [autocomplete, setAutocomplete] = useState(null);

  // Fetch profile details on page load
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get('/users/profile/');
        setProfile({
          skills: response.data.skills || '',
          hourly_rate: response.data.hourly_rate || '',
          experience: response.data.experience || '',
          location: response.data.location || '',
          latitude: response.data.latitude || '',
          longitude: response.data.longitude || '',
          description: response.data.description || '',
          specialization: response.data.specialization || '',
          profile_photo: response.data.profile_photo || '',
        });
        setProfilePhotoPreview(response.data.profile_photo);
        setLoading(false);
      } catch (err) {
        setError('Failed to load profile. Please try again later.');
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Handle input changes for text fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  // Handle profile photo upload
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhotoPreview(URL.createObjectURL(file)); // Show preview
      setProfile({ ...profile, profile_photo: file });
    }
  };

  // Handle Autocomplete
  const handlePlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      const location = place.formatted_address;
      const latitude = place.geometry.location.lat();
      const longitude = place.geometry.location.lng();

      setProfile((prev) => ({
        ...prev,
        location,
        latitude,
        longitude,
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('skills', profile.skills);
      formData.append('hourly_rate', profile.hourly_rate);
      formData.append('experience', profile.experience);
      formData.append('location', profile.location);
      formData.append('latitude', profile.latitude);
      formData.append('longitude', profile.longitude);
      formData.append('description', profile.description);
      formData.append('specialization', profile.specialization);
      if (profile.profile_photo instanceof File) {
        formData.append('profile_photo', profile.profile_photo);
      }

      await axiosInstance.put('/users/profile/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess(true);
    } catch (err) {
      setError('Failed to update profile. Please try again.');
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
        Manage Profile
      </Typography>
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {/* Profile Form */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          backgroundColor: '#fff',
          p: 3,
          borderRadius: 2,
          boxShadow: 2,
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Avatar
            src={profilePhotoPreview}
            alt="Profile Photo"
            sx={{ width: 120, height: 120, mb: 2 }}
          />
          <Button variant="outlined" component="label">
            Upload Profile Photo
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handlePhotoChange}
            />
          </Button>
        </Box>

        <TextField
          label="Skills"
          name="skills"
          variant="outlined"
          value={profile.skills}
          onChange={handleInputChange}
          placeholder="Enter your skills (e.g., Accounting, Tax Preparation)"
        />
        <TextField
          label="Hourly Rate"
          name="hourly_rate"
          type="number"
          variant="outlined"
          value={profile.hourly_rate}
          onChange={handleInputChange}
          placeholder="Enter your hourly rate"
        />
        <TextField
          label="Experience (Years)"
          name="experience"
          type="number"
          variant="outlined"
          value={profile.experience}
          onChange={handleInputChange}
          placeholder="Enter your years of experience"
        />
        <TextField
          label="Specialization"
          name="specialization"
          variant="outlined"
          value={profile.specialization}
          onChange={handleInputChange}
          placeholder="Enter your area of specialization"
        />
        <TextField
          label="Description"
          name="description"
          variant="outlined"
          multiline
          rows={4}
          value={profile.description}
          onChange={handleInputChange}
          placeholder="Enter a brief description about your services"
        />
        <Autocomplete
          onLoad={(auto) => setAutocomplete(auto)}
          onPlaceChanged={handlePlaceChanged}
        >
          <TextField
            label="Location"
            name="location"
            variant="outlined"
            value={profile.location}
            onChange={handleInputChange}
            placeholder="Enter your location"
          />
        </Autocomplete>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          sx={{ alignSelf: 'flex-start' }}
        >
          Save Changes
        </Button>
      </Box>

      {/* Snackbar Notifications */}
      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Profile updated successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ExpertProfile;
