import { useEffect, useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { fetchRefunds } from "../smapi/smAPI"; // Refundları almak için API fonksiyonu
import { tokens } from "../theme";

const PendingRefunds = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [pendingCount, setPendingCount] = useState(0);

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
        {pendingCount} waiting refund requests
      </Typography>
    </Box>
  );
};

export default PendingRefunds;
