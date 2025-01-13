import React, { useEffect, useState } from "react";
import {
  Card,
  Typography,
  Box,
  Avatar,
  Tooltip,
  Chip,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import StarIcon from "@mui/icons-material/Star";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import axiosInstance from "../utils/axiosInstance";
import BookingDialog from "./BookingDialog";
import { useNavigate } from "react-router-dom";

const ExpertCard = ({ expert }) => {
  const [availability, setAvailability] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const navigate = useNavigate();

  const handleTileClick = (date, slots) => {
    setSelectedDate(date);
    setAvailableSlots(slots);
    setDialogOpen(true);
  };

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const today = new Date();
        const dates = Array.from({ length: 14 }, (_, i) => {
          const date = new Date(today); // Start from today
          date.setDate(today.getDate() + i);
          return date.toISOString().split("T")[0];
        });

        const response = await axiosInstance.get(
          `/appointments/availability-custom-dates/${expert.user.id}/`,
          {
            params: { dates },
            paramsSerializer: (params) =>
              params.dates.map((date) => `dates=${encodeURIComponent(date)}`).join("&"),
          }
        );

        setAvailability(response.data);
        console.log("Availability:", response.data);
      } catch (err) {
        console.error("Error fetching availability:", err);
      }
    };

    fetchAvailability();
  }, [expert.user.id]);

  const parseDate = (dateString) => {
    const [year, month, day] = dateString.split("-");
    return new Date(year, month - 1, day); // Month is zero-based in JS Date
  };

  const handleCardClick = () => {
    navigate(`/expert-details/${expert.user.id}`);
  };

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "row",
        p: 2,
        mb: 3,
        borderRadius: 3,
        boxShadow: 2,
        backgroundColor: "#fff",
      }}
      
    >
      {/* Left Section - Profile Photo */}
      <Box
        sx={{
          flex: 0.5,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 1, // Align photo to the top
          cursor: "pointer",
        }}
        onClick={handleCardClick}
      >
        <Avatar
          src={expert.profile_photo}
          alt={`${expert.user.first_name} ${expert.user.last_name}`}
          sx={{ width: 80, height: 80 }}
        />
      </Box>

      {/* Middle Section - Expert Details */}
      <Box sx={{ flex: 1.5, ml: 2, cursor:"pointer" }} onClick={handleCardClick}>
        <Typography variant="h6" fontWeight="bold" color="#333">
          {expert.user.first_name} {expert.user.last_name}
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{ fontStyle: "italic", mb: 1 }}
        >
          {expert.specialization || "Specialization not listed"}
        </Typography>

        {/* Rating and Reviews */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <StarIcon fontSize="small" color="warning" />
          <Typography variant="body2" sx={{ ml: 0.5 }}>
            {expert.rating > 0 ? expert.rating.toFixed(1) : "No Ratings"}
          </Typography>
          {expert.reviews_count > 0 && (
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ ml: 1, fontStyle: "italic" }}
            >
              ({expert.reviews_count} reviews)
            </Typography>
          )}
        </Box>

        {/* Hourly Rate */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <MonetizationOnIcon fontSize="small" />
          <Typography variant="body2" sx={{ ml: 0.5 }}>
            ${expert.hourly_rate}/hr
          </Typography>
        </Box>

        {/* Location */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <LocationOnIcon fontSize="small" />
            <Typography variant="body2" sx={{ ml: 0.5 }}>
                {expert.distance
                ? `${Math.round(expert.distance)} mi · ${expert.location}`
                : expert.location || "Location not available"}
            </Typography>
        </Box>

        {/* Skills */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {expert.skills.split(",").map((skill, index) => (
            <Chip
              key={index}
              label={skill.trim()}
              variant="outlined"
              sx={{
                backgroundColor: "#f5f5f5",
                borderRadius: "16px",
                fontSize: "0.875rem",
                padding: "5px",
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Right Section - Calendar */}
      <Box
        sx={{
          flex: 2,
          ml: 2,
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)", // Ensure 7 columns
          gap: "8px",
        }}
      >
        {availability.map((slot) => (
          <Tooltip key={slot.date} title={`${slot.appointments} slots available`}>
            <Box
              sx={{
                p: 1,
                backgroundColor: slot.appointments > 0 ? "#81C784" : "#F5F5F5", // Green variant
                borderRadius: 1,
                textAlign: "center",
                cursor: "pointer",
                border: "1px solid #ddd",
                paddingLeft: "15px",
                paddingRight: "15px",
                "&:hover": {
                  backgroundColor: slot.appointments > 0 ? "#66BB6A" : "#E0E0E0", // Darker green on hover
                },
              }}
                onClick={() =>{
                        slot.appointments > 0 && handleTileClick(slot.date, slot.slots)
                    }
                }
            >
              <Typography
                variant="body2"
                fontWeight="bold"
                color={slot.appointments > 0 ? "black" : "#999"}
              >
                {parseDate(slot.date).toLocaleDateString("en-US", {
                  weekday: "short",
                })}
              </Typography>
              <Typography
                variant="body2"
                color={slot.appointments > 0 ? "black" : "#999"}
              >
                {parseDate(slot.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </Typography>
              <Typography
                variant="body2"
                fontWeight="bold"
                color={slot.appointments > 0 ? "black" : "#999"}
              >
                {slot.appointments > 0
                  ? `${slot.appointments} appts`
                  : "No appts"}
              </Typography>
            </Box>
          </Tooltip>
        ))}
      </Box>
      {/* Booking Dialog */}
      <BookingDialog
        open={dialogOpen}
        onClose={() => {
            setDialogOpen(false);
          }}
        date={selectedDate}
        slots={availableSlots}
        expertId={expert.user.id}
      />
    </Card>
  );
};

export default ExpertCard;
