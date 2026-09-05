export const SITE = {
  name: "Asterza",
  legal: "Asterza Infrastructure sp. z o.o.",
  domain: "asterza.host",
  founded: 2021,
  headquarters: "Warsaw, Poland",
  vat: "PL 528 419 7710",
  support: "support@asterza.host",
  abuse: "abuse@asterza.host",
};

export const NAV = [
  { label: "Products", to: "/products" },
  { label: "Servers", to: "/servers" },
  { label: "Pricing", to: "/pricing" },
  { label: "Documentation", to: "/docs" },
  { label: "Status", to: "/status" },
];

/** Headline metrics. Every one of these is a number we can point at, not a
 *  claim — the label carries the caveat. */
export const METRICS = [
  { value: "99.99%", label: "Uptime, 12-month rolling", sub: "SLA credited at 99.9" },
  { value: "6 ms", label: "p50 within Poland", sub: "waw1, measured hourly" },
  { value: "38 s", label: "VPS provision time", sub: "p95 across all regions" },
  { value: "4.2 Tbps", label: "DDoS scrubbing", sub: "on-net, always enabled" },
  { value: "3 m 40 s", label: "Median first reply", sub: "chat, last 30 days" },
];

export const SPEC_SHEET: { group: string; rows: [string, string][] }[] = [
  {
    group: "Compute",
    rows: [
      ["Platform", "KVM on Linux 6.12 LTS, host-passthrough CPU model"],
      ["Silicon", "AMD EPYC 9354P (32c/64t) · Ryzen 9 7950X for game nodes"],
      ["Allocation", "1 vCPU = 1 physical core, pinned. No oversubscription."],
      ["Memory", "DDR5-4800 ECC registered, no ballooning"],
      ["Steal target", "< 0.5% p99 — breach it and the node stops taking sales"],
    ],
  },
  {
    group: "Storage",
    rows: [
      ["Media", "Samsung PM9A3 / Micron 7450 Gen4 NVMe, enterprise TLC"],
      ["Topology", "RAID10 per node, 4 to 8 drives, hot spare on standby"],
      ["Throughput", "3.1 GB/s sequential, 480k IOPS 4k random, per instance"],
      ["Latency", "0.09 ms p50, 0.41 ms p99 read"],
      ["Backups", "Nightly, off-node, retained 7–14 days by plan. Restores are self-serve."],
    ],
  },
  {
    group: "Network",
    rows: [
      ["Autonomous system", "AS204213, 412 peering sessions, 480 Gbps aggregate"],
      ["Exchanges", "AMS-IX · DE-CIX · LINX · THINX · Equinix IX"],
      ["Transit", "Cogent · Arelion · Lumen · RETN — four carriers, no single vendor"],
      ["Addressing", "IPv4 per instance, /64 IPv6 routed, /48 on Fleet"],
      ["Mitigation", "Always-on, sub-second detection, layer 7 filters for game protocols"],
    ],
  },
  {
    group: "Operations",
    rows: [
      ["Change policy", "Host kernel updates are live-migrated, not rebooted"],
      ["Maintenance", "Announced 7 days ahead, executed 02:00–05:00 local"],
      ["Incidents", "Public post-mortem within 72 hours, always"],
      ["Compliance", "GDPR, data resident in the region you pick, DPA on request"],
      ["Access", "Panel 2FA mandatory for staff, all actions audit-logged"],
    ],
  },
];

export const QUOTE = {
  text:
    "We moved 40 game servers off a provider that kept blaming our plugins for lag. The lag was CPU steal. On Asterza the tick graph is a flat line and I stopped getting woken up at 3am.",
  name: "Marek Wiśniewski",
  role: "Infrastructure, Northpoint Network",
  meta: "18 nodes · waw1 / fra1 · customer since 2023",
};

export const FAQ: { q: string; a: string }[] = [
  {
    q: "Is the price on the pricing page the price I pay?",
    a: "Yes. There is no setup fee, no charge for DDoS protection, no charge for backups, and no charge to move a server between regions. VAT is added for EU consumers and shown before checkout. Renewal is at the same rate you signed up on — we have never raised the price of an existing plan.",
  },
  {
    q: "What does 'dedicated core' actually mean here?",
    a: "One vCPU maps to one physical core on the host, pinned, and that core is not sold to anyone else. We publish a steal-time target of under 0.5% at p99. When a node approaches it, that node is removed from the sales pool until we add capacity.",
  },
  {
    q: "Can I cancel mid-month?",
    a: "VPS and bot plans are metered hourly and capped at the monthly price, so cancelling stops the meter immediately and you keep what you already paid for. Game plans are monthly, and you can suspend a server for free between seasons instead of deleting it.",
  },
  {
    q: "Do you oversell bandwidth?",
    a: "No. Quotas are real and generous; once you pass one, the port shapes to 1 Gbps instead of billing overage. Game plans are unmetered because inbound game traffic is small and predictable.",
  },
  {
    q: "How fast is support, honestly?",
    a: "Median first human reply on chat over the last 30 days was 3 minutes 40 seconds. It is not a bot and it is not a tier-1 script — the person answering has root on the platform. Overnight coverage is thinner between 02:00 and 06:00 CET.",
  },
  {
    q: "What happens if you go down?",
    a: "SLA credit starts below 99.9% monthly availability: 10% of the monthly fee per 0.1% missed, up to the full month. Credits are applied without you having to ask, and every incident over 5 minutes gets a public post-mortem within 72 hours.",
  },
];
