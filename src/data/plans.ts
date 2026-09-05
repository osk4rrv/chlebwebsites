export type Family = "vps" | "game" | "bot";

export interface Plan {
  sku: string;
  name: string;
  /** One line on who this is actually for. No marketing adjectives. */
  fit: string;
  price: number; // EUR / month, billed monthly
  priceAnnual: number; // EUR / month equivalent when paid yearly
  cpu: string;
  cpuNote: string;
  memory: string;
  storage: string;
  bandwidth: string;
  uplink: string;
  extra: string; // family-specific headline spec
  extraLabel: string;
  backups: string;
  provision: string;
  featured?: boolean;
}

export interface FamilyMeta {
  id: Family;
  index: string;
  name: string;
  nav: string;
  path: string;
  summary: string;
  body: string;
  hardware: string;
  from: number;
  bullets: string[];
}

export const FAMILIES: FamilyMeta[] = [
  {
    id: "vps",
    index: "01",
    name: "Virtual private servers",
    nav: "VPS",
    path: "/vps",
    summary: "KVM instances with dedicated cores and full root.",
    body:
      "Every vCPU is pinned to a physical core — no bursting, no noisy neighbours, no CPU steal on your graphs. You get an IPv4, a /64 of IPv6, out-of-band console access and a real API.",
    hardware: "AMD EPYC 9354P · DDR5 ECC · Gen4 NVMe",
    from: 5.9,
    bullets: [
      "Debian, Ubuntu, Alma, Rocky, Arch, Alpine, NixOS or your own ISO",
      "KVM console over the browser, no ticket required",
      "Snapshots and nightly off-node backups included",
    ],
  },
  {
    id: "game",
    index: "02",
    name: "Game servers",
    nav: "Game servers",
    path: "/game-servers",
    summary: "High-clock nodes tuned for tick rate, not core count.",
    body:
      "Simulation loops are single-threaded, so we run them on Ryzen 9 7950X at 5.7 GHz instead of dense server silicon. Mods, plugins, schedules and SFTP are handled from the panel.",
    hardware: "Ryzen 9 7950X @ 5.7 GHz · DDR5 · Gen4 NVMe",
    from: 3.5,
    bullets: [
      "Minecraft, CS2, Rust, Palworld, Valheim, ARK, Garry's Mod, FiveM",
      "One-click modpack, plugin and version switching",
      "Player-count autoscaling on Clan plans and above",
    ],
  },
  {
    id: "bot",
    index: "03",
    name: "Discord bot hosting",
    nav: "Bot hosting",
    path: "/discord-bots",
    summary: "Long-running processes that stay up and stay observable.",
    body:
      "Push a repo or a container; we build it, keep it alive, restart it on crash and stream logs and gateway metrics back to you. Shard-aware, so large bots scale horizontally without rewrites.",
    hardware: "EPYC 9354P · shared-tenancy containers · Gen4 NVMe",
    from: 1.2,
    bullets: [
      "Node, Python, Go, Java, Rust, .NET or any Dockerfile",
      "Deploy from GitHub push, CLI or the REST API",
      "Gateway latency, shard state and memory retained for 30 days",
    ],
  },
];

export const PLANS: Record<Family, Plan[]> = {
  vps: [
    {
      sku: "v.2",
      name: "Solo",
      fit: "A single service, a staging box, a personal VPN.",
      price: 5.9,
      priceAnnual: 4.72,
      cpu: "2 vCPU",
      cpuNote: "dedicated",
      memory: "4 GB DDR5 ECC",
      storage: "60 GB NVMe",
      bandwidth: "8 TB",
      uplink: "10 Gbps",
      extra: "1 × IPv4 + /64",
      extraLabel: "Addressing",
      backups: "7 daily",
      provision: "34 s",
    },
    {
      sku: "v.4",
      name: "Build",
      fit: "App plus database, CI runners, small production.",
      price: 10.9,
      priceAnnual: 8.72,
      cpu: "4 vCPU",
      cpuNote: "dedicated",
      memory: "8 GB DDR5 ECC",
      storage: "120 GB NVMe",
      bandwidth: "16 TB",
      uplink: "10 Gbps",
      extra: "1 × IPv4 + /64",
      extraLabel: "Addressing",
      backups: "7 daily",
      provision: "36 s",
    },
    {
      sku: "v.8",
      name: "Scale",
      fit: "Production workloads with headroom to spare.",
      price: 21.5,
      priceAnnual: 17.2,
      cpu: "8 vCPU",
      cpuNote: "dedicated",
      memory: "16 GB DDR5 ECC",
      storage: "240 GB NVMe",
      bandwidth: "24 TB",
      uplink: "10 Gbps",
      extra: "2 × IPv4 + /64",
      extraLabel: "Addressing",
      backups: "14 daily + weekly",
      provision: "38 s",
      featured: true,
    },
    {
      sku: "v.16",
      name: "Fleet",
      fit: "Clusters, heavy databases, multi-tenant platforms.",
      price: 41,
      priceAnnual: 32.8,
      cpu: "16 vCPU",
      cpuNote: "dedicated",
      memory: "32 GB DDR5 ECC",
      storage: "480 GB NVMe",
      bandwidth: "40 TB",
      uplink: "10 Gbps",
      extra: "4 × IPv4 + /48",
      extraLabel: "Addressing",
      backups: "14 daily + weekly",
      provision: "41 s",
    },
  ],
  game: [
    {
      sku: "g.4",
      name: "Pocket",
      fit: "Vanilla Minecraft or Valheim with friends.",
      price: 3.5,
      priceAnnual: 2.8,
      cpu: "2 threads",
      cpuNote: "5.7 GHz boost",
      memory: "4 GB DDR5",
      storage: "40 GB NVMe",
      bandwidth: "Unmetered",
      uplink: "1 Gbps",
      extra: "12 slots",
      extraLabel: "Slots",
      backups: "3 daily",
      provision: "22 s",
    },
    {
      sku: "g.8",
      name: "Squad",
      fit: "Modded packs, CS2 competitive, small Rust.",
      price: 6.9,
      priceAnnual: 5.52,
      cpu: "4 threads",
      cpuNote: "5.7 GHz boost",
      memory: "8 GB DDR5",
      storage: "80 GB NVMe",
      bandwidth: "Unmetered",
      uplink: "1 Gbps",
      extra: "40 slots",
      extraLabel: "Slots",
      backups: "7 daily",
      provision: "24 s",
      featured: true,
    },
    {
      sku: "g.16",
      name: "Clan",
      fit: "Public communities, heavy plugin stacks, FiveM.",
      price: 12.9,
      priceAnnual: 10.32,
      cpu: "6 threads",
      cpuNote: "5.7 GHz boost",
      memory: "16 GB DDR5",
      storage: "160 GB NVMe",
      bandwidth: "Unmetered",
      uplink: "2.5 Gbps",
      extra: "Unlimited",
      extraLabel: "Slots",
      backups: "14 daily",
      provision: "26 s",
    },
    {
      sku: "g.32",
      name: "Network",
      fit: "Proxy networks running several servers at once.",
      price: 24.9,
      priceAnnual: 19.92,
      cpu: "12 threads",
      cpuNote: "5.7 GHz boost",
      memory: "32 GB DDR5",
      storage: "320 GB NVMe",
      bandwidth: "Unmetered",
      uplink: "2.5 Gbps",
      extra: "Unlimited",
      extraLabel: "Slots",
      backups: "14 daily",
      provision: "29 s",
    },
  ],
  bot: [
    {
      sku: "b.1",
      name: "Single",
      fit: "One bot, one guild, a few thousand events a day.",
      price: 1.2,
      priceAnnual: 0.96,
      cpu: "0.5 vCPU",
      cpuNote: "burstable to 2",
      memory: "512 MB",
      storage: "5 GB NVMe",
      bandwidth: "500 GB",
      uplink: "1 Gbps",
      extra: "1 shard",
      extraLabel: "Sharding",
      backups: "Config only",
      provision: "9 s",
    },
    {
      sku: "b.2",
      name: "Standard",
      fit: "A public bot in a few hundred guilds.",
      price: 2.4,
      priceAnnual: 1.92,
      cpu: "1 vCPU",
      cpuNote: "burstable to 3",
      memory: "1 GB",
      storage: "10 GB NVMe",
      bandwidth: "1 TB",
      uplink: "1 Gbps",
      extra: "2 shards",
      extraLabel: "Sharding",
      backups: "3 daily",
      provision: "11 s",
      featured: true,
    },
    {
      sku: "b.4",
      name: "Sharded",
      fit: "Music, moderation or economy bots at real scale.",
      price: 4.8,
      priceAnnual: 3.84,
      cpu: "2 vCPU",
      cpuNote: "dedicated",
      memory: "2 GB",
      storage: "25 GB NVMe",
      bandwidth: "3 TB",
      uplink: "1 Gbps",
      extra: "8 shards",
      extraLabel: "Sharding",
      backups: "7 daily",
      provision: "12 s",
    },
    {
      sku: "b.8",
      name: "Fleet",
      fit: "Verified bots past 50k guilds, plus a worker tier.",
      price: 9.6,
      priceAnnual: 7.68,
      cpu: "4 vCPU",
      cpuNote: "dedicated",
      memory: "4 GB",
      storage: "50 GB NVMe",
      bandwidth: "6 TB",
      uplink: "2.5 Gbps",
      extra: "Autoshard",
      extraLabel: "Sharding",
      backups: "14 daily",
      provision: "14 s",
    },
  ],
};

/** Rows that are identical across every plan in a family — stated once,
 *  rather than repeated as a checkmark grid. */
export const INCLUDED: Record<Family, [string, string][]> = {
  vps: [
    ["DDoS mitigation", "Always on, 4.2 Tbps scrubbing, no upcharge"],
    ["Network", "10 Gbps uplink, unmetered after quota at 1 Gbps"],
    ["Regions", "Any of 8 — move between them free of charge"],
    ["Access", "Root, KVM console, rescue mode, custom ISO"],
    ["API", "REST + Terraform provider, no rate-limit tiers"],
    ["Support", "Human on chat in < 8 min, median 3 m 40 s"],
    ["Billing", "Hourly, capped at the monthly price. Cancel any hour."],
  ],
  game: [
    ["DDoS mitigation", "Layer 7 game filters for CS2, Rust, MC, FiveM"],
    ["Panel", "Console, file manager, SFTP, scheduled tasks, subusers"],
    ["Regions", "Any of 8 — migration keeps world data and IP"],
    ["Versions", "One-click switch between versions and modpacks"],
    ["Databases", "MariaDB instances included, 2 to 10 by plan"],
    ["Support", "Human on chat in < 8 min, 24/7 including weekends"],
    ["Billing", "Monthly or yearly. Suspend for free out of season."],
  ],
  bot: [
    ["DDoS mitigation", "Inbound filtered; egress to Discord unshaped"],
    ["Deploys", "GitHub push, CLI, REST API or container registry"],
    ["Observability", "Logs, gateway latency, shard state, 30-day retention"],
    ["Regions", "waw1, fra1, ash1 — closest gateway is picked for you"],
    ["Runtime", "Any language; Dockerfile or auto-detected buildpack"],
    ["Support", "Human on chat in < 8 min, plus a public Discord"],
    ["Billing", "Hourly. Scale down between events without penalty."],
  ],
};

export const SPEC_ROWS: {
  key: keyof Plan;
  label: string;
  note?: string;
}[] = [
  { key: "cpu", label: "Processor", note: "cores" },
  { key: "memory", label: "Memory" },
  { key: "storage", label: "Storage", note: "Gen4 NVMe, RAID10" },
  { key: "bandwidth", label: "Bandwidth" },
  { key: "extra", label: "—" },
  { key: "backups", label: "Backups", note: "off-node" },
  { key: "provision", label: "Provision time", note: "measured p95" },
];
