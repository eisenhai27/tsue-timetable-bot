# TDIU Jadval — Telegram bot + Mini App (@tdiujadval_bot)

A free Telegram bot and Mini App for TSUE students, built on the public timetable at <https://tsue.edupage.org/timetable/>.

**What it does**

- **Group chats:** a group leader adds the bot and runs `/setgroup`. The bot then posts the weekly timetable every Sunday at 20:00 and a ➖/➕ alert whenever the timetable changes.
- **Private chat:** students pick their group (or just type it, e.g. `mo 901`). Buttons: 📅 Today · ➡️ Tomorrow · 🗓 Week · ⚙️ Settings (change alerts, weekly post, language).
- **Mini App** (📱 button): fast search for any group, teacher or room, ⭐ favorites, day tabs, "Now / Next" markers, highlighted changes, 🟢 free-room finder. It also works as a normal website and can be added to a phone's home screen like an app.
- **Languages:** Uzbek, Russian and English.

**Costs: $0.** Everything runs on free plans:

| Part | Runs on | What it does |
|---|---|---|
| `scripts/update.mjs`, `scripts/notify.mjs` | GitHub Actions (free for public repos) | Every 15 min: downloads the timetable, detects changes, sends alerts. Sundays: weekly post. |
| `docs/` | GitHub Pages (free) | The Mini App plus small data files (one per group, teacher and room). |
| `worker/worker.mjs` | Cloudflare Workers + D1 (free) | Answers students instantly and stores who is subscribed to which group. |

---

## Setup (about 30 minutes, no coding)

You'll create 3 free accounts: Telegram bot, GitHub and Cloudflare. Keep a notepad open to paste values into.

### 1. Create the Telegram bot

1. In Telegram, open **@BotFather** and send `/newbot`.
2. Name: **TDIU Jadval — darslar va xonalar**, username: **tdiujadval_bot** (already created ✅).
3. Copy the **token** (looks like `123456:ABC-...`). This is your `BOT_TOKEN`. Keep it secret.
4. Make up a long random password, e.g. `k9x2-Tsue-8841-qpZ7-mm31`. This is your `ADMIN_KEY`.

### 2. Put the code on GitHub

1. Sign up at <https://github.com>. Your username is referred to below as `YOURNAME`.
2. Click **+ → New repository**. Name it `tsue-timetable-bot`, choose **Public**, tick **Add a README file**, and click **Create**.
3. On the repository page, click **Add file → Upload files**. Drag **everything inside** the `tsue-timetable-bot` folder into the page (including the `.github` folder), then click **Commit changes**.
   - Tip: the `node_modules` folder is not needed. Don't upload it if you have one.
   - This replaces the README you created in step 2, which is fine.
4. Go to **Settings → Pages**. Under *Build and deployment → Source*, choose **GitHub Actions**.
5. Go to **Settings → Secrets and variables → Actions**.
   - **Secrets** tab → *New repository secret*: add `BOT_TOKEN` and `ADMIN_KEY`.
   - **Variables** tab → *New repository variable*: add `SITE_URL` = `https://YOURNAME.github.io/tsue-timetable-bot`
6. Go to the **Actions** tab. If asked, click **I understand my workflows, go ahead and enable them**. Open **Timetable** in the left panel and click **Run workflow**. After 1–2 minutes the run should show a green ✓.
7. Open `https://YOURNAME.github.io/tsue-timetable-bot/` in your browser. You should see the Mini App with real TSUE data. 🎉

### 3. Create the Cloudflare Worker (the bot's "brain")

1. Sign up at <https://dash.cloudflare.com> (free, no card needed).
2. **Create the database:** in the left menu, go to **Storage & Databases → D1 SQL Database → Create**. Name it `tsue-bot` and click **Create**. You don't need to create any tables; the bot does that itself.
3. **Create the Worker:** go to **Compute (Workers) → Workers & Pages → Create → Start with Hello World**. Name it `tsue-timetable-bot` and click **Deploy**.
4. Click **Edit code**. Delete everything in the editor, paste the whole content of `dist/worker.js` from this project, and click **Deploy**.
5. Open the Worker's **Settings**:
   - **Bindings → Add → D1 database:** variable name `DB`, database `tsue-bot`, then **Add binding**.
   - **Variables and Secrets → Add:**
     - `BOT_TOKEN`: type **Secret**, your bot token
     - `ADMIN_KEY`: type **Secret**, your password
     - `SITE_URL`: type **Text**, `https://YOURNAME.github.io/tsue-timetable-bot`
   - Click **Deploy** if asked.
6. Copy the Worker address shown at the top, e.g. `https://tsue-timetable-bot.YOURNAME.workers.dev`.
7. Open this link in your browser, using your own address and password:
   `https://tsue-timetable-bot.YOURNAME.workers.dev/setup?key=YOUR_ADMIN_KEY`
   You should see `"ok": true` and "All set!". This connects Telegram to your Worker and sets up the menu button and commands.

### 4. Connect GitHub to the Worker

In GitHub, go to **Settings → Secrets and variables → Actions → Variables** and add:
`WORKER_URL` = `https://tsue-timetable-bot.YOURNAME.workers.dev`

### 5. Try it

- Open your bot in Telegram, press **Start**, pick a language, then pick a group.
- Tap **📱 Ilovani ochish** to open the Mini App.
- **In a group chat:** add the bot, make it an admin, and send `/setgroup`. The bot posts the current week right away.
- Test the weekly post early: **Actions → Timetable → Run workflow**, tick *Also send the weekly timetable post now*.

### Optional

- **A/B weeks:** some lessons run only in "Week A" or "Week B". By default both are shown with an A/B label. If you know that, for example, the week of 7 September 2026 is Week A, add a GitHub variable `WEEK_A_MONDAY` = `2026-09-07`. Then each week only shows the lessons that apply to it.
- **Profile picture and description:** in @BotFather use `/setuserpic`, `/setdescription` and `/setabouttext`.
- **Statistics:** send a request with the header `X-Admin-Key: YOUR_ADMIN_KEY` to `https://…workers.dev/internal/stats` to see how many chats use the bot.

---

## How it works

```
EduPage ──(every 15 min)──> GitHub Action: update.mjs ──> docs/data/*.json ──> GitHub Pages (Mini App + data)
                                   │                                                  ▲
                                   └─ changes? ─> notify.mjs ──> Telegram (alerts)    │ reads small files
                                                     │ asks "who is subscribed?"      │
Students ──> Telegram ──webhook──> Cloudflare Worker (buttons, /today, /setgroup) ────┘
                                         └──> D1 database (chats and their groups)
```

- **Why this split:** the full EduPage file is ~8 MB. That's too heavy for Cloudflare's free plan to process on each request, but easy for GitHub Actions. The Worker only reads small per-group files (~1–2 KB each).
- **Faculties and years** come from the order of EduPage's class list: headers like `MENEJMENT FAKULTETI` and `2 KURS`. Search always works, even if a header in EduPage is unusual.
- **Group IDs** are made from the group name, so subscriptions survive when TSUE publishes a new timetable version.
- **Safety checks:**
  - If EduPage returns a broken or partial file (fewer than half the groups), nothing is changed and no alerts are sent.
  - The first run never sends alerts.
  - Chats that blocked or removed the bot are cleaned up automatically.

## Limits (free plans)

- **Cloudflare Workers:** 100,000 requests/day. Each student tap is one request, so that's enough for tens of thousands of daily users.
- **Cloudflare D1:** 5 GB storage and 5 million row reads/day. One row per chat, so 52,000 students is tiny.
- **Telegram:** about 30 messages/second. The weekly post to ~2,000 group chats takes about 1–2 minutes.
- **GitHub Actions:** unlimited minutes for public repositories. Scheduled runs can start a few minutes late. GitHub pauses schedules if a repo has no activity for 60 days, but timetable updates count as activity. If it ever pauses, click **Enable workflow** in the Actions tab.

## Troubleshooting

| Problem | Fix |
|---|---|
| Action fails at *Download timetable* | EduPage may be down. It retries automatically every 15 minutes. If it keeps failing for hours, EduPage may be blocking GitHub's servers. Tell the developer. |
| Bot doesn't answer | Open the `/setup?key=…` link again. Check that `BOT_TOKEN`, `ADMIN_KEY`, `SITE_URL` and the `DB` binding are set on the Worker. |
| Bot answers "Couldn't load the timetable" | `SITE_URL` is wrong, or the first Action run hasn't finished yet. Open `SITE_URL/data/index.json` in a browser to check. |
| Mini App button missing | `SITE_URL` must start with `https://`. Open `/setup?key=…` again. |
| No alerts or weekly posts | Check the GitHub variable `WORKER_URL` and the secrets `BOT_TOKEN` and `ADMIN_KEY`. The `ADMIN_KEY` must be the same in GitHub and Cloudflare. |

## For developers

```bash
npm install
node tests/unit.mjs                         # builder + formatting tests
node scripts/update.mjs                     # download & build docs/data (needs access to tsue.edupage.org)
npx wrangler dev                            # run the Worker locally (see tests/bot-flow.mjs for a simulated chat)
npm run build                               # regenerate dist/worker.js after editing worker/ or src/
```

This bot is a student project and is not affiliated with TSUE or EduPage. It only reads the public timetable.
