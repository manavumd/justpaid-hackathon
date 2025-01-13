import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  MenuItem,
  FormControl,
  Select,
  Typography,
} from "@mui/material";
import axiosInstance from "../utils/axiosInstance";

const BookingDialog = ({ open, onClose, date, slots, expertId }) => {
  const [selectedSlot, setSelectedSlot] = useState("");

  const handleBooking = async () => {
    try {
      const response = await axiosInstance.post("/appointments/appointments/", {
        expert: expertId,
        date,
        time: selectedSlot,
      });
      console.log("Booking response:", response.data);
      alert("Appointment booked successfully!");
      onClose(); // Close the dialog after booking
      window.location.reload(); // Reload the page to reflect the changes
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert("Failed to book appointment. Please try again.");
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Available Slots on {date}</DialogTitle>
      <DialogContent>
        <Typography>Select a time slot:</Typography>
        <FormControl fullWidth>
          <Select
            value={selectedSlot}
            onChange={(e) => setSelectedSlot(e.target.value)}
            displayEmpty
            sx={{
              mt: 2,
              maxHeight: 150, // Limit the height of the dropdown
              overflowY: "auto", // Add a scrollbar if slots exceed the height
            }}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 200, // Set the maximum height for the dropdown menu
                  overflowY: "scroll",
                },
              },
            }}
          >
            <MenuItem value="" disabled>
              Select a time slot
            </MenuItem>
            {slots.map((slot, index) => (
              <MenuItem key={index} value={slot}>
                {slot}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button
          onClick={handleBooking}
          color="primary"
          disabled={!selectedSlot}
        >
          Confirm Booking
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BookingDialog;
