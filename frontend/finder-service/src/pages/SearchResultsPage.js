import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  MenuItem,
  Drawer,
  IconButton,
  Slider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import axiosInstance from "../utils/axiosInstance";
import { useLocation, useNavigate } from "react-router-dom";
import MapsComponent from "../components/MapsComponent";
import BookingComponent from "../components/BookingComponent";
import Autocomplete from "react-google-autocomplete";
import CloseIcon from "@mui/icons-material/Close";
import ExpertCard from "../components/ExpertCard";


const SearchResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    search: "",
    location: "",
    latitude: null,
    longitude: null,
    hourly_rate_gte: "",
    hourly_rate_lte: "",
    rating_gte: "",
    experience_gte: "",
    radius: 10,
  });

  const [filtersInitialized, setFiltersInitialized] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedExpert, setSelectedExpert] = useState(null); // For booking
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false); // For save search
  const [searchName, setSearchName] = useState(""); // Name of the saved search

  // Load query params on mount
//   useEffect(() => {
//     const params = new URLSearchParams(location.search);
//     setFilters((prevFilters) => ({
//       ...prevFilters,
//       search: params.get("search") || "",
//       location: params.get("location") || "",
//       latitude: params.get("latitude") || null,
//       longitude: params.get("longitude") || null,
//       radius: params.get("radius") || 10,
//     }));
//     setFiltersInitialized(true);
//   }, [location.search]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const updatedFilters = {
        search: params.get("search") || "",
        location: params.get("location") || "",
        latitude: params.get("latitude") || null,
        longitude: params.get("longitude") || null,
        hourly_rate_gte: params.get("hourly_rate_gte") || "",
        hourly_rate_lte: params.get("hourly_rate_lte") || "",
        rating_gte: params.get("rating_gte") || "",
        experience_gte: params.get("experience_gte") || "",
        radius: params.get("radius") || 10,
        };
    
        setFilters(updatedFilters);
        setFiltersInitialized(true);
    }, [location.search]); // React whenever the query string changes

  // Fetch search results
  useEffect(() => {
    if (!filtersInitialized) return;
    const fetchSearchResults = async () => {
        console.log("Fetching search results...");
        console.log("Filters:", filters);
      try {
        const response = await axiosInstance.get("/search/experts", {
          params: {
            search: filters.search,
            latitude: filters.latitude,
            longitude: filters.longitude,
            hourly_rate__gte: filters.hourly_rate_gte,
            hourly_rate__lte: filters.hourly_rate_lte,
            rating__gte: filters.rating_gte,
            experience__gte: filters.experience_gte,
            radius: filters.radius,
          },
        });
        setSearchResults(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching search results:", err);
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [filters, filtersInitialized]);

  // Update query params
  const updateQueryParams = (field, value) => {
    const params = new URLSearchParams(location.search);
    if (value) {
      params.set(field, value);
    } else {
      params.delete(field);
    }
    navigate({ search: params.toString() }, { replace: true });
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    updateQueryParams(field, value);
  };

  const handleLocactionChange = (location1, latitude, longitude) => {
    setFilters((prev) => ({ ...prev, [location]: location1, [latitude]: latitude, [longitude]: longitude }));
    const params = new URLSearchParams(location.search);
    params.set("location", location1);
    params.set("latitude", latitude);
    params.set("longitude", longitude);
    navigate({ search: params.toString() }, { replace: true });
  }

  const handleOpenBooking = (expert) => {
    setSelectedExpert(expert);
  };

  const handleCloseBooking = () => {
    setSelectedExpert(null);
  };

  const toggleDrawer = (open) => () => {
    setIsDrawerOpen(open);
  };

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSearchName("");
  };

  const handleSaveSearch = async () => {
    try {
      await axiosInstance.post("/search/saved-searches/", {
        name: searchName,
        filters: {
          ...filters,
        },
      });
      alert("Search saved successfully!");
      handleCloseDialog();
    } catch (err) {
      console.error("Error saving search:", err);
      alert("Failed to save search. Please try again.");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        minHeight: "100vh",
        backgroundColor: "#f9f9f9",
      }}
    >
      {/* Left Section */}
      <Box sx={{ flex: 2, p: 4, maxHeight: "100vh", overflowY: "auto" }}>
        <Typography variant="h4" gutterBottom>
          Search Results
        </Typography>

        {/* Keyword and Location Filters */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
            mb: 3,
          }}
        >
          <TextField
            label="Keyword Search"
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            fullWidth
          />

            <Autocomplete
                apiKey="YOUR_GOOGLE_PLACES_API_KEY"
                onPlaceSelected={(place) => {
                    const newLocation = place.formatted_address;
                    const newLat = place.geometry.location.lat();
                    const newLng = place.geometry.location.lng();

                    console.log("Selected Location:", newLocation, newLat, newLng);

                    // Update filters state
                    handleLocactionChange(newLocation, newLat, newLng);
                }}
                types={["(regions)"]}
                defaultValue={filters.location}
                placeholder="Enter Location"
                style={{
                    width: "100%",
                    height: "56px",
                    border: "1px solid #ccc",
                    padding: "0",
                    borderRadius: "4px",
                    paddingLeft: "12px",
                    background: "none",
                }}
            />

          <Button
            variant="contained"
            color="primary"
            onClick={toggleDrawer(true)}
          >
            All Filters
          </Button>
          <Button variant="contained" color="secondary" onClick={handleOpenDialog}>
            Save Search
          </Button>
        </Box>

        {/* Results */}
        {loading ? (
          <CircularProgress />
        ) : (
          searchResults.map((expert) => (
            <ExpertCard
              key={expert.user.id}
              expert={expert}
              onBookAppointment={handleOpenBooking}
            />
          ))
        )}
      </Box>

      {/* Right Section - Map */}
      <Box
        sx={{
          flex: 1,
          position: "sticky",
          top: 0,
          height: "100vh",
          backgroundColor: "#fff",
          p: 2,
        }}
      >
        <MapsComponent experts={searchResults} centerLat={filters.latitude} centerLong={filters.longitude} />
      </Box>

      {/* Booking Dialog */}
      {selectedExpert && (
        <BookingComponent
          expert={selectedExpert}
          onClose={handleCloseBooking}
        />
      )}

      {/* Save Search Dialog */}
      <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Save Search</DialogTitle>
        <DialogContent>
          <TextField
            label="Search Name"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSaveSearch} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Drawer for Additional Filters */}
      <Drawer anchor="left" open={isDrawerOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{
            width: 300,
            p: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h6">All Filters</Typography>
            <IconButton onClick={toggleDrawer(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <TextField
            label="Min Hourly Rate ($)"
            type="number"
            value={filters.hourly_rate_gte}
            onChange={(e) => handleFilterChange("hourly_rate_gte", e.target.value)}
            fullWidth
          />

          <TextField
            label="Max Hourly Rate ($)"
            type="number"
            value={filters.hourly_rate_lte}
            onChange={(e) => handleFilterChange("hourly_rate_lte", e.target.value)}
            fullWidth
          />

          <TextField
            label="Min Rating"
            select
            value={filters.rating_gte}
            onChange={(e) => handleFilterChange("rating_gte", e.target.value)}
            fullWidth
          >
            {[1, 2, 3, 4, 5].map((rating) => (
              <MenuItem key={rating} value={rating}>
                {rating} Star{rating > 1 ? "s" : ""}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Min Experience (Years)"
            type="number"
            value={filters.experience_gte}
            onChange={(e) => handleFilterChange("experience_gte", e.target.value)}
            fullWidth
          />

          <Typography>Radius: {filters.radius} miles</Typography>
          <Slider
            value={filters.radius}
            onChange={(e, newValue) =>
              handleFilterChange("radius", newValue)
            }
            min={1}
            max={500}
          />
        </Box>
      </Drawer>
    </Box>
  );
};

export default SearchResultsPage;
