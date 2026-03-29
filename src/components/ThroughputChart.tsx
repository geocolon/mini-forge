import { Box, Typography } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ProductionLine } from "../types/production";

interface ThroughputChartProps {
  lines: ProductionLine[];
}

const COLORS = ["#534AB7", "#1D9E75", "#D85A30", "#378ADD"];

export function ThroughputChart({ lines }: ThroughputChartProps) {
  // Build chart data: one entry per hour with throughput for each line
  const data = Array.from({ length: 12 }, (_, i) => {
    const d = new Date();
    d.setHours(d.getHours() - (11 - i));
    const entry: Record<string, string | number> = {
      hour: `${d.getHours()}:00`,
    };
    lines.forEach((line) => {
      entry[line.name] = line.throughputHistory[i] ?? 0;
    });
    return entry;
  });

  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        p: 2,
        bgcolor: "background.paper",
      }}
    >
      <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
        Throughput (units/hr) — last 12 hours
      </Typography>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
          <XAxis dataKey="hour" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip />
          <Legend iconType="circle" iconSize={8} />
          {lines.map((line, i) => (
            <Line
              key={line.id}
              type="monotone"
              dataKey={line.name}
              stroke={COLORS[i]}
              strokeWidth={2}
              dot={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
}
