Photos for Jaffet Corona (paths are set in lib/athletes.js)

Replace these placeholder files with real photos, keeping the SAME names:

  PROFILE
  avatar.jpg      square headshot (~800 x 800)
  cover.jpg       wide action shot, landscape (~1920 x 1080) — page banner + campaign hero

  RACE KIT  (where sponsor logos go — shown with numbered placement pins)
  kit-front.jpg   standing straight, facing camera, arms relaxed at sides
  kit-back.jpg    same pose, back to camera
  kit-side.jpg    same pose, his RIGHT side facing camera
                  Portrait 4:5 (~1200 x 1500). Wear the race shirt + shorts,
                  full body head-to-feet, plain background, same distance for all 3.

  TRAINING  (4-up grid, portrait ~1200 x 1500)
  gallery-1.jpg   running
  gallery-2.jpg   sled push / pull
  gallery-3.jpg   wall balls
  gallery-4.jpg   strength work

If the numbered pins don't sit exactly on the right body spot once the real kit
photos are in, nudge the x / y numbers under `placements` in lib/athletes.js
(percentages from the top-left of the photo).

After the race, add race-day photos (e.g. race-1.jpg) and list them under `raceDay`.
Next.js resizes/compresses them automatically, but keep each file under ~3 MB.
