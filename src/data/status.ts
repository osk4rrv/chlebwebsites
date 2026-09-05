export type Health = "operational" | "degraded" | "maintenance" | "outage";

export interface Component {
  name: string;
  scope: string;
  health: Health;
  uptime90: number;
}

export const COMPONENTS: Component[] = [
  { name: "Control panel", scope: "app.asterza.host", health: "operational", uptime90: 99.998 },
  { name: "Public API", scope: "api.asterza.host", health: "operational", uptime90: 100 },
  { name: "Provisioning queue", scope: "all regions", health: "operational", uptime90: 99.991 },
  { name: "Compute — waw1", scope: "Warsaw", health: "operational", uptime90: 100 },
  { name: "Compute — fra1", scope: "Frankfurt", health: "operational", uptime90: 99.997 },
  { name: "Compute — ams1", scope: "Amsterdam", health: "operational", uptime90: 100 },
  { name: "Compute — lon1", scope: "London", health: "operational", uptime90: 99.982 },
  { name: "Compute — ash1", scope: "Ashburn", health: "operational", uptime90: 99.994 },
  { name: "Compute — dfw1", scope: "Dallas", health: "operational", uptime90: 100 },
  { name: "Compute — lax1", scope: "Los Angeles", health: "operational", uptime90: 99.976 },
  { name: "Compute — sgp1", scope: "Singapore", health: "maintenance", uptime90: 99.4 },
  { name: "Backup storage", scope: "eu + us", health: "operational", uptime90: 100 },
  { name: "DDoS scrubbing", scope: "AS204213", health: "operational", uptime90: 100 },
  { name: "Billing", scope: "billing.asterza.host", health: "operational", uptime90: 99.999 },
];

export interface Incident {
  id: string;
  date: string;
  title: string;
  severity: "minor" | "major" | "maintenance";
  duration: string;
  scope: string;
  summary: string;
  updates: { at: string; text: string }[];
}

export const INCIDENTS: Incident[] = [
  {
    id: "INC-2026-0244",
    date: "2026-09-02",
    title: "sgp1 buildout — provisioning disabled",
    severity: "maintenance",
    duration: "ongoing",
    scope: "sgp1",
    summary:
      "Singapore is in final acceptance testing. Provisioning stays closed to new instances until transit is dual-homed.",
    updates: [
      { at: "2026-09-02 08:10 UTC", text: "RETN session established, waiting on Arelion cross-connect." },
      { at: "2026-08-27 14:35 UTC", text: "Compute racked and burned in for 96 hours. No faults." },
    ],
  },
  {
    id: "INC-2026-0231",
    date: "2026-08-14",
    title: "Elevated p99 on lon1 storage tier",
    severity: "minor",
    duration: "38 min",
    scope: "lon1",
    summary:
      "A failed NVMe in one RAID10 set pushed p99 write latency from 0.4 ms to 6 ms on eleven instances. No data loss; rebuild completed on a hot spare.",
    updates: [
      { at: "2026-08-14 03:12 UTC", text: "Rebuild finished, latency back to baseline. Drive RMA'd." },
      { at: "2026-08-14 02:41 UTC", text: "Drive isolated, array rebuilding onto spare." },
      { at: "2026-08-14 02:34 UTC", text: "Investigating write latency alerts on node lon1-c07." },
    ],
  },
  {
    id: "INC-2026-0219",
    date: "2026-07-29",
    title: "Panel logins failing for a subset of accounts",
    severity: "major",
    duration: "17 min",
    scope: "app.asterza.host",
    summary:
      "A session-store migration invalidated tokens for accounts created before 2025. Running servers were never affected — only panel and API authentication.",
    updates: [
      { at: "2026-07-29 19:26 UTC", text: "Migration rolled back, all sessions reissued." },
      { at: "2026-07-29 19:09 UTC", text: "Cause identified as the session-store migration." },
    ],
  },
  {
    id: "INC-2026-0203",
    date: "2026-06-11",
    title: "1.4 Tbps UDP flood absorbed at edge",
    severity: "minor",
    duration: "9 min",
    scope: "AS204213",
    summary:
      "A carpet-bomb attack aimed at a game customer in fra1. Traffic was scrubbed at the edge; the target server stayed online with 3 ms of added jitter.",
    updates: [
      { at: "2026-06-11 21:58 UTC", text: "Attack ended. No customer-visible downtime." },
    ],
  },
];

export const UPTIME_HISTORY = [
  { month: "Oct 25", value: 100 },
  { month: "Nov 25", value: 99.997 },
  { month: "Dec 25", value: 100 },
  { month: "Jan 26", value: 99.999 },
  { month: "Feb 26", value: 100 },
  { month: "Mar 26", value: 99.993 },
  { month: "Apr 26", value: 100 },
  { month: "May 26", value: 100 },
  { month: "Jun 26", value: 99.998 },
  { month: "Jul 26", value: 99.988 },
  { month: "Aug 26", value: 99.991 },
  { month: "Sep 26", value: 100 },
];
