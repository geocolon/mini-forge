import { Box, Chip, Typography } from "@mui/material";
import { ProductionEvent } from "../types/production";

interface EventLogProps {
  events: ProductionEvent[];
}

const eventConfig: Record<
  string,
  { label: string; color: "success" | "warning" | "error" | "info" }
> = {
  unit_completed: { label: "Completed", color: "success" },
  quality_flag: { label: "Quality flag", color: "warning" },
  maintenance_start: { label: "Maintenance", color: "error" },
  maintenance_end: { label: "Back online", color: "info" },
};

export function EventLog({ events }: EventLogProps) {
  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        p: 2,
        bgcolor: "background.paper",
        maxHeight: 340,
        overflowY: "auto",
      }}
    >
      <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
        Production events
      </Typography>
      {events.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
          Waiting for events...
        </Typography>
      ) : (
        events.map((evt) => {
          const config = eventConfig[evt.type] ?? eventConfig.unit_completed;
          const time = evt.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          });
          return (
            <Box
              key={evt.id}
              sx={{
                display: "flex",
                gap: 1,
                py: 0.75,
                borderBottom: "1px solid",
                borderColor: "divider",
                alignItems: "center",
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ minWidth: 70, fontFamily: "monospace" }}
              >
                {time}
              </Typography>
              <Chip
                label={config.label}
                color={config.color}
                size="small"
                variant="outlined"
                sx={{ fontSize: 11, height: 22 }}
              />
              <Typography variant="body2" color="text.secondary">
                {evt.details}
              </Typography>
            </Box>
          );
        })
      )}
    </Box>
  );
}
