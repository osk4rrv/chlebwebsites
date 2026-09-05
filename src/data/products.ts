import type { Family } from "./plans";

export interface ProductPageData {
  eyebrow: string;
  /** Label for the primary CTA — written out, not derived from the nav name. */
  cta: string;
  h1: string;
  h1sub: string;
  lead: string;
  /** Short spec strip shown under the hero. */
  strip: [string, string][];
  /** The argument for this product, in two parts. */
  argument: { title: string; body: string; points: [string, string][] };
  /** A catalogue block — images, games, runtimes. */
  catalogue: { title: string; note: string; items: string[] };
  /** Operational detail, stated flatly. */
  detail: { title: string; rows: [string, string][] };
}

export const PRODUCT_PAGES: Record<Family, ProductPageData> = {
  vps: {
    eyebrow: "8 regions · provisioning open",
    cta: "Deploy a server",
    h1: "Virtual servers with cores that are actually yours.",
    h1sub: "",
    lead:
      "KVM instances on AMD EPYC 9354P with every vCPU pinned to a physical core, DDR5 ECC memory and Gen4 NVMe in RAID10. Root from the first second, an out-of-band console when you lock yourself out, and an API that does everything the panel does.",
    strip: [
      ["Silicon", "AMD EPYC 9354P · 32c/64t"],
      ["Memory", "DDR5-4800 ECC registered"],
      ["Storage", "Gen4 NVMe RAID10 · 3.1 GB/s"],
      ["Network", "10 Gbps · AS204213"],
      ["Provision", "38 s p95"],
    ],
    argument: {
      title: "Oversubscription is the only reason cheap hosting feels slow.",
      body:
        "Most providers sell the same core to four customers and call the result a vCPU. Your benchmark looks fine at 3am and falls apart at peak, and support tells you to optimise your code. We size a node so that every sold vCPU has a physical core behind it, publish a steal-time target, and pull nodes out of the sales pool before they get close to it.",
      points: [
        ["Steal time", "Target under 0.5% at p99, measured per node and visible in your panel"],
        ["Memory", "ECC, never ballooned, never swapped to disk behind your back"],
        ["Disk", "RAID10 with a hot spare, so a failed drive is a rebuild and not an incident"],
        ["Maintenance", "Host kernel updates are live-migrated — a 0.3 s pause, not a reboot email"],
      ],
    },
    catalogue: {
      title: "Images",
      note: "Rebuilt weekly from upstream. Minimal: cloud-init and the guest agent, nothing else.",
      items: [
        "Debian 12 · 13",
        "Ubuntu 22.04 · 24.04 · 26.04 LTS",
        "AlmaLinux 9 · 10",
        "Rocky Linux 9 · 10",
        "Fedora 42",
        "Alpine 3.20 · 3.21",
        "Arch Linux (rolling)",
        "NixOS 25.11",
        "Windows Server 2022 · 2025",
        "Custom ISO (UEFI or legacy)",
      ],
    },
    detail: {
      title: "Operational detail",
      rows: [
        ["Addressing", "One IPv4 and a routed /64 by default; /48 on Fleet, extra v4 at €1.20/mo"],
        ["Console", "Serial and VNC in the browser, plus rescue boot from a live image"],
        ["Snapshots", "Manual snapshots kept as long as you like, billed at €0.04/GB/mo"],
        ["Backups", "Nightly off-node, 7 or 14 days by plan, self-serve restore in place"],
        ["Resize", "CPU and memory both directions with one reboot; disk grows online"],
        ["Migration", "Between any two regions, free, with the volume copied and verified"],
        ["Billing", "Hourly at €0.0079 and up, capped at the monthly price of the plan"],
      ],
    },
  },

  game: {
    eyebrow: "Ryzen 9 7950X · 5.7 GHz · 8 regions",
    cta: "Deploy a game server",
    h1: "Game servers that hold their tick rate.",
    h1sub: "",
    lead:
      "Game simulation is single-threaded, so core count is the wrong thing to buy. We run game workloads on Ryzen 9 7950X at 5.7 GHz with fast DDR5 and Gen4 NVMe, and we keep the player-to-core ratio low enough that a busy evening looks like a quiet one on your graphs.",
    strip: [
      ["Silicon", "Ryzen 9 7950X · 5.7 GHz"],
      ["Memory", "DDR5-6000"],
      ["Storage", "Gen4 NVMe"],
      ["Mitigation", "Game-aware L4 + L7 filters"],
      ["Provision", "22 s p95"],
    ],
    argument: {
      title: "Lag is almost never the plugin's fault.",
      body:
        "When a Minecraft server drops to 14 TPS the usual advice is to remove mods. Nine times out of ten the real cause is a host running twelve servers on eight shared threads. High clocks and honest allocation fix the class of problem that no amount of config tuning will. We publish MSPT and tick history per server so you can see which one you are dealing with.",
      points: [
        ["Clock over cores", "5.7 GHz boost sustained, because the main loop cannot be parallelised"],
        ["Tick telemetry", "TPS, MSPT and chunk counts retained for 30 days, per server"],
        ["Filters", "Protocol-aware mitigation for Source, Minecraft, Rust and FiveM traffic"],
        ["Restarts", "Scheduled with in-game warnings and an automatic snapshot beforehand"],
      ],
    },
    catalogue: {
      title: "Supported games",
      note: "One-click version and modpack switching. Anything not listed runs fine on a VPS with full root.",
      items: [
        "Minecraft — Vanilla, Paper, Fabric, Forge, Purpur",
        "Counter-Strike 2",
        "Rust",
        "Palworld",
        "Valheim",
        "ARK: Survival Ascended",
        "Garry's Mod",
        "FiveM / RedM",
        "Terraria (tModLoader)",
        "Satisfactory",
        "7 Days to Die",
        "Project Zomboid",
      ],
    },
    detail: {
      title: "Operational detail",
      rows: [
        ["Panel", "Console with real stdin, file manager, SFTP, subusers with scoped roles"],
        ["Schedules", "Cron restarts and command hooks on start, crash and player thresholds"],
        ["Backups", "Before every scheduled restart plus daily, restore without losing the world"],
        ["Databases", "MariaDB instances included, two on Pocket up to ten on Network"],
        ["Migration", "Region change keeps the connect address; players reconnect unchanged"],
        ["Suspension", "Pause a server out of season at no cost and keep the data"],
        ["Billing", "Monthly or yearly at −20%; no per-slot upsell, slots are part of the plan"],
      ],
    },
  },

  bot: {
    eyebrow: "waw1 · fra1 · ash1 · gateway-aware",
    cta: "Deploy a bot",
    h1: "Discord bots that stay up without you watching.",
    h1sub: "",
    lead:
      "Connect a repository and we build it, run it, restart it when it crashes and keep thirty days of logs, gateway latency and shard state. Sharding is handled from Discord's recommended count, so a bot that grows past fifty thousand guilds does not need rewriting.",
    strip: [
      ["Runtime", "Any language · Dockerfile or buildpack"],
      ["Deploy", "GitHub push · CLI · REST"],
      ["Sharding", "Automatic, identify-rate aware"],
      ["Retention", "30 days of logs and metrics"],
      ["Provision", "9 s p95"],
    ],
    argument: {
      title: "A bot process is not a website, so it should not be hosted like one.",
      body:
        "Bots hold a long-lived websocket, care about identify rate limits and die quietly in ways an HTTP health check will never notice. Our health check is the gateway itself: a deploy is only considered good when the shard reports READY, and a crash loop is held after five failures instead of being retried into oblivion while the last working build is already gone.",
      points: [
        ["Gateway health", "Readiness is READY on the shard, not a port that happens to be open"],
        ["Crash policy", "Exponential backoff, then hold — the last good build stays deployed"],
        ["Shard scaling", "Processes added gradually to respect the identify bucket"],
        ["Secrets", "Injected at runtime, never written to the image or the repository"],
      ],
    },
    catalogue: {
      title: "Runtimes",
      note: "Detected from your manifest, or bring a Dockerfile and we build it verbatim.",
      items: [
        "Node.js 20 · 22 · 24 (discord.js, Eris)",
        "Python 3.11 – 3.14 (discord.py, hikari)",
        "Go 1.23 – 1.25 (discordgo)",
        "Java 17 · 21 · 25 (JDA)",
        "Rust (serenity, twilight)",
        ".NET 8 · 9 (Discord.Net)",
        "Bun 1.2",
        "Any Dockerfile",
      ],
    },
    detail: {
      title: "Operational detail",
      rows: [
        ["Builds", "Cached layers, typical rebuild 18 s; build logs streamed live"],
        ["Rollback", "Any previous build redeployed in one action, images kept 30 days"],
        ["Exec", "One-off commands and migrations against the running container"],
        ["Storage", "A persistent volume per bot, plus optional managed Postgres from €3/mo"],
        ["Alerts", "Email or webhook on crash loops, shard disconnects and memory pressure"],
        ["Regions", "waw1, fra1 or ash1 — we pick the closest Discord gateway for you"],
        ["Billing", "Hourly from €0.0016; scale down between events with no penalty"],
      ],
    },
  },
};
