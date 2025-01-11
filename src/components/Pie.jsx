import { ResponsivePie } from "@nivo/pie";
import { useTheme } from "@mui/material";

const ProfitLossChart = ({ data }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const formatValue = (value) => parseFloat(value).toFixed(2);

  return (
    <div style={{ height: 400, width: "100%" }}>
      <ResponsivePie
        data={data}
        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
        innerRadius={0.5}
        padAngle={1}
        cornerRadius={3}
        colors={({ data }) => data.color}
        borderWidth={1}
        borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
        radialLabelsSkipAngle={10}
        radialLabelsTextColor={isDarkMode ? "#ffffff" : "#333333"} // Tema moduna göre metin rengi
        radialLabelsLinkColor={isDarkMode ? "#ffffff" : "#333333"} // Bağlantı çizgisi rengi
        sliceLabelsSkipAngle={10}
        sliceLabelsTextColor={isDarkMode ? "#ffffff" : "#333333"} // Dilim üzerindeki yazı rengi
        
        tooltip={({ datum }) => (
          <div
            style={{
              background: isDarkMode ? "#333333" : "#ffffff",
              color: isDarkMode ? "#ffffff" : "#333333",
              padding: "5px 10px",
              borderRadius: "5px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            }}
          >
            <strong>{datum.id}</strong>: {datum.value}
          </div>
        )}
        theme={{
          axis: {
            domain: {
              line: {
                stroke: isDarkMode ? "#ffffff" : "#333333",
              },
            },
            legend: {
              text: {
                fill: isDarkMode ? "#ffffff" : "#333333",
              },
            },
            ticks: {
              line: {
                stroke: isDarkMode ? "#ffffff" : "#333333",
                strokeWidth: 1,
              },
              text: {
                fill: isDarkMode ? "#ffffff" : "#333333",
              },
            },
          },
          legends: {
            text: {
              fill: isDarkMode ? "#ffffff" : "#333333",
            },
          },
          labels: {
            text: {
              fill: isDarkMode ? "#ffffff" : "#333333",
            },
          },
        }}
      />
    </div>
  );
};

export default ProfitLossChart;
