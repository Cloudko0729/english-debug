# 3D Coin Pusher Physics Problem — cannon-es + three.js

## Problem
Coins pile up high (5-10+ layers) instead of being pushed forward and falling off the front edge.
When plate pushes, only bottom coins move — upper coins stay in place (like a cliff).
Tried: invisible ceiling (too thin → tunneled through; too thick → coins float/compress).

## Current Setup (cannon-es 0.20 + three.js 0.160)

### World
- gravity: (0, -9.8, 0)
- world.step(1/60) — single step, NO substeps
- allowSleep: true
- broadphase: SAPBroadphase

### Table
- staticBox(8, 1, 9) at y=-0.5 → table top at y=0
- Front edge at z≈4 (coins past z>5.6 = score)

### Plate (KINEMATIC)
- Box: w=7.94, h=1.5, d=7.0
- Oscillates z: -5.7 ↔ -3.4 (sinusoidal, period ~3.5s)
- Velocity driven: `plateBody.velocity.z = (targetZ - pos.z) * 54`
- Plate front face ranges: z=-2.2 (back) to z=0.1 (forward)

### Coins
- Cylinder(r, r, 0.16, 12) — flat discs
- Types: gold(mass:6, r:0.55), silver(mass:3.5, r:0.52), rainbow(mass:2, r:0.50)
- sleepSpeedLimit: 0.25, sleepTimeLimit: 0.6
- Dropped from y=3.4~4.2, z=-3.7~-0.2 (above plate) with random spin
- MAX 170 coins on table

### Contact Materials
- coin-table: friction 0.2, restitution 0.1
- coin-coin: friction 0.4, restitution 0.1

### Walls
- Left/right walls at x=±4.18 (visible 3.4h + invisible 6h)
- Back wall at z=-5.2 (visible 3.6h + invisible 6h)
- Front invisible ceiling: staticBox(8, 0.3, 4.2) at y=0.78, z=2.0

## What I need
1. Why do coins pile instead of flowing forward? Is it a cannon-es limitation with flat cylinders?
2. What specific parameter changes (with exact values) would make coins behave like a real coin pusher?
3. Should I use a different approach entirely (e.g. no sleep, custom forces, tilt the table)?
4. Give me a concrete patch — list each change as: WHAT → OLD → NEW → WHY
