# Verification

Checked September 18, 2026, before the initial public release.

## Build and structure

- Five guide pages plus collection homepage build without packages or a runtime framework.
- X1: 8 bosses, 16 pickup records, 47 anchors.
- X2: 8 bosses, 16 pickup records, 65 anchors.
- X3: 8 bosses, 24 location records (20 regular pickups + four optional chip alternatives), 67 anchors.
- X4 X: 8 bosses, 16 pickups, 46 anchors.
- X4 Zero: 8 bosses, 12 pickups, 41 anchors.
- All local page and asset links and fragment references resolve. Return disclosures reuse valid original item IDs. Every pickup has sourced image metadata or a character-specific video.
- All four X3 chip records are marked skip for Gold. Zero has no armor records and does not reuse X's Cyber Peacock reward-room pictures.
- No initial iframe, external script, font, account, analytics or database. Shared CSS ~23KB; JavaScript ~8KB. 109 local media files total 5,122,372 bytes. Media is loaded lazily and shared between pages.

## Browser checks

At 940×1277, no guide has horizontal overflow. Maximum measured stage heights: X1 992px, X2 854px, X3 1,038px, X4 X 944px, X4 Zero 965px. These leave room for the sticky header and anchor offset. Visually reviewed X3's three-card Neon Tiger stage including the red detour checkpoint, and Zero's three-card Frost Walrus stage with complete screenshots.

At 320×800, all five pages have no horizontal overflow; the compact header is 107px high. A 390px pass also confirmed the sidebar is collapsed. Small screens use vertical scrolling; no content is clipped to force a fixed height.

Volt Catfish's return disclosure opens both remaining pickups together. Opening its body screenshot focuses Close; Tab stays in the viewer; Escape closes it, returns focus to the originating image link and preserves scrollY 11,582. Navigating to the collection and back restored that scroll position, the expanded disclosure and the Return trips navigation highlight.

The Games menu switches X4 Zero to X correctly. Each campaign has its own storage ID and selected campaign tab. Zero's Cyber Peacock cards display the correct room 2/3 requirements and distinct timestamped video controls. No console errors observed during the final local pass.

## Content and limits

X2 detour update: all eight entrance/approach images load from local assets. Verified the expanded cards at 940px and 390px with no horizontal overflow. Clicking a screenshot opens the existing viewer; Escape closes it and returns focus to the originating link. Build, inventory, page/asset links and diff checks pass across all five campaign pages. These frames show the relevant approach landmarks; source timestamps and creator credits are retained in the bottom credits.

Game routes were cross-checked against the linked stage/item sources; see content-audit.md for decisions and resolved contradictions. All added images were visually inspected, including the replacement X4 isolated sprites. The site has not been validated by a complete console/emulator playthrough. Frame fit is specific to measured viewports and normal text size; longer future content and enlarged text can require scrolling.

Reading state belongs to one browser profile and origin. Clearing browser data removes it; it does not sync between devices or migrate from a previous hostname.

2026-09-18: Added source-checked Useful tips sections to X1, X2, X3 and both X4 campaigns, with contextual refill links. Built each completed game update sequentially; verify-all passed for all six HTML pages, local media, unique anchors, return cards and character differences. git diff --check passed. Crystal Snail movement and refill advice are source/user-checked, not emulator-tested. No new media, scripts, styles or dependencies were added to the site. X5-X8 remain outside this update.
