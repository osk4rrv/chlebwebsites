export type Block =
  | { t: "p"; text: string }
  | { t: "h"; text: string }
  | { t: "ul"; items: string[] }
  | { t: "code"; lang: string; code: string; file?: string }
  | { t: "note"; text: string }
  | { t: "table"; head: string[]; rows: string[][] };

export interface Article {
  slug: string;
  title: string;
  group: string;
  summary: string;
  updated: string;
  read: string;
  blocks: Block[];
}

export const DOC_GROUPS = [
  "Getting started",
  "Compute",
  "Game servers",
  "Bot hosting",
  "Network",
  "API reference",
];

export const ARTICLES: Article[] = [
  {
    slug: "quickstart",
    title: "Deploy your first server",
    group: "Getting started",
    summary:
      "From an empty account to a reachable server, using either the panel or the CLI.",
    updated: "2026-08-30",
    read: "4 min",
    blocks: [
      {
        t: "p",
        text: "Every Asterza product is created the same way: pick a region, pick a plan, pick an image. The panel and the API are the same surface — the panel calls the public API and nothing else, so anything you can click you can script.",
      },
      { t: "h", text: "Install the CLI" },
      {
        t: "code",
        lang: "shell",
        code: `curl -fsSL https://get.asterza.host | sh
asterza auth login --token $ASTERZA_TOKEN
asterza regions list`,
      },
      {
        t: "p",
        text: "Tokens are created under Account, then API tokens. A token is scoped to one project and carries either read or write intent; write tokens can be pinned to a single product family.",
      },
      { t: "h", text: "Create an instance" },
      {
        t: "code",
        lang: "shell",
        code: `asterza vps create \\
  --plan v.4 \\
  --region waw1 \\
  --image debian-13 \\
  --ssh-key ~/.ssh/id_ed25519.pub \\
  --hostname edge-01 \\
  --wait`,
      },
      {
        t: "p",
        text: "With --wait the command blocks until the instance reports running and returns its addresses. Typical wall-clock time is 34 to 41 seconds; the majority of that is image expansion, not queueing.",
      },
      {
        t: "code",
        lang: "text",
        code: `id        vps_8c41f9e2
state     running        (38.4s)
region    waw1           Warsaw, PL
plan      v.4            4 vCPU / 8 GB / 120 GB NVMe
ipv4      194.181.44.117
ipv6      2a13:4f80:1e::1/64
ssh       ssh root@194.181.44.117`,
      },
      { t: "h", text: "What is configured for you" },
      {
        t: "ul",
        items: [
          "SSH hardened: password auth off, root key-only, fail2ban primed",
          "IPv6 routed and reachable, reverse DNS editable from the panel",
          "Nightly off-node backup scheduled at a random minute in your window",
          "DDoS mitigation active before the instance is even reachable",
          "Serial and VNC console available immediately, no ticket needed",
        ],
      },
      {
        t: "note",
        text: "If a deploy takes longer than 90 seconds it has failed, not stalled. Run `asterza events tail --resource <id>` to see exactly which step returned an error.",
      },
    ],
  },
  {
    slug: "authentication",
    title: "Authentication and tokens",
    group: "Getting started",
    summary: "Token scopes, rotation, and how to keep CI out of production.",
    updated: "2026-08-12",
    read: "3 min",
    blocks: [
      {
        t: "p",
        text: "The API accepts a bearer token on every request. There are no API keys with secrets in query strings, and there is no session cookie path for machine access.",
      },
      {
        t: "code",
        lang: "shell",
        code: `curl https://api.asterza.host/v1/instances \\
  -H "Authorization: Bearer $ASTERZA_TOKEN"`,
      },
      { t: "h", text: "Scopes" },
      {
        t: "table",
        head: ["Scope", "Grants", "Typical holder"],
        rows: [
          ["read", "List and inspect every resource in the project", "Dashboards, monitoring"],
          ["write", "Create, resize, restart, delete", "Terraform, deploy jobs"],
          ["console", "Open serial and VNC sessions", "On-call humans"],
          ["billing", "Read invoices and usage", "Finance integrations"],
        ],
      },
      {
        t: "p",
        text: "Tokens never expire by default but can be given a TTL of between one hour and one year. Rotation is atomic: creating a replacement does not invalidate the old token until you revoke it, so there is no deploy window where both are dead.",
      },
      {
        t: "note",
        text: "Every token action is written to the project audit log with the source address and user agent. Revoking a token kills in-flight console sessions immediately.",
      },
    ],
  },
  {
    slug: "instances",
    title: "Instance lifecycle",
    group: "Compute",
    summary: "States, resizing, live migration and what a reboot actually does.",
    updated: "2026-08-24",
    read: "5 min",
    blocks: [
      {
        t: "p",
        text: "An instance moves through a small, explicit set of states. Anything unexpected surfaces as an event on the resource rather than a silent retry.",
      },
      {
        t: "table",
        head: ["State", "Meaning", "Billable"],
        rows: [
          ["provisioning", "Volume being written, network not yet attached", "No"],
          ["running", "Guest booted, watchdog answering", "Yes, hourly"],
          ["stopped", "Guest halted, volume and address retained", "Storage only"],
          ["migrating", "Live-migrating to another host, no downtime", "Yes, hourly"],
          ["rebuilding", "Image being reapplied, data discarded", "Yes, hourly"],
          ["archived", "Volume snapshotted, addresses released", "Storage only"],
        ],
      },
      { t: "h", text: "Resizing" },
      {
        t: "p",
        text: "CPU and memory resize in both directions and require one reboot, typically 12 to 20 seconds. Disk grows online and never shrinks — if you need a smaller volume, snapshot and rebuild.",
      },
      {
        t: "code",
        lang: "shell",
        code: `asterza vps resize vps_8c41f9e2 --plan v.8
asterza vps disk grow vps_8c41f9e2 --to 320G`,
      },
      { t: "h", text: "Host maintenance" },
      {
        t: "p",
        text: "Host kernel and microcode updates are applied by live-migrating guests to a drained node. You will see a migrating event and, on a busy database, a sub-second pause at cutover. We do not schedule customer-visible reboots for host maintenance.",
      },
    ],
  },
  {
    slug: "images",
    title: "Images and custom ISOs",
    group: "Compute",
    summary: "Supported distributions, cloud-init, and booting your own media.",
    updated: "2026-07-19",
    read: "3 min",
    blocks: [
      {
        t: "p",
        text: "Base images are rebuilt weekly from upstream and are minimal: no monitoring agent, no vendor repository, no telemetry. Only cloud-init and the qemu guest agent are added.",
      },
      {
        t: "ul",
        items: [
          "Debian 12, 13 · Ubuntu 22.04, 24.04, 26.04 LTS",
          "AlmaLinux 9, 10 · Rocky 9, 10 · Fedora 42",
          "Alpine 3.20, 3.21 · Arch (rolling) · NixOS 25.11",
          "Windows Server 2022, 2025 (licence billed separately)",
        ],
      },
      { t: "h", text: "cloud-init" },
      {
        t: "code",
        lang: "yaml",
        file: "user-data.yaml",
        code: `#cloud-config
package_update: true
packages: [ufw, podman]
runcmd:
  - ufw allow 22/tcp && ufw --force enable
  - podman run -d --restart=always ghcr.io/acme/api:1.8.2`,
      },
      {
        t: "code",
        lang: "shell",
        code: `asterza vps create --plan v.4 --region fra1 \\
  --image ubuntu-26.04 --user-data ./user-data.yaml`,
      },
      {
        t: "note",
        text: "Custom ISOs are mounted over virtual media and boot in UEFI or legacy mode. Upload once per project; the image is stored free up to 12 GB.",
      },
    ],
  },
  {
    slug: "game-panel",
    title: "Running a game server",
    group: "Game servers",
    summary: "Console, versions, mods, schedules and world migrations.",
    updated: "2026-08-28",
    read: "4 min",
    blocks: [
      {
        t: "p",
        text: "Game servers run in containers on high-clock nodes with a persistent volume. The panel exposes the process directly: the console you type into is the server's stdin, not a wrapper.",
      },
      { t: "h", text: "Switching version or modpack" },
      {
        t: "p",
        text: "Version changes stop the process, swap the runtime, and keep your world and configuration on the volume. A snapshot is taken automatically before the swap so a bad modpack is one click away from being undone.",
      },
      {
        t: "code",
        lang: "shell",
        code: `asterza game version set srv_2f81 --runtime paper --mc 1.21.8
asterza game mod add srv_2f81 --modrinth fabric-api@0.115.1
asterza game restart srv_2f81 --reason "modpack bump"`,
      },
      { t: "h", text: "Schedules" },
      {
        t: "ul",
        items: [
          "Cron-style restarts with in-game warnings at 15, 5 and 1 minute",
          "Backups before every scheduled restart, retained per plan",
          "Command hooks on start, stop, crash and player-count thresholds",
        ],
      },
      {
        t: "note",
        text: "Migrating a server to another region keeps the connection address. DNS is ours, the IP changes behind it, and existing players reconnect without editing anything.",
      },
    ],
  },
  {
    slug: "bot-deploys",
    title: "Deploying a Discord bot",
    group: "Bot hosting",
    summary: "Buildpacks, Dockerfiles, secrets and zero-downtime restarts.",
    updated: "2026-09-01",
    read: "5 min",
    blocks: [
      {
        t: "p",
        text: "Connect a repository and every push to the tracked branch builds and rolls out. If a Dockerfile is present it is used verbatim; otherwise the language is detected from the manifest.",
      },
      {
        t: "code",
        lang: "yaml",
        file: "asterza.yaml",
        code: `name: moderation-bot
runtime: auto            # or: docker
region: waw1
plan: b.4
start: node dist/index.js
build: npm ci && npm run build
health:
  gateway: true          # ready when the shard reports READY
  timeout: 45s
restart:
  policy: on-crash
  backoff: 5s..2m
env:
  - DISCORD_TOKEN         # from secrets, never in the repo
  - DATABASE_URL`,
      },
      { t: "h", text: "Sharding" },
      {
        t: "p",
        text: "On Sharded and Fleet plans we read the recommended shard count from Discord's gateway endpoint and pass SHARD_ID and SHARD_COUNT into each process. Scaling up adds processes and re-identifies gradually to stay inside the identify rate limit.",
      },
      {
        t: "code",
        lang: "shell",
        code: `asterza bot logs moderation-bot --since 15m --shard 3
asterza bot scale moderation-bot --shards 8
asterza bot exec moderation-bot -- node scripts/reindex.js`,
      },
      { t: "h", text: "What we watch for you" },
      {
        t: "table",
        head: ["Signal", "Retention", "Alerts on"],
        rows: [
          ["Gateway latency", "30 days", "> 400 ms for 2 min"],
          ["Shard state", "30 days", "any shard not READY for 60 s"],
          ["Memory", "30 days", "> 90% of plan for 5 min"],
          ["Restart count", "90 days", "3 crashes in 10 min"],
          ["Rate limit hits", "30 days", "429 on any bucket"],
        ],
      },
      {
        t: "note",
        text: "Crash loops are held after five consecutive failures rather than retried forever. The build that last worked stays deployed until you push a fix.",
      },
    ],
  },
  {
    slug: "firewall",
    title: "Firewall and DDoS behaviour",
    group: "Network",
    summary: "What is filtered at the edge, and what you still control.",
    updated: "2026-08-06",
    read: "4 min",
    blocks: [
      {
        t: "p",
        text: "Mitigation is always on and cannot be disabled. Detection happens on-net from flow telemetry, typically within 400 ms, and traffic is scrubbed at the edge rather than routed to a third party.",
      },
      {
        t: "table",
        head: ["Layer", "Handled by", "Configurable"],
        rows: [
          ["Volumetric (L3/L4)", "Edge scrubbing, 4.2 Tbps", "No — always on"],
          ["Protocol abuse", "Per-protocol validators", "Profile per port"],
          ["Game protocols", "CS2, Rust, MC, FiveM, Source filters", "Yes"],
          ["Application (L7)", "Your stack, or our reverse proxy", "Yes"],
          ["Egress", "Unshaped", "Rate limits on request"],
        ],
      },
      { t: "h", text: "Cloud firewall" },
      {
        t: "code",
        lang: "shell",
        code: `asterza fw create web --default-deny
asterza fw rule add web --in tcp/443 --from any
asterza fw rule add web --in tcp/22  --from 5.173.0.0/16
asterza fw attach web vps_8c41f9e2`,
      },
      {
        t: "p",
        text: "Rules are enforced outside the guest, so a compromised instance cannot remove them. Changes apply in under two seconds across every attached resource.",
      },
    ],
  },
  {
    slug: "api-instances",
    title: "Instances API",
    group: "API reference",
    summary: "REST endpoints, pagination, idempotency and error shapes.",
    updated: "2026-09-03",
    read: "6 min",
    blocks: [
      {
        t: "p",
        text: "Base URL is https://api.asterza.host/v1. All bodies are JSON. Timestamps are RFC 3339 in UTC. Money is an integer of minor units plus a currency code — never a float.",
      },
      {
        t: "table",
        head: ["Method", "Path", "Notes"],
        rows: [
          ["GET", "/instances", "Cursor paginated, 100 per page"],
          ["POST", "/instances", "Accepts Idempotency-Key"],
          ["GET", "/instances/{id}", "Includes live metrics when ?metrics=1"],
          ["PATCH", "/instances/{id}", "Rename, retag, change backup window"],
          ["POST", "/instances/{id}/resize", "Body: { plan }"],
          ["POST", "/instances/{id}/actions", "start · stop · reboot · rebuild"],
          ["DELETE", "/instances/{id}", "Optional ?keep_snapshot=1"],
        ],
      },
      {
        t: "code",
        lang: "shell",
        code: `curl -X POST https://api.asterza.host/v1/instances \\
  -H "Authorization: Bearer $ASTERZA_TOKEN" \\
  -H "Idempotency-Key: 9f2c-deploy-edge-01" \\
  -d '{
        "plan":   "v.8",
        "region": "waw1",
        "image":  "debian-13",
        "hostname": "edge-01",
        "ssh_keys": ["key_41ab"],
        "backups": { "window": "02:00-04:00" }
      }'`,
      },
      { t: "h", text: "Errors" },
      {
        t: "code",
        lang: "json",
        code: `{
  "error": {
    "code": "region_capacity_exhausted",
    "message": "waw1 has no v.16 capacity for the next ~40 minutes.",
    "retry_after": 2400,
    "alternatives": ["fra1", "ams1"],
    "request_id": "req_01K4Z8QW3H"
  }
}`,
      },
      {
        t: "p",
        text: "Errors always carry a machine code, a human message, and a request id you can quote to support. Where a failure has an obvious workaround, the payload names it.",
      },
      {
        t: "note",
        text: "Rate limits are 600 requests per minute per token, 60 for write endpoints. Limits are per token, not per account, and are not sold as a tier.",
      },
    ],
  },
];

export const CODE_TABS = [
  {
    id: "cli",
    label: "CLI",
    lang: "shell",
    code: `$ asterza vps create --plan v.8 --region waw1 \\
      --image debian-13 --hostname api-01 --wait

  ok image      debian-13 (2.1 GB)         1.8s
  ok volume     240 GB NVMe RAID10         9.4s
  ok network    194.181.44.117 · /64       2.2s
  ok mitigation profile: default           0.3s
  ok boot       kernel 6.12.9             24.9s

  vps_8c41f9e2 running in 38.6s`,
  },
  {
    id: "terraform",
    label: "Terraform",
    lang: "hcl",
    code: `resource "asterza_instance" "api" {
  count    = 3
  plan     = "v.8"
  region   = "waw1"
  image    = "debian-13"
  hostname = "api-\${count.index + 1}"

  ssh_keys = [asterza_ssh_key.ci.id]
  firewall = asterza_firewall.web.id

  backups {
    window    = "02:00-04:00"
    retention = 14
  }
}`,
  },
  {
    id: "api",
    label: "REST",
    lang: "js",
    code: `const res = await fetch("https://api.asterza.host/v1/instances", {
  method: "POST",
  headers: {
    Authorization: \`Bearer \${process.env.ASTERZA_TOKEN}\`,
    "Idempotency-Key": "deploy-api-01",
  },
  body: JSON.stringify({
    plan: "v.8",
    region: "waw1",
    image: "debian-13",
    hostname: "api-01",
  }),
});

const { id, ipv4 } = await res.json();`,
  },
];
