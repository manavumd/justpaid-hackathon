import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
} from "@vis.gl/react-google-maps";
import { useLocation } from "react-router-dom";
import { Avatar, Box, Typography, Chip } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";

const MapsComponent = ({ experts }) => {
  const location = useLocation();
  const mapRef = useRef(null); // Reference to the map instance
  const [activeExpert, setActiveExpert] = useState(null); // Active marker state
  const [userCenter, setUserCenter] = useState(null); // Track user-modified center
  const [shouldUpdateCenter, setShouldUpdateCenter] = useState(false); // Control when to update the center programmatically

  // Extract latitude and longitude from query parameters
  const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);

  const center = useMemo(() => {
    return {
      lat: Number(queryParams.get("latitude")) || experts[0]?.latitude || 40.7128,
      lng: Number(queryParams.get("longitude")) || experts[0]?.longitude || -74.006,
    };
  }, [queryParams, experts]);

  // Effect to update map center on query params or state change
  useEffect(() => {
    if (mapRef.current && !shouldUpdateCenter && center.lat && center.lng) {
      mapRef.current.setCenter(center); // Set center only when programmatically triggered
      setUserCenter(center); // Sync userCenter with the new center
      setShouldUpdateCenter(true); // Prevent further updates
    }
  }, [center, shouldUpdateCenter]);

  // Handle user interaction with the map (e.g., panning, zooming)
  const handleMapDragStart = () => {
    setShouldUpdateCenter(false); // Prevent programmatic updates while the user is dragging
  };

  const handleMapDragEnd = () => {
    if (mapRef.current) {
      const newCenter = mapRef.current.getCenter();
      setUserCenter({
        lat: newCenter.lat(),
        lng: newCenter.lng(),
      });
    }
    setShouldUpdateCenter(false); // Allow programmatic updates after drag ends
  };

  // Render markers for experts
  const ExpertMarkers = ({ experts }) => (
    <>
      {experts.map((expert) => (
        <AdvancedMarker
          key={expert.id}
          position={{
            lat: Number(expert.latitude),
            lng: Number(expert.longitude),
          }}
          clickable={true}
          onClick={() => setActiveExpert(expert)}
        >
          <Pin background={"#4285F4"} glyphColor={"#FFFFFF"} borderColor={"#000"} />
        </AdvancedMarker>
      ))}
    </>
  );

  // Info Window component
  const ExpertInfoWindow = ({ expert }) => (
    <div
      style={{
        position: "absolute",
        background: "#fff",
        padding: "15px",
        borderRadius: "12px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
        transform: "translate(-50%, -120%)",
        zIndex: 1000,
        width: "300px",
      }}
    >
      <div
        style={{
          position: "absolute",
          bottom: "-10px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "0",
          height: "0",
          borderLeft: "10px solid transparent",
          borderRight: "10px solid transparent",
          borderTop: "10px solid #fff",
          zIndex: 1001,
        }}
      ></div>

      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Avatar
          src={expert.profile_photo}
          alt={`${expert.user.first_name} ${expert.user.last_name}`}
          sx={{ width: 50, height: 50, mr: 2 }}
        />
        <Box>
          <Typography variant="h6" fontWeight="bold">
            {expert.user.first_name} {expert.user.last_name}
          </Typography>
          <Typography variant="body2" sx={{ color: "#666" }}>
            {expert.specialization || "Specialization not listed"}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
        <StarIcon fontSize="small" color="warning" />
        <Typography variant="body2" sx={{ ml: 0.5, fontWeight: "bold" }}>
          {expert.rating ? expert.rating.toFixed(1) : "No Ratings"}
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

      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
        <MonetizationOnIcon fontSize="small" />
        <Typography variant="body2" sx={{ ml: 0.5 }}>
          ${expert.hourly_rate}/hr
        </Typography>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <LocationOnIcon fontSize="small" />
        <Typography variant="body2" sx={{ ml: 0.5 }}>
          {expert.location}
        </Typography>
      </Box>

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
    </div>
  );

  return (
    <APIProvider
      apiKey={"Your API key here"}
      onLoad={(mapInstance) => (mapRef.current = mapInstance)} // Save map instance
    >
      <Map
        mapId="DEMO_MAP_ID"
        defaultZoom={13}
        defaultCenter={center}
        center={shouldUpdateCenter ? center : userCenter} // Controlled center
        onDragStart={handleMapDragStart} // Disable programmatic updates on drag start
        onDragEnd={handleMapDragEnd} // Capture new center after drag ends
        onClick={() => setActiveExpert(null)} // Close active info window on map click
      >
        <ExpertMarkers experts={experts} />

        {activeExpert && (
          <AdvancedMarker
            position={{
              lat: Number(activeExpert.latitude),
              lng: Number(activeExpert.longitude),
            }}
          >
            <ExpertInfoWindow expert={activeExpert} />
          </AdvancedMarker>
        )}
      </Map>
    </APIProvider>
  );
};

export default MapsComponent;
