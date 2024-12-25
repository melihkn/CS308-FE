import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Welcome to the Home Page!
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/dashboards/smapp")}
      >
        Go to Main App
      </Button>
    </Box>
  );
}

export default HomePage;
