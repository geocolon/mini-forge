import { useEffect, useState } from "react";
import { Box, Container, Typography, Grid } from "@mui/material";
import { ProductionStore } from "./store/ProductionStore";
import { ProductionLine, ProductionEvent } from "./types/production";
import { ProductionLineCard } from "./components/ProductionLineCard";
import { ThroughputChart } from "./components/ThroughputChart";
import { EventLog } from "./components/EventLog";
import { MetricCard } from "./components/MetricCard";

/**
 * App.tsx follows the same architecture as the entity visualizer's App.tsx:
 *
 * 1. Create a store instance in useEffect (EntityStore / ProductionStore)
 * 2. Poll the store on a setInterval timer (5s in entity viz, 3s here)
 * 3. Spread store data into React state to trigger re-renders
 * 4. The store handles streaming internally; React just reads snapshots
 *
 * This decouples high-frequency data updates from React's render cycle.
 */
function App() {
  const [lines, setLines] = useState<ProductionLine[]>([]);
  const [events, setEvents] = useState<ProductionEvent[]>([]);
  const [store, setStore] = useState<ProductionStore | null>(null);

  useEffect(() => {
    const productionStore = new ProductionStore();
    setStore(productionStore);

    // Poll the store every 3 seconds (same pattern as entity visualizer)
    const interval = setInterval(() => {
      setLines(productionStore.getAllLines());
      setEvents(productionStore.getEvents());
    }, 3000);

    return () => {
      clearInterval(interval);
      productionStore.destroy();
    };
  }, []);

  function handleToggle(id: string) {
    store?.toggleLine(id);
    if (store) {
      setLines(store.getAllLines());
      setEvents(store.getEvents());
    }
  }

  const totalCompleted = lines.reduce((s, l) => s + l.unitsCompleted, 0);
  const totalTarget = lines.reduce((s, l) => s + l.target, 0);
  const avgQuality =
    lines.length > 0
      ? (lines.reduce((s, l) => s + l.qualityPassRate, 0) / lines.length).toFixed(1)
      : "0";
  const activeLines = lines.filter((l) => l.status === "running").length;

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          mb: 3,
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight={600}>
            Forge — production overview
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Arsenal-1 facility &middot; Costa Mesa &middot; Live
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              bgcolor: "success.main",
            }}
          />
          <Typography variant="body2" color="text.secondary">
            Streaming &middot; updated{" "}
            {new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Typography>
        </Box>
      </Box>

      {/* Summary metrics */}
      <Box sx={{ display: "flex", gap: 1.5, mb: 3, flexWrap: "wrap" }}>
        <MetricCard
          label="Units completed"
          value={totalCompleted.toLocaleString()}
          subtitle={`of ${totalTarget.toLocaleString()} target`}
        />
        <MetricCard
          label="Avg quality rate"
          value={`${avgQuality}%`}
          subtitle={
            Number(avgQuality) >= 97 ? "Above threshold" : "Monitor closely"
          }
        />
        <MetricCard
          label="Active lines"
          value={`${activeLines} / ${lines.length}`}
          subtitle={
            activeLines === lines.length
              ? "All operational"
              : `${lines.length - activeLines} paused`
          }
        />
        <MetricCard label="Shift" value="Day A" subtitle="06:00 - 18:00 PST" />
      </Box>

      {/* Main content */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          {lines.map((line) => (
            <ProductionLineCard
              key={line.id}
              line={line}
              onToggle={handleToggle}
            />
          ))}
        </Grid>
        <Grid item xs={12} md={6}>
          <ThroughputChart lines={lines} />
          <Box sx={{ mt: 2 }}>
            <EventLog events={events} />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;
