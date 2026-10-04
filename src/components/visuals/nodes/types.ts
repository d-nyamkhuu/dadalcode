export type NodeRecord = {
  id: string;
  value: unknown;
  links: Record<string, string>;
  terminal?: boolean;
  storedIndex?: number;
};
export type Model = {
  kind: string;
  nodes: NodeRecord[];
  root: string;
  stable: boolean;
  omitted: number;
  truncated: boolean;
  directed: boolean;
  scalarIds?: boolean;
};
export type Point = { x: number; y: number };
export type Props = {
  value: unknown;
  previousValue?: unknown;
  kind?: string;
  variable?: string;
  variables?: Record<string, unknown>;
  previousVariables?: Record<string, unknown>;
  input?: Record<string, unknown>;
  fitContents?: boolean;
  explicitKind?: boolean;
};
