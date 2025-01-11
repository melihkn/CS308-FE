import { useEffect, useState } from "react";
import { Box, Typography, useTheme, Button } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { fetchProfitLossData } from "../../api/smAPI"; // Tüm veriler bu API'den çekilecek
import Header from "../../components/Header";
import ProfitLossChart from "../../components/Pie";
import { tokens } from "../../theme";

const ProfitLossAnalysis = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // State'ler
  const [chartData, setChartData] = useState([]);
  const [revenue, setRevenue] = useState(0);
  const [cost, setCost] = useState(0);
  const [startDate, setStartDate] = useState(null); // Başlangıç tarihi
  const [endDate, setEndDate] = useState(null); // Bitiş tarihi

  // API'den verileri çek
  const getData = async () => {
    try {
      const data = await fetchProfitLossData(
        startDate ? startDate.toISOString() : null,
        endDate ? endDate.toISOString() : null
      );

      // API'den gelen revenue ve cost bilgilerini güncelle
      setRevenue(data.total_sales);
      setCost(data.total_cost);

      // Chart verilerini güncelle
      updateChartData(data.total_sales, data.total_cost);
    } catch (error) {
      console.error("Data fetching failed:", error);
    }
  };

  // İlk yüklemede tüm verileri getir
  useEffect(() => {
    getData();
  }, []);

  // Tarih aralığı değiştiğinde verileri yeniden getir
  useEffect(() => {
    getData();
  }, [startDate, endDate]);

  // Chart verilerini güncelle
  const updateChartData = (totalSales, totalCost) => {
    const formattedChartData = [
      { id: "Revenue", value: totalSales.toFixed(2), color: "#4CAF50" },
      { id: "Cost", value: totalCost.toFixed(2), color: "#F44336" },
    ];
    setChartData(formattedChartData);
  };

  const handleClearFilters = async () => {
    setStartDate(null); // Tarih filtrelerini sıfırla
    setEndDate(null);
  
    // Verileri doğrudan yeniden yükle
    try {
      const data = await fetchProfitLossData(); // Tüm verileri getir
      setRevenue(data.total_sales);
      setCost(data.total_cost);
      updateChartData(data.total_sales, data.total_cost); // Grafik verilerini güncelle
    } catch (error) {
      console.error("Failed to fetch data on clearing filters:", error);
    }
  };

  const profit = revenue - cost;
  const profitPercentage = revenue > 0 ? (profit / revenue) * 100 : 0;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box m="20px">
        <Header title="Profit/Loss Analysis" subtitle="Overview of Revenue and Costs" />

        {/* Tarih Seçici ve Clear Button */}
        <Box display="flex" gap="20px" mb={4} alignItems="center">
          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={(newValue) => setStartDate(newValue)}
          />
          <DatePicker
            label="End Date"
            value={endDate}
            onChange={(newValue) => setEndDate(newValue)}
          />
          <Button variant="contained" color="secondary" onClick={handleClearFilters}>
            Clear Filters
          </Button>
        </Box>

        {/* Grafik ve Bilgiler */}
        <Box display="flex" flexDirection="column" alignItems="center" gap="20px">
          <Box width="50%">
            <ProfitLossChart data={chartData} />
          </Box>
          <Box display="flex" justifyContent="center" gap="30px">
            <Typography variant="h6" color={colors.grey[100]}>
              <strong>Total Revenue:</strong> ${revenue.toFixed(2)}
            </Typography>
            <Typography variant="h6" color={colors.grey[100]}>
              <strong>Total Cost:</strong> ${cost.toFixed(2)}
            </Typography>
            <Typography variant="h6" color={colors.grey[100]}>
              <strong>Total Profit:</strong> ${profit.toFixed(2)}
            </Typography>
            <Typography variant="h6" color={colors.grey[100]}>
              <strong>Profit Percentage:</strong> {profitPercentage.toFixed(2)}%
            </Typography>
          </Box>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default ProfitLossAnalysis;
