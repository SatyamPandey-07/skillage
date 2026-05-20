# Skillage UI Design Guide

This document captures the current UI direction for Skillage so that new pages, flows, and components can keep the same visual system. It is intentionally UI-only: layout, typography, color, components, responsive behavior, and interaction states.

---

## Design Intent

Skillage should feel like a modern, trustworthy learning platform that takes both education and blockchain credentials seriously. The UI is clean, motivating, and purposeful — it communicates progress, achievement, and verifiability without becoming noisy or over-gamified.

The closest product references are Linear (for internal tool density), Vercel (for technical credibility), and Coursera/Duolingo (for learning momentum) — but Skillage's expression is darker, more developer-adjacent, and credential-focused.

Use these keywords as the north star:

- Progress
- Achievement
- Credibility
- Clarity
- Trust
- Momentum

---

## Product Surfaces

The app has three primary UI surfaces:

- **Marketing / Landing pages:** Conversion-focused dark pages with large AI-and-credential storytelling, product visuals, and prominent CTAs.
- **Learning flow pages:** The core experience — topic input, lesson view, quiz form, grading result, and mint progress. These are focused, distraction-free, and task-oriented.
- **Dashboard and verification pages:** Credential management, personal cert grid, and the public shareable verification page. These are operational and scannable.

All three surfaces share the same core tokens: near-black background, Inter typography, indigo accent, translucent panels, thin borders, and compact controls.

---

## Technology Baseline

- **Framework:** React + Vite.
- **Styling:** Tailwind CSS.
- **Icons:** `lucide-react`.
- **Fonts:** Inter for all UI copy; JetBrains Mono for wallet addresses, token IDs, transaction hashes, JSON previews, and onchain metadata.
- **Logo:** `/public/logo.svg`, rendered through `SkillageLogo`.
- **Routing:** React Router v6.

Prefer existing classes and patterns before adding new UI primitives.

---

## Theme

The default experience is dark. Light theme support can be introduced through CSS variables, but all current UI is composed for the dark theme.

Primary dark tokens:

- **Page background:** `#0a0a0f`
- **Main panel:** `rgb(12 12 18)`, commonly `#0c0c12`
- **Secondary surface:** `rgb(18 18 28)` or `rgba(255,255,255,0.03)`
- **Field surface:** `rgba(20,20,32,0.85)`
- **Text:** white for headings, white at reduced opacity for body and metadata
- **Accent:** indigo, mainly `#6366f1`, with hover/deeper state `#4f46e5`
- **Success:** emerald/green — used for pass state, minted certs, confirmed transactions
- **Warning:** amber — used for retry state, pending transactions, score below threshold
- **Error / destructive:** red — used for failed grades, UGF errors, delete actions
- **Onchain accent:** violet `#8B5CF6` — reserved specifically for blockchain and credential surfaces (tokenId, BaseScan links, soulbound badge)

Avoid introducing a broad new palette. Indigo is the primary accent; violet is the secondary onchain-specific accent. Do not swap them.

---

## Color Usage

Use color with restraint:

- **Headings:** `text-white`, or a top-to-bottom white-to-slate-400 gradient on marketing hero titles.
- **Body copy:** `text-white/60` to `text-white/75`
- **Muted metadata:** `text-white/30` to `text-white/45`
- **Borders:** `border-white/10` as the default; `border-white/20` or `border-indigo-400/30` on hover and focus
- **Primary accent:** indigo surfaces should normally be translucent — `bg-indigo-500/10` or `rgba(99,102,241,0.12)`
- **Full indigo fills** are reserved for primary call-to-action buttons: Submit Quiz, Mint Certificate, Get Started
- **Violet accent:** use only for onchain/credential contexts — token ID chips, BaseScan links, soulbound badges, certificate cards' top border
- **Score ring colors:** green fill for ≥80%, amber for 60–79%, red for <60%

Do not use bright saturated accent blocks as large backgrounds. Keep color in borders, badges, focus rings, score indicators, icons, and compact controls.

---

## Typography

Use Inter everywhere except wallet addresses, transaction hashes, token IDs, JSON metadata previews, and contract-related labels.

**Marketing typography:**

- Hero H1: large, tight, premium. Pattern: `text-[2rem]` mobile up to `lg:text-[4.5rem]`, `font-bold`, `leading-[0.95]`, `tracking-tight`
- Page hero H1: `text-4xl` to `md:text-6xl`, `font-bold`, `leading-[1.05]`, optional gradient text clip
- Section H2: `text-2xl` to `md:text-5xl`, `font-semibold`, tight leading
- Body: `text-sm` to `text-lg`, generous line height, `text-white/65`

**App and learning flow typography:**

- Page title: `text-xl` to `text-2xl`, `font-semibold`, `tracking-tight`
- Section label: small uppercase, `tracking-[0.12em]`, `text-white/40`
- Lesson card title: `text-base` to `text-xl`, `font-semibold`
- Question label: `text-sm`, `font-medium`, `text-white/80`
- Form label: `text-xs`, medium weight, muted
- Score number: `text-4xl` or `text-5xl`, `font-bold`

Use a consistent `.se-label` utility class for tiny uppercase labels where possible.

**Monospace surfaces (JetBrains Mono):**

- Wallet address display: always mono, `text-sm`, `text-white/60`
- Transaction hash: mono, `text-xs`, violet-tinted
- Token ID: mono, `text-xs`
- Certificate metadata JSON preview
- BaseScan URL chips

---

## Layout Principles

**Marketing pages:**

- Use `max-w-6xl` for standard content, `max-w-7xl` for wide comparison or feature sections
- Hero sections are full viewport with `min-h-screen`
- Place content over a near-black background with a subtle dot grid and soft indigo radial glow
- Use fixed top navigation with a `max-w-6xl` pill container
- Prefer two-column layouts for feature sections: copy on the left, visual/card on the right
- Use generous vertical spacing: `py-16`, `sm:py-24`

**Learning flow pages:**

- Centered, focused, single-column layout — never let the learner feel overwhelmed
- Content width: `max-w-2xl` for topic input and quiz form; `max-w-3xl` for lesson view
- Use clear step separation: each stage (lesson → quiz → result → mint) occupies its own state, not a crowded single page
- Progress indicator at the top showing current learning stage

**Dashboard and verification pages:**

- `max-w-5xl` for the cert grid; `max-w-4xl` for verify page
- Cert grid: 1 col mobile, 2 col tablet, 3 col desktop
- Tables use `overflow-x-auto` with sensible `min-w` values
- Wallet header stays at top with sticky positioning

---

## Backgrounds

Primary background style:

- Near-black base (`#0a0a0f`)
- Subtle dot grid using small white dots at 4–6% opacity
- Soft indigo radial glow behind hero or primary panel
- Optional slow breathing animation on the radial glow for marketing hero

Global helper classes:

- `.se-grid`: page dot grid texture
- `.se-hero-bg`: soft indigo radial hero glow with breathing animation
- `.se-noise`: subtle surface texture overlay

Keep backgrounds quiet. Skillage should feel focused, not like a generic neon Web3 dashboard.

---

## Surfaces and Cards

The dominant surface language is translucent glass over near-black.

**Default glass card:**

- Soft translucent fill: `rgba(255,255,255,0.03)` to `rgba(255,255,255,0.055)`
- `border: 1px solid rgba(255,255,255,0.08)`
- `border-radius: 12px` for learning flow and dashboard cards
- Subtle shadow plus faint inner white highlight on top edge
- Hover: slight border brightening to `border-white/20`, soft indigo glow, `translateY(-1px)`

**Lesson card:**

- Slightly elevated surface: `rgba(255,255,255,0.05)`
- Indigo left border stripe (2px) for key points section
- `rounded-[12px]`
- Fun fact section uses amber-tinted background strip

**Certificate card:**

- Violet top border (2px gradient from `#8B5CF6` to `#6366f1`)
- Dark glass fill with `rounded-[12px]`
- Score ring displayed in top-right quadrant
- `soulbound` badge bottom-left in violet

**MintProgress panel:**

- Tall single-column card with `rounded-[12px]`
- Each stage row: icon, label, status indicator on the right
- Active stage animates with a pulsing indigo glow
- Confirmed stage uses a green checkmark with a brief scale-pop animation

**Compact operational surfaces:**

- Use `rounded-[8px]` for form panels, table wrappers, badge chips
- Borders stay thin and subtle
- Minimal blur; save decorative glass for marketing and certificate surfaces

Do not nest decorative cards inside decorative cards unless the inner element represents real embedded content (code snippet, JSON preview, certificate mockup).

---

## Radius Scale

- Marketing nav and primary CTAs: `rounded-full`
- Marketing cards: `rounded-2xl` or `rounded-[16px]`
- Learning flow and dashboard cards: `rounded-[12px]`
- Form fields, table panels, compact cards: `rounded-[8px]`
- Badges and status chips: `rounded-full` or `rounded-[4px]`

For new learning flow UI, default to `12px`. For new internal/operational UI, use `8px`.

---

## Buttons

**Primary action (marketing CTA):**

- White fill, black text, pill shape, `font-semibold`
- Hover: transitions to indigo fill with white text
- Height: `44px` to `52px`
- Includes `ArrowRight` icon for outbound CTAs

**Primary action (app — Submit, Mint, Start):**

- Indigo fill `rgb(99,102,241)`, white text, `rounded-[8px]`
- Hover: deepens to `rgb(79,70,229)`
- Used for: Submit Quiz, Mint Certificate, Start Learning, Retry

**Secondary action:**

- Transparent or `bg-white/4`
- `border-white/10`
- Muted white text `text-white/70`
- Hover: border shifts toward indigo or white

**Destructive action:**

- Red text and border
- Use red fill only for error alerts, never for standard destructive buttons in the learning flow

**Icon usage:**

- `lucide-react` only
- Include icons for: generate (Sparkles), submit (Send), retry (RefreshCcw), mint (Award), share (Share2), copy (Copy), verify (ShieldCheck), wallet (Wallet)
- Icon-only buttons always include `aria-label`

---

## Navigation

**Marketing header:**

- Fixed at top, centered pill container `h-14`, `max-w-6xl`
- Background: `#0c0c12` at ~80% opacity
- Border: `border-white/10`
- Backdrop blur: `backdrop-blur-2xl`
- Logo left, nav center, CTA / wallet button right
- Desktop nav: small text, medium weight, `text-white/55`, hover to white

**Mobile navigation:**

- Hamburger is a small round glass icon button
- Backdrop: `bg-black/60` with blur
- Menu panel fixed below header, right-aligned
- Near-opaque `#0c0c12` panel background
- Nav items: vertical list with icons, label, and `ChevronRight`
- Open/close: opacity + scale + translate transitions, body scroll locked

**Learning flow header (minimal):**

- Thin sticky bar showing: logo (left), current step label (center), wallet address chip (right)
- No full nav — learners should not be distracted mid-quiz
- Back arrow only appears on lesson and quiz steps

**Dashboard sidebar (optional for larger viewports):**

- 220px wide
- Dark translucent background with thin right border
- Active item: indigo translucent fill, indigo icon
- Items: Dashboard, My Certificates, Verify, Sign Out
- Sign out muted until hover, then turns red

---

## Forms

Use consistent field styles across all input surfaces.

**Input field:**

- Full width
- Dark translucent fill `rgba(20,20,32,0.85)`
- Border: `border-white/10`, focus: `border-indigo-500`, focus ring: `ring-indigo-500/20`
- Placeholder: `text-white/30`
- `rounded-[8px]`
- Text: white

**Labels:**

- `text-xs`, medium weight, `text-white/55`
- Place above fields with `6px` spacing

**Topic input (hero field):**

- Larger variant: `text-lg`, `px-5 py-4`
- Right-side difficulty selector inline
- Subtle indigo glow on focus
- Submit button inline-right

**Quiz form textareas:**

- Same field style as inputs
- `min-h-[100px]`, `resize-y`
- Question number chip (`Q1`–`Q5`) in top-left of textarea label
- Character count hint bottom-right

**Select / difficulty selector:**

- Custom dark surface
- `rounded-[8px]`
- Options: Beginner / Intermediate / Advanced
- Active option shows small indigo dot

**Validation and feedback:**

- Error: red translucent fill, red border, red text, compact
- Success: green translucent fill, green text
- Grading in progress: indigo shimmer on submit button
- Messages: short and action-oriented

---

## Score Display

The score result is a primary visual moment. Treat it as a showcase, not a data row.

**Score ring:**

- Large SVG ring, `120px` to `160px` diameter
- Stroke animates from 0 to final score on mount (600ms ease-out)
- Color: green ≥80%, amber 60–79%, red <60%
- Center: score number in `text-4xl font-bold`, sub-label "/ 100"

**Per-question breakdown:**

- Question label + score chip (0–20) + one-line feedback text
- Score chip colored: green 16–20, amber 8–15, red 0–7
- Weakest answer highlighted with a subtle amber left border

**Overall feedback:**

- Claude's overall feedback in a glass card below the ring
- Indigo quote accent on the left
- Font: `text-sm text-white/70`

---

## Tables

Used for leaderboards, cert history, and admin-like surfaces.

Pattern:

- Wrap in a glass surface with `rounded-[8px]`
- Horizontal overflow for dense columns
- Header row: `text-[10px] uppercase tracking-[0.14em] text-white/40`
- Row separators: `border-white/8`
- Body text: `text-white/65`, key values in white
- Row hover: very subtle `bg-white/3` overlay
- Action cells: compact bordered icon buttons

---

## Badges and Status

Use small rounded chips with translucent backgrounds and tinted borders.

**Status tones:**

- **Pass / Minted / Confirmed:** green — `bg-green-500/10 border-green-500/20 text-green-400`
- **Pending / Grading / Quoting:** amber — `bg-amber-500/10 border-amber-500/20 text-amber-400`
- **Fail / Error:** red — `bg-red-500/10 border-red-500/20 text-red-400`
- **Soulbound / Onchain:** violet — `bg-violet-500/10 border-violet-500/20 text-violet-400`
- **Inactive / Muted:** slate — `bg-white/5 border-white/10 text-white/40`

**Badge sizing:**

- `px-2 py-0.5`
- `text-[10px]` to `text-xs`
- `font-medium`
- `rounded-full` for score labels and difficulty; `rounded-[4px]` for tx state chips

**Difficulty badges:**

- Beginner: green tint
- Intermediate: indigo tint
- Advanced: amber tint

---

## UGF Lifecycle UI

The four-stage gasless mint flow deserves a dedicated visual treatment.

**Progress bar / step list:**

```
[ 💬 Getting gas quote          ] ← active: indigo pulse
[ ✍️  Authorizing payment        ]
[ ⚡  Sending transaction        ]
[ 🎓  Certificate minted!        ]
```

- Each row is a glass card row with icon, label, and right-side status indicator
- Active: indigo pulsing dot on the right
- Complete: green check with a brief scale-pop
- Pending (not yet reached): muted, `text-white/30`
- The card as a whole has a soft indigo outer glow during the minting sequence

**UGF error display:**

- Compact red glass panel below the progress bar
- Bold error title + one-sentence human-readable explanation
- CTA button if recovery is possible (e.g. "Get MockUSD →" for balance errors)

---

## Empty, Loading, and Error States

**Loading (skeleton):**

- `.se-skeleton` shimmer for lesson cards, cert grid, and table rows
- Shimmer direction: left to right, `1.4s` loop
- Skeleton background: `rgba(255,255,255,0.06)` with a white highlight sweep

**Loading (blocking):**

- Small spinner: `border-white/10 border-t-indigo-500`, `20px`, `1s linear` loop
- Centered with a short label: "AI is preparing your lesson…" / "Claude is reviewing your answers…"

**Empty states:**

- Centered content within a dashed-border glass card
- Muted icon in slate (`GraduationCap`, `Award`, `BookOpen` depending on context)
- Short title + one muted supporting line
- Primary action only when the next step is obvious ("Start your first lesson →")

**Errors:**

- Red translucent panel
- Short title + one-sentence description
- Retry button (secondary style) where recovery makes sense
- Never leave the user on a blank screen; always show next action

---

## Motion

Motion should be purposeful and lightweight.

**Current motion language:**

- Fade-in-up on page and card mounts: `opacity 0→1, translateY 8px→0`, `300ms ease-out`
- Score ring stroke animation: `600ms ease-out` from 0 to final value
- `translateY(-2px)` hover lift on cert cards
- Active controls scale to `0.97`
- UGF stage glow pulse: slow `2s` sine on indigo drop-shadow
- Skeleton shimmer: left-to-right sweep `1.4s linear infinite`
- Scale-pop on stage completion: `scale(1.0) → scale(1.15) → scale(1.0)`, `300ms`
- Confetti burst on certificate mint confirmation (canvas-based, 1.5s, then removed from DOM)

Respect `prefers-reduced-motion`. Disable score ring animation, confetti, and hero glow breathing for reduced-motion users. Keep fade-in-up at `opacity` only (no translate).

Avoid bouncing, spinning loading spinners larger than 24px, or playful motion that undermines the credential's credibility.

---

## Iconography

Use `lucide-react` icons consistently.

**Common icon meanings:**

| Icon | Usage |
|---|---|
| `Sparkles` | AI generation, lesson creation |
| `Send` | Submit quiz answers |
| `RefreshCcw` | Retry quiz |
| `Award` | Certificate, mint action |
| `GraduationCap` | Learning context, dashboard |
| `ShieldCheck` | Verification, soulbound |
| `Wallet` | Wallet connection, balance |
| `Copy` | Copy address / share link |
| `Share2` | Share certificate |
| `ExternalLink` | BaseScan / external links |
| `BookOpen` | Lesson content |
| `CheckCircle2` | Pass state, confirmed |
| `XCircle` | Fail state, error |
| `ArrowRight` | CTA navigation |
| `ChevronRight` | In-app nav |
| `Loader2` | Spinning progress indicator |

Icons should be 14–20px. Keep them muted (`text-white/50`) unless an action or status requires emphasis. Accent-colored icons only for active states and primary actions.

---

## Responsive Behavior

**Marketing:**

- Nav hides on mobile and tablet; mobile nav appears until `lg`
- Hero CTAs stack on mobile, inline from `sm`
- Feature grids: 1 col mobile → 2 col tablet → 3–4 col desktop

**Learning flow:**

- Topic input + difficulty selector stack vertically on mobile
- Lesson card reads as a single column on all widths
- Quiz form: each question full-width, stacked vertically
- Score ring centers, breakdown below

**Dashboard:**

- Cert grid: 1 col mobile → 2 col `sm` → 3 col `lg`
- Wallet header: address truncated to 8 chars on mobile
- Verify page: single column with full-width cert cards on mobile

Always verify that quiz textareas, cert card metadata, badge labels, and score numbers do not overflow on narrow viewports.

---

## Accessibility

Maintain:

- Semantic `<button>` and `<a>` elements (never `<div onClick>`)
- `aria-label` on all icon-only buttons
- `aria-live="polite"` on UGF stage updates so screen readers announce progress
- `aria-label` on the score ring SVG with the numeric score
- `role="status"` on loading states
- `role="alert"` on error banners
- Visible focus states: `ring-2 ring-indigo-500 ring-offset-2 ring-offset-transparent`
- Escape key closes all modals and overlays
- Keyboard-navigable quiz form (Tab through Q1–Q5, Enter to submit)

Color contrast: body text must meet WCAG AA. Muted metadata (`text-white/40`) is acceptable for supplementary labels, but question text, answer labels, and CTAs must remain fully readable.

---

## Content Style in UI

Copy should be short, confident, and encouraging.

**Good patterns:**

- "Learn anything. Prove it onchain."
- "AI-generated lesson"
- "Answer in your own words"
- "Soulbound credential"
- "Verified on Base Sepolia"
- "Your answers have been graded"
- "Certificate minted — view on BaseScan"
- "Mint your certificate"
- "Start a new lesson"
- "No ETH needed"

**Avoid:**

- Crypto jargon without explanation ("gas", "ERC-721", "calldata") in user-facing copy
- Overpromising ("the best", "revolutionary")
- Long paragraphs inside quiz or result cards
- Passive phrasing ("has been submitted")
- Treating the blockchain as the feature — the learning is the feature

---

## Page Patterns

### Marketing Landing

Use a full-viewport dark hero with:

- Fixed pill nav
- Large centered gradient H1 ("Learn anything. Prove it onchain.")
- Short muted supporting copy (2 lines max)
- Primary CTA ("Start Learning — Free") and secondary CTA ("See how it works")
- Product visual below CTAs: animated lesson → quiz → cert card mock flow
- Subtle dot grid and soft indigo radial glow

Below the hero:

- Section: "How it works" — 3-step horizontal flow (Learn → Pass → Mint)
- Section: "What makes Skillage different" — feature comparison or callout cards
- Section: Credential showcase — example cert card with onchain badge
- Section: "Gasless by design" — UGF + Base Sepolia explanation with a small flow diagram
- Footer: minimal, links + "Built on Base Sepolia"

### Topic Input / Home (logged in)

- Centered layout, `max-w-2xl`
- Large text input with placeholder "What do you want to learn today?"
- Difficulty selector (Beginner / Intermediate / Advanced) below or inline
- Short hint text: "Skillage will generate a lesson and quiz. Answer 5 questions. Score ≥80% to earn a certificate."
- Faucet reminder chip if MockUSD balance is low
- Recent certificates strip at bottom (last 3, compact)

### Lesson View

- `max-w-3xl`, centered
- Lesson card: title, summary (3–4 sentences), key points (indigo-accent bullet rows), fun fact (amber strip)
- Progress step indicator: Step 1 of 3 — "Read the lesson"
- "I'm ready to take the quiz →" CTA below the card
- Subtle "AI-generated lesson" label top-right in muted text

### Quiz Form

- `max-w-2xl`, centered
- Progress: Step 2 of 3 — "Answer the questions"
- 5 labeled textarea blocks, Q1–Q5
- Each textarea has a question chip, the question text, and the answer field
- Sticky bottom bar: "Submit Answers" primary button + question completion count ("3 / 5 answered")
- Warn if any field is empty on submit attempt

### Grade Result

- `max-w-2xl`, centered
- Score ring (large, centered, animated)
- Pass / Fail state label below ring
- Claude's overall feedback card
- Per-question breakdown accordion (collapsed by default, expand any question)
- On pass (≥80%): "Mint your certificate" primary CTA in indigo
- On fail (<80%): "Try again with new questions" CTA + brief encouragement line
- "Back to topic input" secondary link

### Mint Progress

- `max-w-md`, centered, modal-like card
- 4-stage step list with icons and status indicators
- Active stage pulses with indigo glow
- On completion: certificate card appears below the progress panel
- Confetti animation
- "View on BaseScan" + "Share certificate" + "Start a new lesson" CTAs

### Dashboard

- `max-w-5xl`
- Wallet header sticky: address chip, MockUSD balance, faucet link
- Section title: "Your Certificates" + total count badge
- Cert grid: `CertCard` components
- Empty state: GraduationCap icon, "No certificates yet", "Start your first lesson →"
- Leaderboard teaser (optional): compact horizontal strip showing top earners

### Public Verification Page (`/verify/:address`)

- `max-w-4xl`, no login required
- "Certificates for `0x1234…5678`" heading with `Verified` green badge
- "Verified on Base Sepolia via Skillage" sub-label
- Full-width cert cards, each with topic, score, date, BaseScan link
- Copy-share-link button per card
- Empty state: "No certificates found for this wallet"

---

## Implementation Checklist

Before shipping a new UI change:

- Uses Inter and JetBrains Mono appropriately
- Uses existing Skillage CSS variables / Tailwind classes where practical
- Keeps the near-black, focused learning tone
- Uses indigo as the primary accent; violet only for onchain/credential surfaces
- Uses thin borders and translucent dark surfaces
- Has hover, active, focus, disabled, loading, empty, and error states
- Uses `lucide-react` icons for all tool actions
- Score ring animates in and respects `prefers-reduced-motion`
- Works on mobile without text overflow or textarea clipping
- UGF error codes map to human-readable messages
- Wallet address and tx hash always use JetBrains Mono
- Keeps motion subtle and respects reduced motion

---

## Source Files to Follow

Use these as the strongest references once built:

- `src/index.css` — global tokens and utility classes
- `tailwind.config.js`
- `src/main.jsx` — Privy + UGFProvider wrappers
- `src/App.jsx` — route definitions
- `src/pages/Home.jsx` — topic input + hero state
- `src/pages/Lesson.jsx` — lesson card + quiz form
- `src/pages/Result.jsx` — score ring + mint trigger
- `src/pages/Dashboard.jsx` — cert grid
- `src/pages/Verify.jsx` — public shareable verification
- `src/components/LessonCard.jsx`
- `src/components/QuizForm.jsx`
- `src/components/GradeResult.jsx`
- `src/components/MintProgress.jsx`
- `src/components/CertCard.jsx`
- `src/components/WalletHeader.jsx`
