import {
  ProductionLine,
  ProductionEvent,
  ProductConfig,
  EventType,
} from "../types/production";

/**
 * ProductionStore manages simulated factory floor data.
 *
 * Architecture note: This follows the same pattern as Anduril's EntityStore
 * in the sample-app-entity-visualizer. A class-based store holds mutable state
 * internally, updated via a simulated data stream (setInterval here, gRPC
 * streaming in production). React polls the store on a timer rather than
 * coupling stream callbacks directly to setState, keeping the render layer
 * decoupled from the data layer.
 *
 * In a real Forge implementation, the constructor would open a gRPC stream
 * to a production backend instead of using setInterval.
 */

const PRODUCTS: ProductConfig[] = [
  { id: "roadrunner", name: "Roadrunner", line: "Line A", target: 120 },
  { id: "fury", name: "Fury", line: "Line B", target: 40 },
  { id: "altius", name: "Altius-600", line: "Line C", target: 200 },
  { id: "ghostx", name: "Ghost X", line: "Line D", target: 300 },
];

export class ProductionStore {
  private lines: Map<string, ProductionLine>;
  private events: ProductionEvent[];
  private streamInterval: ReturnType<typeof setInterval> | null = null;

  constructor() {
    this.lines = new Map();
    this.events = [];
    this.initializeLines();
    this.startStream();
  }

  private initializeLines(): void {
    for (const product of PRODUCTS) {
      this.lines.set(product.id, {
        ...product,
        status: "running",
        unitsCompleted: Math.floor(
          product.target * 0.4 + Math.random() * product.target * 0.2
        ),
        unitsInProgress: Math.floor(Math.random() * 5) + 1,
        qualityPassRate: 95 + Math.random() * 4.5,
        throughputHistory: Array.from(
          { length: 12 },
          () => Math.floor(Math.random() * 8) + 3
        ),
        lastUpdated: new Date(),
      });
    }
  }

  /**
   * Simulates a gRPC server-streaming connection.
   * In production Forge, this would be:
   *   this.connection.streamProductionEvents({ includeAllLines: true }, callback)
   * following the same ConnectRPC pattern as EntityStore.streamEntities()
   */
  private startStream(): void {
    this.streamInterval = setInterval(() => {
      this.lines.forEach((line, id) => {
        if (line.status !== "running") return;

        const newUnits = Math.floor(Math.random() * 3);
        const updatedLine: ProductionLine = {
          ...line,
          unitsCompleted: line.unitsCompleted + newUnits,
          unitsInProgress: Math.max(
            1,
            line.unitsInProgress + Math.floor(Math.random() * 3) - 1
          ),
          qualityPassRate: Math.min(
            99.9,
            Math.max(92, line.qualityPassRate + (Math.random() - 0.48) * 0.8)
          ),
          throughputHistory: [...line.throughputHistory.slice(1), newUnits],
          lastUpdated: new Date(),
        };

        this.lines.set(id, updatedLine);

        // Generate production events
        if (newUnits > 0) {
          this.addEvent(line, "unit_completed");
        }
        if (Math.random() < 0.08) {
          this.addEvent(line, "quality_flag");
        }
      });
    }, 3000);
  }

  private addEvent(line: ProductionLine, type: EventType): void {
    const serial = `SN-${Math.floor(Math.random() * 9000) + 1000}`;
    const details =
      type === "unit_completed"
        ? `${line.name} ${serial} passed final inspection`
        : type === "quality_flag"
        ? `${line.name} ${serial} flagged for review`
        : type === "maintenance_start"
        ? `${line.name} ${line.line} entering scheduled maintenance`
        : `${line.name} ${line.line} back online`;

    this.events.unshift({
      id: crypto.randomUUID(),
      lineId: line.id,
      productName: line.name,
      type,
      timestamp: new Date(),
      details,
    });

    // Keep only the most recent 30 events
    if (this.events.length > 30) {
      this.events = this.events.slice(0, 30);
    }
  }

  /** Toggle a production line between running and paused */
  toggleLine(id: string): void {
    const line = this.lines.get(id);
    if (!line) return;

    const newStatus = line.status === "running" ? "paused" : "running";
    this.lines.set(id, { ...line, status: newStatus, lastUpdated: new Date() });

    this.addEvent(
      line,
      newStatus === "paused" ? "maintenance_start" : "maintenance_end"
    );
  }

  /** Called by React on a polling interval (same pattern as EntityStore.getAllEntities) */
  getAllLines(): ProductionLine[] {
    return [...this.lines.values()];
  }

  getEvents(): ProductionEvent[] {
    return [...this.events];
  }

  destroy(): void {
    if (this.streamInterval) {
      clearInterval(this.streamInterval);
    }
  }
}
