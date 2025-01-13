import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  Button,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert,
  Chip,
  Stack,
  TextField,
  CircularProgress,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import WorkIcon from "@mui/icons-material/Work";
import axiosInstance from "../utils/axiosInstance";
import { useParams } from "react-router-dom";

const ExpertDetails = () => {
  const { expertId } = useParams();

  const [expert, setExpert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isQuoteDialogOpen, setIsQuoteDialogOpen] = useState(false);
  const [quoteMessage, setQuoteMessage] = useState("");
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [reviewData, setReviewData] = useState({ rating: "", comment: "" });
  const [success, setSuccess] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const [isSummaryDialogOpen, setIsSummaryDialogOpen] = useState(false);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [reviewSummary, setReviewSummary] = useState("");

  useEffect(() => {
    const fetchExpertDetails = async () => {
      try {
        const response = await axiosInstance.get(`/users/experts/${expertId}`);
        setExpert(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load expert details.");
        setLoading(false);
      }
    };

    fetchExpertDetails();
  }, [expertId]);

  const handleSendQuote = async () => {
    try {
      await axiosInstance.post("/quotes/quotes/", {
        expert: expertId,
        message: quoteMessage,
      });
      setSuccess(true);
      setIsQuoteDialogOpen(false);
      setQuoteMessage("");
    } catch (err) {
      setError("Failed to send the quote. Please try again.");
    }
  };

  const handleSubmitReview = async () => {
    try {
      await axiosInstance.post("/reviews/reviews/", {
        expert: expertId,
        rating: reviewData.rating,
        comment: reviewData.comment,
      });
      const response = await axiosInstance.get(`/users/experts/${expertId}`);
      setExpert(response.data);
      setIsReviewDialogOpen(false);
      setReviewData({ rating: "", comment: "" });
      setReviewSuccess(true);
    } catch (err) {
      setError("Failed to submit review. Please try again.");
    }
  };

  const fetchReviewSummary = async () => {
    setIsSummaryLoading(true);
    setReviewSummary("");
    try {
      const response = await axiosInstance.get(`/reviews/reviews/summary/${expertId}`);
      setReviewSummary(response.data.summary);
    } catch (err) {
      setError("Failed to fetch AI summary.");
    } finally {
      setIsSummaryLoading(false);
    }
  };

  if (loading) {
    return <Typography variant="h6">Loading expert details...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  const { user, profile, reviews } = expert;

  return (
    <Box sx={{ p: 3, backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
      {/* Back Button */}
      {/* <Button
        variant="outlined"
        onClick={() => navigate("/search")}
        sx={{ mb: 3 }}
      >
        Back to Search
      </Button> */}

      {/* Expert Details */}
      <Box
        sx={{
          maxWidth: 700,
          mx: "auto",
          p: 3,
          backgroundColor: "#fff",
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Avatar
            src={user.profile.profile_photo}
            alt={`${user.first_name} ${user.last_name}`}
            sx={{ width: 120, height: 120, mx: "auto" }}
          />
        </Box>
        <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom>
          {user.first_name} {user.last_name}
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          textAlign="center"
          gutterBottom
        >
          {profile.specialization || "Specialization not listed"}
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          textAlign="center"
          gutterBottom
        >
          {profile.description}
        </Typography>
        <Stack spacing={2} sx={{ mt: 3 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <LocationOnIcon color="primary" />
            <Typography variant="body2" color="textSecondary">
              {profile.location || "Location not specified"}
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1}>
            <MonetizationOnIcon color="primary" />
            <Typography variant="body2" color="textSecondary">
              ${profile.hourly_rate}/hr
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1}>
            <WorkIcon color="primary" />
            <Typography variant="body2" color="textSecondary">
              {profile.experience} years of experience
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1}>
            <StarIcon color="warning" />
            <Typography variant="body2" color="textSecondary">
              {profile.rating} / 5 ({profile.reviews_count} reviews)
            </Typography>
          </Stack>
        </Stack>

        {/* Skills */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Skills:
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {profile.skills.split(",").map((skill, index) => (
              <Chip key={index} label={skill.trim()} variant="outlined" />
            ))}
          </Box>
        </Box>

        {/* Reviews Section */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Reviews
          </Typography>
          {reviews.length === 0 ? (
            <Typography variant="body2" color="textSecondary">
              No reviews yet.
            </Typography>
          ) : (
            <Grid container spacing={2}>
              {reviews.map((review) => (
                <Grid item xs={12} key={review.id}>
                  <Card>
                    <CardContent>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <StarIcon color="warning" fontSize="small" />
                        <Typography variant="body2">
                          {review.rating} / 5
                        </Typography>
                      </Stack>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {review.comment}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="textSecondary"
                        sx={{ display: "block", mt: 1 }}
                      >
                        {new Date(review.created_at).toLocaleDateString()}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {/* Generate AI Summary Button */}
          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setIsSummaryDialogOpen(true);
                fetchReviewSummary();
              }}
            >
              Generate AI Summary
            </Button>
          </Box>
        </Box>
      {/* </Box> */}

      {/* Summary Dialog */}
      <Dialog
        open={isSummaryDialogOpen}
        onClose={() => setIsSummaryDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>AI-Generated Summary</DialogTitle>
        <DialogContent>
          {isSummaryLoading ? (
            <Box sx={{ textAlign: "center", my: 3 }}>
              <CircularProgress />
              <Typography sx={{ mt: 2 }}>Generating summary...</Typography>
            </Box>
          ) : reviewSummary ? (
            <Typography variant="body2" sx={{ mt: 2 }}>
              {reviewSummary}
            </Typography>
          ) : (
            <Typography color="error">Failed to generate summary.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsSummaryDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

        {/* Actions */}
        <Box sx={{ mt: 4, display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            onClick={() => setIsQuoteDialogOpen(true)}
            sx={{ backgroundColor: "#1976d2" }}
          >
            Request a Quote
          </Button>
          <Button
            variant="outlined"
            onClick={() => setIsReviewDialogOpen(true)}
          >
            Add Review
          </Button>
        </Box>
      </Box>

      {/* Quote Dialog */}
      <Dialog open={isQuoteDialogOpen} onClose={() => setIsQuoteDialogOpen(false)}>
        <DialogTitle>Request a Quote</DialogTitle>
        <DialogContent>
          <DialogContentText>Enter your message for the expert:</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Message"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={quoteMessage}
            onChange={(e) => setQuoteMessage(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsQuoteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSendQuote} variant="contained">
            Send Quote
          </Button>
        </DialogActions>
      </Dialog>

      {/* Review Dialog */}
      <Dialog open={isReviewDialogOpen} onClose={() => setIsReviewDialogOpen(false)}>
        <DialogTitle>Add a Review</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please provide your feedback and rating for the expert.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Rating (1-5)"
            type="number"
            fullWidth
            value={reviewData.rating}
            onChange={(e) =>
              setReviewData({ ...reviewData, rating: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Comment"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={reviewData.comment}
            onChange={(e) =>
              setReviewData({ ...reviewData, comment: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsReviewDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmitReview} variant="contained">
            Submit Review
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Notifications */}
      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}
      >
        <Alert severity="success">Quote sent successfully!</Alert>
      </Snackbar>
      <Snackbar
        open={reviewSuccess}
        autoHideDuration={3000}
        onClose={() => setReviewSuccess(false)}
      >
        <Alert severity="success">Review submitted successfully!</Alert>
      </Snackbar>
    </Box>
  );
};

export default ExpertDetails;
