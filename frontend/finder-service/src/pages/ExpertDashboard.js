import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Card,
  CardContent,
  Paper,
} from "@mui/material";
import axiosInstance from "../utils/axiosInstance";

const ExpertDashboard = () => {
  const [receivedQuotes, setReceivedQuotes] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        const dashboardRes = await axiosInstance.get("http://localhost:8000/api/dashboard/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setReceivedQuotes(dashboardRes.data.received_quotes);
        setReviews(dashboardRes.data.reviews);

        // Fetch booked appointments
        const appointmentsRes = await axiosInstance.get("/appointments/appointments/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAppointments(appointmentsRes.data);
      } catch (err) {
        setError("Failed to load dashboard data.");
      }
    };

    fetchDashboardData();
  }, []);

  const handleQuoteAction = async (id, action) => {
    try {
      const token = localStorage.getItem("token");
      await axiosInstance.patch(
        `http://localhost:8000/api/quotes/${id}/`,
        { status: action },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update the status locally
      setReceivedQuotes((prevQuotes) =>
        prevQuotes.map((quote) =>
          quote.id === id ? { ...quote, status: action } : quote
        )
      );
    } catch (err) {
      setError("Failed to update quote status.");
    }
  };

  return (
    <Box sx={{ p: 3, backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
      <Typography variant="h4" gutterBottom>
        Expert Dashboard
      </Typography>
      {error && (
        <Typography color="error" variant="body2" gutterBottom>
          {error}
        </Typography>
      )}

      {/* Booked Appointments Section */}
      <Box sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h5" gutterBottom>
            Booked Appointments
          </Typography>
          {appointments.length === 0 ? (
            <Typography variant="body1" color="textSecondary">
              No appointments booked yet.
            </Typography>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Business</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {appointments.map((appointment) => (
                  <TableRow
                    key={appointment.id}
                    sx={{
                      "&:hover": {
                        backgroundColor: "#f1f1f1",
                      },
                    }}
                  >
                    <TableCell>{appointment.business_name || "Unknown"}</TableCell>
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

      {/* Received Quotes Section */}
      <Box sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h5" gutterBottom>
            Received Quotes
          </Typography>
          {receivedQuotes.length === 0 ? (
            <Typography variant="body1" color="textSecondary">
              No quotes received yet.
            </Typography>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Business</TableCell>
                  <TableCell>Message</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {receivedQuotes.map((quote) => (
                  <TableRow
                    key={quote.id}
                    sx={{
                      "&:hover": {
                        backgroundColor: "#f1f1f1",
                      },
                    }}
                  >
                    <TableCell>{quote.business_name}</TableCell>
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
                    <TableCell>
                      {quote.status === "pending" && (
                        <>
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            sx={{ mr: 1 }}
                            onClick={() => handleQuoteAction(quote.id, "accepted")}
                          >
                            Accept
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            onClick={() => handleQuoteAction(quote.id, "declined")}
                          >
                            Decline
                          </Button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Paper>
      </Box>

      {/* Reviews Section */}
      <Box sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h5" gutterBottom>
            Reviews
          </Typography>
          {reviews.length === 0 ? (
            <Typography variant="body1" color="textSecondary">
              No reviews yet.
            </Typography>
          ) : (
            reviews.map((review) => (
              <Card
                key={review.id}
                sx={{
                  mb: 2,
                  "&:hover": {
                    boxShadow: 6,
                  },
                }}
              >
                <CardContent>
                  <Typography variant="h6">{review.business_name}</Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Rating: {review.rating} / 5
                  </Typography>
                  <Typography variant="body2">{review.comment}</Typography>
                </CardContent>
              </Card>
            ))
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default ExpertDashboard;
