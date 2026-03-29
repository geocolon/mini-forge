export type LineStatus = "running" | "paused" | "maintenance";

export type EventType =
  | "unit_completed"
  | "quality_flag"
  | "maintenance_start"
  | "maintenance_end";

export interface ProductConfig {
  id: string;
  name: string;
  line: string;
  target: number;
}

export interface ProductionLine extends ProductConfig {
  status: LineStatus;
  unitsCompleted: number;
  unitsInProgress: number;
  qualityPassRate: number;
  throughputHistory: number[];
  lastUpdated: Date;
}

export interface ProductionEvent {
  id: string;
  lineId: string;
  productName: string;
  type: EventType;
  timestamp: Date;
  details: string;
}
