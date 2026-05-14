# RoamReach

> **The Midnight Concierge** — a real-time backpacker meetup app built with Expo, React Native, and the Midnight Gilt design system.

RoamReach connects travelers with shared interests, enabling spontaneous meetups, plan creation, and community discovery in any city worldwide.

---

## Features

- **Check In** — Mark your presence in a city to appear on the map
- **Discover Nearby** — Find travelers around you with map & list views
- **Backpacker Cards** — Rich profiles with reputation scores, verified badges, and travel styles
- **Create Plans** — Organize food crawls, hikes, nightlife, and cultural outings
- **Plans Feed** — Browse upcoming meetups filtered by category
- **Trust & Safety** — Report users, block, and post-meetup ratings

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| **Expo SDK 52** | React Native framework |
| **TypeScript** | Type safety |
| **Expo Router** | File-based routing |
| **React Native Maps** | Map display |
| **Zustand** | State management |
| **Expo Location** | GPS check-in |
| **Expo Image** | Image handling |
| **Expo Linear Gradient** | Gold gradients |
| **Expo Blur** | Glassmorphism |
| **React Native Reanimated** | Animations |

---

## Design System — Midnight Gilt

**Colors:**
- Primary surface: `#131313` (matte dark)
- Accent: `#e9c176` (brushed gold)
- Text: `#e6e1e5` (onSurface), `#c8c6c5` (muted)
- Glass: `rgba(19, 19, 19, 0.70)`

**Typography:**
- Display: Manrope (Bold, ExtraBold)
- Text: Plus Jakarta Sans

**Principles:**
- No borders (tonal layering only)
- Floating glassmorphic elements
- Editorial, luxury aesthetic

---

## Project Structure

```
RoamReach/
├── app/                      # Expo Router screens
│   ├── (auth)/              # Onboarding, sign-in, profile setup
│   ├── (tabs)/              # Main navigation: explore, plans, community, profile
│   ├── plan/                # Create plan & plan detail modals
│   ├── backpacker/          # Traveler profile card
│   └── messages/            # Messaging screens
├── src/
│   ├── components/
│   │   ├── common/          # Reusable UI (GoldButton, GlassCard, etc.)
│   │   ├── checkin/         # Check-in sheet
│   │   ├── discover/        # MapView, filters
│   │   ├── plan/            # PlanCard, forms
│   │   ├── safety/          # ReportModal, RatingPrompt, BlockConfirm
│   │   ├── profile/         # Profile enhancements
│   │   └── messages/        # Chat UI
│   ├── constants/           # Theme, categories, travel styles
│   ├── stores/              # Zustand (auth, location, discover, plans, social)
│   ├── data/                # Mock data (backpackers, plans)
│   └── utils/               # Haversine, formatting
└── assets/                  # Fonts, images
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator / Android Emulator (or physical device with Expo Go)

### Installation

```bash
# Clone the repo (or navigate to project folder)
cd RoamReach

# Install dependencies
npm install

# Copy environment template
cp .env.example .env
# Edit .env with your Supabase URL and anon key (optional for mock mode)

# Start development server
npm start
```

Scan the QR code with Expo Go (Android) or Camera app (iOS).

---

## Development Notes

### Mock Data
The app runs entirely on mock data in Expo Go. No backend connection required for testing.

### Location
Check-in uses GPS simulation set to Bangalore by default. Change coordinates in `locationStore.ts` for other cities.

### Maps
Uses `react-native-maps` with a custom dark style fitting the Midnight Gilt theme. No Mapbox token required.

---

## Roadmap

- [x] Onboarding flow
- [x] Check-in & discovery (map/list)
- [x] Plan creation & feed
- [x] Backpacker profile cards
- [x] Safety & moderation
- [x] Profile with milestones
- [ ] Real-time messaging (WebSocket)
- [ ] Supabase backend integration
- [ ] Push notifications
- [ ] Photo verification for ID

---

## License

MIT

---

**Built with ♥ by Abdul Taufeeq**  
GitHub: [@trippusultan](https://github.com/trippusultan)


## E2E Testing (Maestro)

RoamReach uses [Maestro](https://maestro.mobile.dev) for fast, reliable mobile E2E tests — no native linking required.

### Prerequisites

1. **Install Maestro** (one-time):
   ```bash
   curl -L "https://get.maestro.dev" | bash
   ```
   Or download from [maestro.mobile.dev](https://maestro.mobile.dev).

2. **Build the app** for your platform:
   ```bash
   # Android APK
   npx expo run:android --variant release

   # iOS (requires Mac)
   npx expo run:ios --configuration Release
   ```

3. **Install the APK** on your device/emulator:
   ```bash
   adb install android/app/release/app-release.apk
   ```

### Running Tests

From the project root:

```bash
# Run all flows
npm run test:e2e

# Run a specific flow
python scripts/auto/maestro_runner.py signin
python scripts/auto/maestro_runner.py explore
python scripts/auto/maestro_runner.py plan
python scripts/auto/maestro_runner.py checkin
python scripts/auto/maestro_runner.py profile

# Generate HTML report
npm run test:e2e:report
```

### Test Flows

Located in `tests/e2e/flows/`:

| Flow | Purpose |
|------|---------|
| `signin.flow.yaml` | OAuth sign-in → Explore landing |
| `explore_map.flow.yaml` | Map view, marker tap → backpacker profile |
| `plan_details.flow.yaml` | Plan details, join, rate after date |
| `checkin.flow.yaml` | City check-in flow end-to-end |
| `profile.flow.yaml` | Profile page scroll and journey gallery |

### Writing New Flows

1. Create a `.flow.yaml` in `tests/e2e/flows/`
2. Use Maestro syntax: `tapOn`, `assertVisible`, `scroll`, `takeScreenshot`
3. Reference element IDs/text from the app UI strings
4. Run with `maestro test tests/e2e/flows/your-flow.flow.yaml`

See [Maestro docs](https://maestro.mobile.dev/docs) for advanced selectors and assertions.

## Supabase Database Setup

RoamReach uses Supabase for authentication and data persistence. Follow these steps:

### Automated Setup

```bash
# 1. Install Supabase CLI
npm install -g @supabase/cli

# 2. Link project (use your project ID from dashboard)
supabase link --project-ref aqcbobnhkiqkhcraeahd

# 3. Push schema
npm run db:push

# 4. Generate TypeScript types
npm run db:types

# 5. (Optional) Seed sample data
npm run db:seed
```

### Files

- `supabase/migrations/001_initial_schema.sql` — tables + RLS policies
- `supabase/seed/01_data.sql` — sample profiles & plans
- `scripts/auto/generate_supabase_types.py` — type generator
- `scripts/auto/run_migrations.py` — SQL executor

**RLS**: Profiles readable by all, editable by owner only. Plans readable by all, manageable by host only.

### Troubleshooting

| Issue | Fix |
|-------|-----|
| Invalid API key | Verify `.env` values, restart Expo |
| RLS violation | Ensure user is authenticated before writes |
| Type errors after schema change | Re-run `npm run db:types` |
| Migration already applied | Already deployed, skip |
