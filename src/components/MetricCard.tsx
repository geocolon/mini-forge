import { Box, Typography } from "@mui/material";

interface MetricCardProps {
  label: string;
  value: string;
  subtitle?: string;
}

export function MetricCard({ label, value, subtitle }: MetricCardProps) {
  return (
    <Box
      sx={{
        bgcolor: "action.hover",
        borderRadius: 2,
        p: 2,
        flex: "1 1 0",
        minWidth: 140,
      }}
    >
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="h5" fontWeight={500}>
        {value}
      </Typography>
      {subtitle && (
        <Typography variant="caption" color="text.secondary">
          {subtitle}
        </Typography>
      )}
    </Box>
  );
}
