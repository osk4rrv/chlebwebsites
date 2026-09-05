export type RegionStatus = "operational" | "degraded" | "provisioning";

export interface Region {
  code: string;
  city: string;
  country: string;
  cc: string;
  facility: string;
  latency: number; // p50 ms from a European reference probe
  capacity: number; // % allocated
  uplink: string;
  status: RegionStatus;
  /** Rough position on the equirectangular map, in percent. */
  x: number;
  y: number;
  tier: "core" | "edge";
}

export const REGIONS: Region[] = [
  {
    code: "waw1",
    city: "Warsaw",
    country: "Poland",
    cc: "PL",
    facility: "Atman WA-1",
    latency: 6,
    capacity: 71,
    uplink: "2 × 25 Gbps",
    status: "operational",
    x: 53.4,
    y: 27.5,
    tier: "core",
  },
  {
    code: "fra1",
    city: "Frankfurt",
    country: "Germany",
    cc: "DE",
    facility: "Interxion FRA15",
    latency: 11,
    capacity: 84,
    uplink: "4 × 25 Gbps",
    status: "operational",
    x: 50.6,
    y: 28.6,
    tier: "core",
  },
  {
    code: "ams1",
    city: "Amsterdam",
    country: "Netherlands",
    cc: "NL",
    facility: "NIKHEF / AMS-IX",
    latency: 14,
    capacity: 62,
    uplink: "2 × 25 Gbps",
    status: "operational",
    x: 49.4,
    y: 26.8,
    tier: "core",
  },
  {
    code: "lon1",
    city: "London",
    country: "United Kingdom",
    cc: "GB",
    facility: "Telehouse North Two",
    latency: 19,
    capacity: 58,
    uplink: "2 × 25 Gbps",
    status: "operational",
    x: 47.6,
    y: 27.4,
    tier: "core",
  },
  {
    code: "ash1",
    city: "Ashburn",
    country: "United States",
    cc: "US",
    facility: "Equinix DC2",
    latency: 87,
    capacity: 49,
    uplink: "2 × 25 Gbps",
    status: "operational",
    x: 25.6,
    y: 33.4,
    tier: "core",
  },
  {
    code: "dfw1",
    city: "Dallas",
    country: "United States",
    cc: "US",
    facility: "Digital Realty DFW",
    latency: 108,
    capacity: 37,
    uplink: "1 × 25 Gbps",
    status: "operational",
    x: 20.2,
    y: 36.4,
    tier: "edge",
  },
  {
    code: "lax1",
    city: "Los Angeles",
    country: "United States",
    cc: "US",
    facility: "CoreSite LA1",
    latency: 141,
    capacity: 44,
    uplink: "1 × 25 Gbps",
    status: "operational",
    x: 13.8,
    y: 35.2,
    tier: "edge",
  },
  {
    code: "sgp1",
    city: "Singapore",
    country: "Singapore",
    cc: "SG",
    facility: "Equinix SG3",
    latency: 176,
    capacity: 29,
    uplink: "1 × 25 Gbps",
    status: "provisioning",
    x: 77.6,
    y: 53.8,
    tier: "edge",
  },
];

export const NETWORK = {
  asn: "AS204213",
  peers: 412,
  ixps: ["AMS-IX", "DE-CIX", "LINX", "THINX", "Equinix IX"],
  transit: ["Cogent", "Arelion", "Lumen", "RETN"],
  capacityGbps: 480,
  ddosCapacityTbps: 4.2,
};
