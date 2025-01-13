import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Card,
  CardContent,
  Avatar,
  Button,
  Grid,
  Snackbar,
  Alert,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

const BusinessDashboard = () => {
    const [sentQuotes, setSentQuotes] = useState([]);
    const [savedSearches, setSavedSearches] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [enrichedAppointments, setEnrichedAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // Fetch data for sent quotes, saved searches, and appointments
    useEffect(() => {
      const fetchDashboardData = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await axiosInstance.get("http://localhost:8000/api/dashboard/", {
            headers: { Authorization: `Bearer ${token}` },
          });

          setSentQuotes(response.data.sent_quotes);
          setSavedSearches(response.data.saved_searches);

          // Fetch appointments data
          const appointmentsRes = await axiosInstance.get("/appointments/appointments/", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setAppointments(appointmentsRes.data);
        } catch (err) {
          setError("Failed to load dashboard data.");
        } finally {
          setLoading(false);
        }
      };

      fetchDashboardData();
    }, []);

    // Fetch expert details for each appointment
    const fetchExpertDetails = async (expertId) => {
      try {
        if (!expertId) return null;
        const response = await axiosInstance.get(`/users/experts/${expertId}`);
        return response.data;
      } catch (err) {
        console.error("Error fetching expert details:", err);
        return null;
      }
    };

    // Enrich appointments with expert details
    useEffect(() => {
      const enrichAppointmentsWithExpertDetails = async () => {
        try {
          const detailedAppointments = await Promise.all(
            appointments.map(async (appointment) => {
              if (!appointment.expert) {
                console.warn("Invalid expert ID for appointment:", appointment);
                return appointment;
              }
              const expert = await fetchExpertDetails(appointment.expert);
              return expert ? { ...appointment, expert } : appointment;
            })
          );

          setEnrichedAppointments(detailedAppointments.filter(Boolean));
        } catch (err) {
          console.error("Error enriching appointments:", err);
        }
      };

      if (appointments.length > 0) {
        enrichAppointmentsWithExpertDetails();
      }
    }, [appointments]);

    // Handle navigation to search results page
    const handleViewSearch = (filters) => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.set(key, value);
      });
      navigate(`/search-results?${params.toString()}`, { state: { filters } });
    };

    // Handle click on an expert to navigate to the expert details page
    const handleExpertClick = (expertId) => {
      navigate(`/expert-details/${expertId}`);
    };

    // Handle delete saved search
    const handleDeleteSearch = async (id) => {
      try {
        await axiosInstance.delete(`/search/saved-searches/${id}/`);
        setSavedSearches(savedSearches.filter((search) => search.id !== id));
      } catch (err) {
        setError("Failed to delete saved search.");
      }
    };

    if (loading) {
      return <Typography variant="h6">Loading dashboard...</Typography>;
    }


  return (
    <Box sx={{ p: 3, backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
      <Typography variant="h4" gutterBottom>
        Business Dashboard
      </Typography>
      {error && (
        <Snackbar open={!!error} autoHideDuration={4000} onClose={() => setError("")}>
          <Alert severity="error">{error}</Alert>
        </Snackbar>
      )}

      {/* Appointments Section */}
      <Box sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h5" gutterBottom>
            Booked Appointments
          </Typography>
          {enrichedAppointments.length === 0 ? (
            <Typography variant="body1" color="textSecondary">
              No appointments booked yet.
            </Typography>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                <TableCell>Photo</TableCell>
                  <TableCell>Expert</TableCell>
                  
                  <TableCell>Date</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {enrichedAppointments.map((appointment) => (
                  <TableRow
                    key={appointment.id}
                    onClick={() => handleExpertClick(appointment.expert?.user.id)}
                    sx={{
                      cursor: "pointer",
                      "&:hover": {
                        backgroundColor: "#f1f1f1",
                      },
                    }}
                  >
                    <TableCell>
                      <Avatar
                        src={appointment.expert?.user?.profile.profile_photo}
                        alt={`${appointment.expert?.user.first_name} ${appointment.expert?.user.last_name}`}
                        sx={{ width: 30, height: 30 }}
                      />
                    </TableCell>
                    <TableCell>
                      {appointment.expert?.user.first_name}{" "}
                      {appointment.expert?.user.last_name}
                    </TableCell>
                    
                    <TableCell>
                      {new Date(appointment.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{appointment.time}</TableCell>
                    <TableCell
                      sx={{
                        color:
                          appointment.status === "confirmed"
                            ? "green"
                            : "gray",
                      }}
                    >
                      {appointment.status.charAt(0).toUpperCase() +
                        appointment.status.slice(1)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Paper>
      </Box>

      {/* Sent Quotes Section */}
      <Box sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h5" gutterBottom>
            Sent Quotes
          </Typography>
          {sentQuotes.length === 0 ? (
            <Typography variant="body1" color="textSecondary">
              No quotes sent yet.
            </Typography>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Expert</TableCell>
                  <TableCell>Message</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sentQuotes.map((quote) => (
                  <TableRow
                    key={quote.id}
                    onClick={() => handleExpertClick(quote.expert_id)}
                    sx={{
                      cursor: "pointer",
                      "&:hover": {
                        backgroundColor: "#f1f1f1",
                      },
                    }}
                  >
                    <TableCell>{quote.expert_name}</TableCell>
                    <TableCell>{quote.message}</TableCell>
                    <TableCell
                      sx={{
                        color:
                          quote.status === "accepted"
                            ? "green"
                            : quote.status === "declined"
                            ? "red"
                            : "gray",
                      }}
                    >
                      {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                    </TableCell>
                    <TableCell>{new Date(quote.created_at).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Paper>
      </Box>

      {/* Saved Searches Section */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Saved Searches
        </Typography>
        {savedSearches.length === 0 ? (
          <Typography variant="body1" color="textSecondary">
            No saved searches yet.
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {savedSearches.map((search) => (
              <Grid item xs={12} md={6} key={search.id}>
                <Card
                  sx={{
                    "&:hover": { boxShadow: 6 },
                  }}
                >
                  <CardContent>
                    <Typography variant="h6">{search.name}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      Location: {search.filters.location || "Not specified"}
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={() => handleViewSearch(search.filters)}
                      sx={{ mt: 2 }}
                    >
                      View Search
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleDeleteSearch(search.id)}
                      sx={{ ml: 2 }}
                    >
                      Delete
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default BusinessDashboard;
