import { ResponsiveBar } from "@nivo/bar";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";

const RevenueCostBarChart = ({ data }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <ResponsiveBar
      data={data}
      keys={["revenue", "cost"]}
      indexBy="product_name"
      margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
      padding={0.3}
      groupMode="grouped"
      valueScale={{ type: "linear" }}
      colors={({ id }) => (id === "revenue" ? "#4CAF50" : "#F44336")}
      borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Product Name",
        legendPosition: "middle",
        legendOffset: 40,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Value",
        legendPosition: "middle",
        legendOffset: -50,
      }}
      label={({ value }) => `${value}`} // Etiket değeri
      labelTextColor={colors.grey[100]} // Temaya uyumlu yazı rengi
      labelSkipWidth={12}
      labelSkipHeight={12}
      
      legends={[
        {
          dataFrom: "keys",
          anchor: "bottom-right",
          direction: "column",
          justify: false,
          translateX: 120,
          translateY: 0,
          itemsSpacing: 2,
          itemWidth: 100,
          itemHeight: 20,
          itemDirection: "left-to-right",
          itemOpacity: 0.85,
          symbolSize: 20,
          effects: [
            {
              on: "hover",
              style: {
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
      theme={{
        axis: {
          domain: {
            line: {
              stroke: colors.grey[100],
            },
          },
          ticks: {
            line: {
              stroke: colors.grey[100],
              strokeWidth: 1,
            },
            text: {
              fill: colors.grey[100],
              fontWeight: "bold",
            },
          },
          legend: {
            text: {
              fill: colors.grey[100],
              fontWeight: "bold",
            },
          },
        },
        grid: {
          line: {
            stroke: colors.grey[700],
            strokeWidth: 1,
          },
        },
        legends: {
          text: {
            fill: colors.grey[100],
            fontWeight: "bold",
          },
        },
        labels: {
          text: {
            fill: colors.grey[100],
            fontWeight: "bold",
          },
        },
      }}
      tooltip={({ id, value, color }) => (
        <div
          style={{
            color: "#FFFFFF", // Yazıyı beyaz yapıyoruz
            backgroundColor: color, // Arka planı barın rengine göre belirle
            padding: "5px 10px",
            borderRadius: "5px",
            fontWeight: "bold",
          }}
        >
          <strong>{id}:</strong> {value}
        </div>
      )}
      animate={true}
      motionStiffness={90}
      motionDamping={15}
    />
  );
};

export default RevenueCostBarChart;
