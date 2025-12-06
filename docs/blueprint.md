# **App Name**: The Looksmaxx & Gorbagana Community Connection

## Core Features:

- Profile Generation: Generates a one time editable profile for 'looksmaxxing' & 'Gorbagana' related profiles (oscar the grouch, cookie monster, big bird, etc.)
- Photo Analysis (Mock): Simulates a photo scan to provide humorous looksmaxxing advice and suggest joining the Gorbagana community.
- Swipe Deck: Implements a Tinder-like card stack with drag physics and satirical 'Mog' or 'It's Over' stamps on swipe.
- Match Chat: Enables users to chat with matched profiles, with AI-generated replies from recruiter profiles emphasizing technical skills over physical appearance.
- Global State Updates: The state of this application (chats and swipes) should be persistent.  Edited profiles can be added to by any member on the app if the edit feature has been enabled (non editable if not enabled) all profiles come editable as default.
- Profile Stats Generation: Calculate/generate/suggest stats for each of the user profiles.

## Style Guidelines:

- Primary color: Emerald Green (#10b981) for 'Mog' elements, symbolizing success.
- Secondary color: Rose Red (#f43f5e) for rejections or failures; use for the 'It's Over' stamps.
- Accent color: Purple (#a855ba) for Gorbagana/tech-related branding and interactive elements, emphasizing the community aspect.
- Background: Black (#000000) as the base color to embrace a Cyberpunk/Hacker Terminal theme
- Font: 'Rajdhani' (sans-serif) from Google Fonts; use for a tech-future look.
- Utilize Lucide React or HeroIcons for SVGs for navigation and action buttons.
- Employ a card-based layout for profile display and swiping, and a clear, terminal-inspired layout for chat and analysis results.
- Apply scanline, noise overlays, and glitch effects, particularly during swipe actions and photo analysis. Use the CSS/Tailwind animations: 'scan', 'shimmer', and 'float'.