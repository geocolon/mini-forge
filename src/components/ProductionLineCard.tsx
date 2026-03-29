import { Box, Button, Chip, LinearProgress, Typography } from "@mui/material";
import { ProductionLine } from "../types/production";

interface ProductionLineCardProps {
  line: ProductionLine;
  onToggle: (id: string) => void;
}

const statusColors = {
  running: "success" as const,
  paused: "warning" as const,
  maintenance: "error" as const,
};

export function ProductionLineCard({ line, onToggle }: ProductionLineCardProps) {
  const pct = Math.round((line.unitsCompleted / line.target) * 100);
  const qualityColor =
    line.qualityPassRate >= 97
      ? "success.main"
      : line.qualityPassRate >= 95
      ? "warning.main"
      : "error.main";

  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        p: 2,
        mb: 1.5,
        bgcolor: "background.paper",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1.5,
        }}
      >
        <Box>
          <Typography variant="subtitle1" fontWeight={600} component="span">
            {line.name}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            component="span"
            sx={{ ml: 1 }}
          >
            {line.line}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Chip
            label={line.status}
            color={statusColors[line.status]}
            size="small"
            variant="outlined"
            sx={{ textTransform: "capitalize" }}
          />
          <Button
            size="small"
            variant="outlined"
            onClick={() => onToggle(line.id)}
            sx={{ minWidth: 70, fontSize: 12 }}
          >
            {line.status === "running" ? "Pause" : "Resume"}
          </Button>
        </Box>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
        <Typography variant="body2" color="text.secondary">
          {line.unitsCompleted} / {line.target} units
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {pct}%
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={Math.min(100, pct)}
        sx={{ height: 8, borderRadius: 1, mb: 1.5 }}
      />

      <Box sx={{ display: "flex", gap: 3 }}>
        <Box>
          <Typography variant="caption" color="text.secondary">
            In progress
          </Typography>
          <Typography variant="h6" fontWeight={500}>
            {line.unitsInProgress}
          </Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary">
            Quality rate
          </Typography>
          <Typography variant="h6" fontWeight={500} color={qualityColor}>
            {line.qualityPassRate.toFixed(1)}%
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
