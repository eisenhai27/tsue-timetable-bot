# TDIU Jadval — Telegram bot + Mini App (@tdiujadval_bot)

A free Telegram bot and Mini App for TSUE students, built on the public timetable at <https://tsue.edupage.org/timetable/>.

**What it does**

- **Group chats:** a group leader adds the bot and runs `/setgroup`. The bot then posts "tomorrow's classes" once a day at the set time (default 21:00; on Sundays the weekly timetable post at 20:00 takes its place) and — outside that schedule — an extra ➖/➕ alert only when the timetable actually changes.
- **Private chat:** students pick their group (or just type it, e.g. `mo 901`). Buttons: 📅 Today · ➡️ Tomorrow · 🗓 Week · 🔎 Where is the teacher? · 🟢 Free rooms · 📱 App · ⚙️ Settings (change alerts, weekly post, language). Lessons are shown as small cards (time, type colour, room, teacher).
- **🔎 Where is the teacher?** (button, `/where` or `/ustoz`, also works in group chats): the buttons of **your own group's teachers come first** (read from the group's timetable, busiest first; in a group chat too), or type any surname — the bot says whether that teacher is in class right now (room, subject, groups, time left), otherwise where and when the next class is, plus the day's plan. Links like `t.me/<bot>?start=w_<teacherId>` share one teacher's card.
- **Mini App** (📱 button): fast search for any group, teacher or room, ⭐ favorites, day tabs, a live "Now / Next" line (subject · room · time) under the header, highlighted changes, 🟢 free-room finder and the **📍 Teacher tab** (starts with "my teachers" — the ones who teach your group —, then live status, big room, countdown, day plan, share link). It opens on the next day that has classes once today's are over, refreshes itself every minute, and paints instantly from the last visit's cached copy (works offline too). It also works as a normal website and can be added to a phone's home screen like an app.
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

### 5. Make the 15-minute check reliable (recommended)

GitHub's own `schedule:` trigger is "best effort" — on a quiet public repo it can silently go
hours without firing instead of every 15 minutes. To fix this, Cloudflare's own Cron Trigger
(reliable, free) pings the GitHub Action awake on schedule instead of relying on GitHub alone:

1. On [github.com/settings/tokens?type=beta](https://github.com/settings/tokens?type=beta),
   click **Generate new token** (fine-grained). Set **Repository access** to only this repo,
   and under **Permissions → Actions** choose **Read and write**. Copy the token.
2. In the Cloudflare Worker → **Settings → Variables and Secrets → Add**:
   - `GITHUB_PAT`: type **Secret**, paste the token from step 1
   - `GITHUB_REPO`: type **Text**, `YOURNAME/tsue-timetable-bot`
3. Worker → **Settings → Trigger Events → Cron Trigger → Add Cron Trigger**. Use `*/10 * * * *`
   (every 10 minutes).

That's it — Cloudflare will now nudge GitHub Actions awake every 10 minutes, on top of GitHub's
own (unreliable) 15-minute schedule, so changes get caught quickly and consistently.

### 6. Try it

- Open your bot in Telegram, press **Start**, pick a language, then pick a group.
- Tap **📱 Ilovani ochish** to open the Mini App, or **🔎 Ustoz qayerda?** and type a teacher's surname.
- **In a group chat:** add the bot, make it an admin, and send `/setgroup`. The bot posts the current week right away.
- Test the weekly post early: **Actions → Timetable → Run workflow**, tick *Also send the weekly timetable post now*.

### Optional

- **Upper/lower weeks (Yuqori / Quyi):** some lessons run only every second week (EduPage "10" = upper = Week A, "01" = lower = Week B). The 2026/2027 university calendar alternates strictly every week starting with the upper week of 31 August 2026, so `scripts/update.mjs` has that built in (`DEFAULT_WEEK_A`) and each week only shows the lessons that apply to it. For another academic year set the GitHub variable `WEEK_A_MONDAY` to the Monday of an upper week (e.g. `2027-08-30`); without it the bot falls back to showing both kinds labelled.
- **Profile picture and description:** in @BotFather use `/setuserpic`, `/setdescription` and `/setabouttext`.
- **Statistics:** send a request with the header `X-Admin-Key: YOUR_ADMIN_KEY` to `https://…workers.dev/internal/stats` to see how many chats use the bot.
- **Get feedback as DMs:** message [@userinfobot](https://t.me/userinfobot) on Telegram to get your own numeric id, start this bot yourself if you haven't, then in the Cloudflare Worker → **Settings → Variables and Secrets → Add** a `ADMIN_CHAT_ID` text variable with that number. Every `/feedback` message is then forwarded to you instantly, on top of being stored for the stats workflow.

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

- **Students and teachers:** at `/start` the bot asks "Student / Teacher". A student picks a group, a teacher picks their name from the EduPage teacher list (letter buttons or type the surname; `/teacher` switches). Teachers get the same Today / Tomorrow / Week views (the week as a picture too), change alerts and reminders — `chats.role` is `student` or `teacher` and the chosen id sits in `group_id` either way. Teacher pictures are drawn into `docs/img/t/`.
- **Daily "tomorrow's classes" message:** every chat has its own time (`chats.remind_at`, minutes after midnight in Tashkent time, default **21:00**, `-1` = off). Group chats get the full list of tomorrow's classes, private chats a short "first class" ping; free days stay silent (on Sundays a group that gets the weekly post skips it, so a group never gets two scheduled messages in a day). Each chat is served at most once a day, even if a run crashes half-way and the next one picks up where it stopped (`state.json` keeps a short keyed hash per chat served today). A group admin (or anyone in a private chat) changes the time with `/time` (buttons) or `/time 20:30`, `/time off`. `notify.mjs auto` serves each chat once at its time; `docs/data/state.json` (`tmr`) remembers how far today's run has got.
- **Where is the teacher? (`whereIs` in `src/shared.mjs`):** one pure function used by the bot and mirrored in the Mini App (a test compares both). State is *in class* / *between classes* / *day not started* / *classes over* / *no classes today*, plus the next lesson start (today, or the next teaching day within two weeks); alternating weeks are resolved. The answer is based on the official timetable, so it says so.
- **Reply keyboard upgrade:** the private-chat keyboard has a version (`chats.kbv`, `KB_VERSION` in the Worker). When the layout changes, each user's next message quietly swaps in the new keyboard once.
- **Mini App caching:** every data file is kept in memory and `localStorage` (`ttc:*`, the last 24 timetable files) — stale-while-revalidate: the screen paints from the cache at once, the network copy replaces it softly if it differs. `sw.js` (browser use) serves the shell from cache and falls back to cached data after 3.5 s.
- **Subject names in Russian / English:** EduPage's names are Uzbek. `docs/data/subjects.json` (`{ "<Uzbek name>": [ru, en] }`) is used by the bot, the alerts and the Mini App when the chat's language is ru/en; the weekly *picture* stays Uzbek, so ru/en chats get the text version of the week. When a new subject appears, `update.mjs` prints a warning ("no ru/en translation yet") — add it to `subjects.json` (unknown names are simply shown in Uzbek).
- **Answering feedback:** every `/feedback` message is forwarded to `ADMIN_CHAT_ID`; **Reply** to that message in Telegram and the answer is delivered to the author in their language (`/reply <chat_id> text` works too).
- **Admin statistics:** send `/stats` from the `ADMIN_CHAT_ID` account (it also appears in that account's command menu only): total / new / active users, what people use most (today and 7 days), top groups, languages, feedback — with a 🔄 refresh button. Anyone else gets the normal help. Activity is recorded per chat (`chats.last_seen`) and per action per day (`usage` table); ordinary group chatter is not counted.
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
- **GitHub Actions:** unlimited minutes for public repositories. GitHub's own `schedule:` trigger is "best effort" and, on a quiet repo, can go hours without firing instead of every 15 minutes — this is a known GitHub limitation, not something this project can fix directly. Step 5 above (Cloudflare Cron Trigger) works around it and is strongly recommended. GitHub also pauses schedules if a repo has no activity for 60 days, but timetable updates count as activity. If it ever pauses, click **Enable workflow** in the Actions tab.

## Troubleshooting

| Problem | Fix |
|---|---|
| Action fails at *Download timetable* | EduPage may be down. It retries automatically every 15 minutes. If it keeps failing for hours, EduPage may be blocking GitHub's servers. Tell the developer. |
| Changes show up hours late | GitHub's scheduled runs are unreliable on quiet repos (see Limits above) — set up the Cloudflare Cron Trigger in step 5, which fixes this. |
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
