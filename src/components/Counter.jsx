import { useEffect, useState } from "react";
import { Box, Button, Typography, useTheme } from "@mui/material";
import { fetchRefunds } from "../api/smAPI"; // Refundları almak için API fonksiyonu
import { tokens } from "../theme";
import { useNavigate } from "react-router-dom";

const PendingRefunds = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [pendingCount, setPendingCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const getPendingRefunds = async () => {
      try {
        const refunds = await fetchRefunds();
        const pendingRefunds = refunds.filter((refund) => refund.status === "Pending");
        setPendingCount(pendingRefunds.length);
      } catch (error) {
        console.error("Failed to fetch refunds:", error);
      }
    };

    getPendingRefunds();
  }, []);
  

  return (
    <Box
      sx={{
        backgroundColor: colors.primary[400],
        color: colors.grey[100],
        padding: "10px 20px",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
        textAlign: "center",
        display: "inline-block",
      }}
    >
      <Typography variant="h6" fontWeight="bold">
        <h1>{pendingCount} </h1>waiting refund requests
      </Typography>
      <Button
                  type="submit"
                  variant="contained"
                  onClick={() => navigate("/dashboards/smapp/refunds")}
                  fullWidth
                  sx={{ mt: 2,
                        backgroundColor: colors.greenAccent[600],
                        color: colors.primary[500]
                   }}
                  
                >
                  Go To Refunds
      </Button>
    </Box>
  );
};

export default PendingRefunds;
