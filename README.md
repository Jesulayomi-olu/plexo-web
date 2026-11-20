# Plexo landing page

A build of the Plexo marketing site from the Figma file *Plexo 2026*, made with Next.js (App Router), React, TypeScript and Framer Motion. The Figma file is the source of truth. The home page is the frame **"Home page V2"** on Page 3 (node `1166:14994`, rebuilt in November 2026); at a 1440px-wide window it matches the design section by section (see "Home page" below for the few deliberate differences).

## Run it

```bash
npm install
npm run dev       # http://localhost:3000
npm run build     # production build in .next/ (the page is prerendered as static HTML)
npm run start     # serve the production build
```

Add `?capture` to the URL (for example `http://localhost:3000/?capture`) to turn off animations and show the static design. Use it when comparing screenshots against Figma. Add `?preview` to see proposed motion that isn't live yet (see `MOTION.md`).

## Pages

| Route | Figma frame |
|---|---|
| `/` | Home page V2 (1166:14994, Page 3) |
| `/pricing` | Pricing (571:11306) |
| `/solutions/founders`, `/coaches`, `/small-business`, `/designers` | Solutions, formerly "For You" (571:12846, 571:13665, 571:14526, 571:8810); `/for-you/…` redirects here (`next.config.ts`; on Cloudflare, `public/_redirects`) |
| `/solutions/developers` | For Developers (1042:19374) |
| `/features/sol` | Build with Sol (575:15481) |
| `/features/drag` | Design with a Drag (644:21396) |
| `/features/mcp` | MCP and API (668:27186, "Mcp and AI") |
| `/features/ecommerce` | E-commerce (731:12626) |
| `/features/email` | Email & Marketing (736:14779, "Email marketing") |

The Figma frames of these pages still carry the old footer; they use the shared one. Their hidden frames (pricing, social proof and the like) are left out.

Solution pages (`src/sections/forYou/*`, content in `audiences.ts`): the copy is Figma's as updated in November 2026, with these deliberate differences, as the design team asked:

- **Stories, not "Social proof":** the old Helimax card is replaced by the home page's stories (MeerHQ and PAR Nursing Hub, `home/Stories`).
- **Full stops:** every problem, fix and work line, the coaches title and the "Go live when you are ready." subline end in a full stop; Figma leaves some off.
- **For Developers:** the hero's code window is the MCP and API page's live panel and types itself out; "Start Building" opens sign-up (`/signup`). There is no docs site yet, so "Read the docs" and the final CTA's "Explore documentation" are shown as in Figma but don't lead anywhere, and the footer's docs items are plain text.

MCP and API (`/features/mcp`, `src/app/features/mcp/page.tsx`): the copy is Figma's as updated in November 2026 (the MCP section's new two-line lead, "Bring your AI coding tools and Plexo together…"; its diagram no longer has the dot pattern), with these deliberate differences, as the design team asked:

- **Docs links are placeholders:** there is no docs site yet, so the hero's "Read the Docs" link and the final CTA's "Read the docs" button and "Get an API key" link are shown as in Figma but have no destination (a plain span and a `<button>` that does nothing). "Connect Your AI" scrolls to the MCP section.
- **Full stops:** the SDK tile ("…in your React app.") and the first "You Stay In Charge" point ("…up on your canvas.") end in a full stop; Figma leaves them off.
- **Webhooks tile:** Figma's stray "]" after "…form fills and orders." is left out.
- **"Clean export":** the tile title loses Figma's full stop, like the other titles (the design team's call).

Copy corrections on the other product pages (the design team's call): Design with a Drag reads "Ready-made blocks" (Figma: "Ready made blocks") and "Drop it" with one space (Figma has two); Build with Sol's FAQ answer writes "Sol" where Figma has "SOL".

E-commerce (`/features/ecommerce`, `src/app/features/ecommerce/page.tsx`): the copy is Figma's as updated in November 2026 (the hero lead, the problem and fix lines, the "What You get" card bodies, now 264-tall cards beside a 561-tall first card, and the FAQ answers, taken from the hidden answer layers of "Ecommerce FAQ" 923:6372), with these deliberate differences, as the design team asked:

- **Full stops:** the four problem lines, the first FAQ answer ("…your payment provider.") and the final CTA's prompt ("…Bold and youthful.") end in a full stop; Figma leaves them off.
- **Last fix line:** "Your store stays open even when you're away." is wider than Figma's 324 column, which clips it; here it shows in full, a few px past the column (desktop).

| Route | Figma frame |
|---|---|
| `/resources` | Resources hub (683:34865) |
| `/resources/blog` | Blog (718:8690); `?q=` narrows it by title (the hub's search sends you here) |
| `/resources/blog/[article]` | Blog article (894:5341); every article shares Figma's placeholder body for now |
| `/resources/templates` | Templates (718:9219) |
| `/resources/customer-stories` | Customer stories (718:10560) |

The nav's Resources menu is Figma 942:6996. Blog, Templates and Customer stories show "Back to Resources" only when opened from the Resources page (its links add `?from=resources`), as Figma's note on 718:9065 asks. Articles, templates and stories are sample content in `src/sections/resources/data.ts` until a CMS feeds them; their pictures are Figma's placeholders.

### Sign up, log in and password reset

| Route | Figma frame |
|---|---|
| `/signup` | Create account (1296:8209; password focused 1296:8405; passwords don't match 1296:8606) |
| `/login` | Sign in, "Welcome back" (1048:21566; incorrect email or password 1296:8070) |
| `/forgot-password` | Password Reset, "Reset password" (1296:8864) |
| `/forgot-password/check-email?email=…` | "Check your inbox" (1296:8992) |
| `/reset-password?token=…` | "Create new password" (1296:9069) |
| `/reset-password/done` | "Password updated!" (1296:9363) |

These screens are full screen, without the nav and footer, and stay out of search results (`robots: noindex`). They share one layout (`src/app/(auth)/layout.tsx` → `src/sections/auth/AuthShell`): the green panel on the left (logo back to the home page, tagline, and the customer quotes of Figma "Component 11", which the arrows step through) and the form on the right. The panel's logo is 24px tall, the nav's own logo (Figma has it at 40). Below 1024px the panel goes: no green fill, just the dark Plexo logo (24px tall, as in the nav) at the page's top-left edge, with the form below it at its 510px width.

- **Flow:** "Start free" and the site's other sign-up buttons open `/signup`; "Log in" opens `/login`. Log in's "Forgot password?" opens Reset password; a valid email opens Check your inbox with that address ("resend link" sends it again and confirms underneath for 5s; without an address the copy says "your email address" and the link goes back to Reset password). The link in the email opens Create new password; "Save password" opens Password updated, whose "Return to sign in" opens Log in.
- **Checks, in the browser:** Create Account needs a name, a valid email, a password that meets the four rules and the same password again. The "Password must contain:" checklist opens while the password field has focus (and while a typed password still misses a rule); each rule turns green as it's met. "Passwords do not match, please try again." shows on leaving the second field and on submit, and goes as soon as they match. Log in shows Figma's error state ("Incorrect email or password.", both fields red) on submit with an empty or malformed email or an empty password. Messages sit under their field and are announced; the first field with a problem takes focus. The eye buttons show and hide passwords.
- **No backend yet:** the submit hooks are stubs in `src/lib/auth.ts` (`signUp`, `logIn`, `continueWithGoogle`, `requestPasswordReset`, `resetPassword`) for the app team to wire to the real API. The reset flow resolves, so it can be clicked through; sign up and log in report "not connected" and the form simply stays as it is (no fake success); "Continue with Google" does nothing yet. Once they work, set `APP_HOME_HREF` there to send signed-in users into the app.
- **Deliberate differences from Figma:** the Create account button reads "Create account" and the line under it "Already have an account? Log in", as in the updated frames, with single spaces and "Log in" as a green link on all three (frames 1296:8405 and 1296:8606 show it plain). Frame 1296:8606's second, empty "CONFIRM PASSWORD" field is a stray duplicate and isn't built. The mismatch message reads "Passwords do not match, please try again." (Figma: "Password do not match. please try again"), and Log in's button "Sign in" (Figma: "SIgn in"). Full stops added: the first quote, the Reset password and Create new password leads, Check your inbox's resend line and "Incorrect email or password.". The second quote's business is PAR Nursing Hub, as in the home stories (this Figma component says PAR Nursing Home). Messages for an empty or malformed field are not in Figma; they follow its error style. The eye's "hide" state (crossed out) is Lucide's eye-off, drawn like Figma's eye. Typed passwords use the browser's dots, sized to Figma's 6px dots.
- **Copy, as the design team asked:** titles and buttons in sentence case ("Create account", "Welcome back", "Check your inbox", "Password updated!", "Send reset link", "Save password"; Figma mixes title case in), "Password must contain:" without the space before the colon, "resend link" in lower case mid-sentence, and Create new password's second field labelled "Confirm new password" (Figma: "NEW PASSWORD" twice).
- **Assets** (`public/assets/auth/`, from Figma): the panel's line artwork (`panel-lines.webp`, 2×; blurred in CSS as in Figma), the two avatars (2×, WebP), and the Google "G" (with its mask), eye, check and arrow icons as exported SVGs.

## Home page

Sections in order (`src/app/page.tsx`), each from Figma "Home page V2" (1166:14994):

| Section | Figma | Component |
|---|---|---|
| Nav | Navigation (1042:18288, shared) | `Nav` |
| Hero: "Get Your [Business] Online Without Any Stress" | 1166:14999 | `Hero`, `HeroParts` |
| "Everything your Business needs online" strip | 1166:15107 | `FeatureStrip` |
| "Build with AI. Make it live with Plexo" | 1166:15171 | `home/BuildWithAi` |
| "Built around the way you create" (tabs, Component 9) | 1166:15342 | `home/CreateModes` |
| "Built for people who have something to sell, share or grow" | 1166:15365 | `home/Audiences` |
| "Already on WordPress?" | 1166:15834 | `home/WordPress` |
| "See what people are building with Plexo" | 1166:15988 | `home/Stories` |
| Pricing | 1166:16044 | `Pricing` |
| FAQ | 1166:16071 | `Faq` |
| "Ready to bring your idea to life?" | 1166:16076 | `FinalCta` |
| Footer | 1194:10540 (the shared footer) | `Footer` |

Deliberate differences from the Figma frame:

- **Hero lead:** ends with a full stop; Figma ends it with "online sales,".
- **FAQ copy:** the FAQ has the 14 questions and answers the design team supplied on 11 November 2026, not Figma's 9. The first 7 show, and a "See more" button (not in Figma) unfolds the rest. The first question starts open (Figma's instance opens the third).
- **Copy fixes:** full stops added where Figma leaves them off: the second story's two paragraphs, two of the Build with AI steps ("…in your AI agent.", "…publish it online."), "building from scratch." (template panel), the Developers card's "Code Export" item and the Coaches, Designers and Developers subtitles. The second story's business is PAR Nursing Hub (Figma says Pioneer Care Home).
- **Built around the way you create:** opens on "Start with Plexo AI" (Figma's instance now shows the visual editor tab, the design team's new "build with editor" section). Every panel keeps the AI panel's 32px corners; the visual editor and template variants are square in Figma. "Start from a blank canvas" has one space after "from" (Figma has two). The template row glides, as the earlier home page's did, and also shows "image 26" (Fieldnote), which sits out of view in Figma.
- **Hero picture:** the storyboard loops with no pause button, as the design team asked.
- **Centring:** the final CTA and the Stories heading are centred. Figma puts both 40px left of the page centre (padding on one side only, and a left-aligned heading box).
- **Footer band:** the footer's dark band keeps its established height (248px). In this frame the divider and glow are loose layers outside the page's auto-layout.

## Structure

| Path | What it is |
|---|---|
| `src/index.css` | Design tokens taken from Figma (colours, type, gutters, focus ring) and global styles |
| `src/components/Button.tsx` | The Figma **Button** component (Primary, Secondary, Outline, Contrast, White) with the design system's Hover, Pressed and Focus colours |
| `src/components/PromptBox.tsx` | The prompt box: the tall hero variant, the one-line final-CTA variant, the For You card and the flat Build with Sol panel |
| `src/components/Divider.tsx` | The dashed divider with star ornaments (hero top and bottom, footer band) |
| `src/components/AiFlowPhone.tsx` | The phone version (below 768px) of the "AI tools → Plexo → live site" diagram, shared by Build with AI and the MCP section: the three AI pills in one row at one height, built at phone size |
| `src/components/Reveal.tsx`, `BlurIn.tsx` | Entrance animations; off for users who prefer reduced motion and in `?capture` mode |
| `src/sections/*` | One component with its own CSS module per Figma section, in page order (see `src/app/page.tsx`) |
| `src/sections/home/*` | Sections made for the home page only (see "Home page") |
| `src/motion/useWordTypewriter.ts` | The hero's word cycle, on the same typing sequence as `useTypewriter` |
| `src/motion/useGlide.ts` | The endless template row (auto-glide plus drag, swipe and keys) |
| `public/assets/v3/` | Home page artwork from Figma 1166:14994: photos and renders at 2× (WebP), SVG icons as exported. The hero storyboard's site screenshots (`hero/story/showcase-*`) are built from Figma's source images at 2× and 3× and picked with `srcset`. The visual editor screenshot (`create-modes/editor-v2@2x.webp`, `@3x`) is exported at both sizes too and picked with `srcset`. The Build with AI steps use the `build-with-ai/steps-*.svg` icons |
| `src/sections/features/*` | Sections of the product pages: the line-photo hero (`FeatureHero`), the feature-card grids (`FeatureCards`), the Drag hero and block showcase, the stacking developer tiles (`DevStack`), "You Stay In Charge", the email statement and campaign diagram, and the E-commerce hero picture (`StoreMock`). Pages also reuse home, pricing, For You and Build with Sol sections with props (`Mcp variant="page"`, `FeatureStrip variant="mcp"`, `SolSteps variant`, `Solutions title`, `Faq variant="ecommerce"`, `PricingCta` with a link, a prompt box or its heading box) |
| `public/assets/features/` | Product page artwork: the editor screenshots and hero pictures (exported from Figma at 2×, WebP), the line-pattern tiles and SVG icons |
| `src/app/layout.tsx` | The HTML shell: metadata, fonts (loaded with `next/font`) and global styles |
| `src/app/(auth)/*`, `src/sections/auth/*` | The sign-up, log-in and password-reset screens: the shared layout and panel (`AuthShell`, `AuthPanel`), the form pieces (`AuthForm`: fields, checklist, buttons), one form per screen, the checks (`validation.ts`) and the form state (`useAuthForm.ts`) |
| `src/lib/auth.ts` | The auth backend hooks (stubs until the app team connects them) |
| `public/assets/auth/` | Auth screen artwork from Figma: panel artwork and avatars at 2× (WebP), SVG logo and icons |
| `public/assets/v2/` | Artwork exported from Figma at 2× (WebP) and SVG logos and icons |
| `MOTION.md` | Every animation on the page, with the vocabulary used to discuss motion |

## Responsive behaviour

These layouts are derived from the desktop designs (same colours, type, radii and shadows): the new home page has no mobile frame yet, and the older "Home page V2 · Mobile" (527:2678) predates it. Current behaviour:

- **1200px and wider:** the desktop layout. The content column is 1280px at most, centred, with 80px side margins. Fixed compositions (the AI panel, the MCP diagram) scale down uniformly below 1440.
- **768–1199px:** 40px side margins; grids drop to two columns or stack.
- **Under 768px:** 20px side margins; one column (two plans per row in Pricing); the MCP and Build with AI diagrams become one shared vertical flow (`AiFlowPhone`: Claude, ChatGPT and Cursor in a row, all 28px tall, joining under ChatGPT, then Plexo and the live site); tab rows scroll sideways (a tab tapped where the row cuts it off slides into view). Headings follow the design system's *mobile/** text styles (Figma page "Design system" → Typography): section headings 32/36.8 (heading/h2) or 28/33.6 (heading/h3), card titles 24/28.8 and 18/23.4, and so on; long headings and leads are balanced so no word is left alone on a line. Body copy stays at 14/21 (body/md), including card text, list items, FAQ answers, the Build with AI steps and the footer links (the system's 12/18 read too small there); 12px is kept for small labels and captions, and nothing is under 11px. The home hero heading keeps its two-line composition and scales with the screen (32px at most). Buttons use Size=Large (48px), as the system specifies for main actions on mobile (also the phone menu's "Start free"), and tap targets are at least about 44px tall (the menu button, the story arrows, the Monthly/Yearly toggles, the final CTA's links and the footer links). Fields are 16px so iOS doesn't zoom into them.
- **Phone compositions** (rearranged rather than shrunk): the home hero buttons stack, centred, 240 wide; the home hero picture keeps its 169.5 phone height and plays the storyboard in its own phone arrangement (`HeroStory`, `PHONE`: about 0.76 scale on a 390 phone instead of half size, a narrower prompt on two lines; the last scene in its own layout, `PHONE_SHOW`, with smaller chips in Figma's arrangement); the final CTA's field holds just the attach button and the prompt, with "Build it" full width under it; the For You hero's prompt card wraps the prompt over up to four lines with "Build it" under it at the right (a longer prompt keeps its newest line in view); the For Developers code panel is cropped to its code window (`DevCodePanel phoneCrop`), so the code reads larger. Figma's hand-made line breaks in the plan cards give way to natural wrapping.
- **Product and Resources pages on phones:** pictures of desktop UI are drawn larger and cropped to the part that matters instead of shown whole at half size: the Build with Sol workspace is cut by the hero card's right edge where desktop cuts it; the Design with a Drag editors run edge to edge, the hero's cut on both sides around the canvas and "Grab a block"'s cut after the canvas toolbar; the E-commerce product and cart cards are cropped to themselves (`FeatureHero` `visual.phoneCrop`); the MCP and API code window is cropped to its code (`DevCodePanel phoneCrop`) and scrolls by above the tiles, which pin on their own. Build with Sol's "You direct" preview is 4:3 so more of the site shows above its prompt. The Build with Sol hero prompt and E-commerce's final CTA wrap their prompts (up to three lines) with "Build it" under them, as on the For You heroes and the home final CTA. On Templates the category checklist becomes a chip row like the Blog's ("All", then the categories; several can be on). Tap targets reach about 44px (the hero and final-CTA text links, now 14px; the Resources filter chips, whose row also slides a chip tapped at its edge into view; the template type chips and search; "Back to …"; "Copy Link"; "Clear search"). The pills over the MCP diagram and "Prompt from your terminal." keep 12px labels.

## Interactions

- Buttons use the design system's hover, pressed and focus states.
- The nav bar is Figma "Navigation" (1042:18288): Features, Solution, Pricing, Developers, Resources, then "Log in" and "Start free". From 768px up, *Features*, *Solution* and *Resources* open menus (Figma 565:2852; the Solution dropdown 565:2838 and its three siblings; 942:6996). With a mouse they open on hover; with touch, on a tap. From the keyboard, Enter, Space or ↓ opens them, ↑ ↓ move through the links and Esc closes. In *Solution*, the hovered or focused audience shows its own photo. *Developers* opens the For Developers page (/solutions/developers). "Log in" opens `/login` and "Start free" (also the phone bar's and the phone menu's) opens `/signup`: `LOGIN_HREF` and `SIGNUP_HREF` in `src/sections/navData.ts`, where the menu items also live, shared with the phone menu.
- On phones the bar follows Figma "Mobile navigation" (logo, a Small "Start free", menu button; the button's tap area is 44px, Figma's 40). The menu button opens the menu (Figma 555:2757 / 555:2816) as a 320px drawer from the right, with the page dimmed beside it; its rows follow the desktop bar, and Features, Solution and Resources expand in place, one at a time. Its "Start free" is Size=Large (Figma: Small). While it is open the page behind can't scroll or take focus; Esc or a tap on the dimmed page closes it.
- The home hero's boxed word types itself out in turn: Business, Products, Services. The hero picture plays the "Hero storyboard" (Figma 1133:16152) on a loop: prompt, click, thinking, live, the site on desktop and phone (`HeroStory`; see `MOTION.md`). It starts only once the visitor has scrolled to the picture, and then at once, and loops; once the picture has left the screen it rewinds, so every visit starts from the beginning. It is described for screen readers in a hidden line of text.
- The feature strip glides slowly in a loop and pauses on hover.
- *Built around the way you create* is a set of keyboard-accessible tabs (arrow keys, Home and End); the panels crossfade. In "Start with a template" the template row glides in a loop; drag, swipe or the arrow keys move it, and it pauses on hover.
- The MCP and Build with AI diagrams' dashes flow toward Plexo and the live site.
- On the MCP and API page, the code window is built live (not an image) and types itself out once it scrolls into view; the five developer tiles beside it pin and stack as you scroll.
- The Monthly/Yearly toggle switches the Starter and Pro prices.
- The home *See what people are building* stories (MeerHQ and PAR Nursing Hub, the two variants of Figma "Component 10") scroll sideways: swipe, or the arrows, which grey out when there is no story that way. The site screenshot always shows whole: on windows narrower than 1360px it scales down with the card (the quote steps down to 16px beside it), and below 1200px the card stacks. Side by side, the card rounds only its right corners, as in Figma; stacked, it rounds all four. The solution pages show the same stories.
- The FAQ is an accordion with one item open at a time; the open item's plus turns into a minus. The home page shows its first 7 questions and opens on the first; "See more" unfolds the other 7 and moves focus to the first of them. The pricing page has its own questions (Figma "FAQ Pricing", 613:19248) and opens on the last one, as its Figma instance does. Build with Sol and E-commerce have their own too (see `src/sections/Faq.tsx`); E-commerce's start closed.
- The footer is shared by every page. Its "Log in" opens `/login`. Its email field checks the address but isn't connected to a mailing list yet, and items with no page yet (Help center, the Company and legal links, the social icons) are plain text until they get a URL in `src/sections/Footer.tsx`.
