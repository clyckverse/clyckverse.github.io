@echo off
REM ============================================================
REM  Run this INSIDE the "portfolio" folder (cmd).
REM  Creates the folder structure + blank Group A files to paste into.
REM  It does NOT touch config files you already made
REM  (package.json, package-lock.json, astro.config.mjs, tsconfig.json, .gitignore).
REM  It does NOT create binaries (models .glb / videos .mp4 / images .jpg) -
REM  drop those in the folders it makes, or regenerate (see bottom).
REM ============================================================


echo Creating folders...
mkdir src\styles           2>nul
mkdir src\layouts          2>nul
mkdir src\components\react 2>nul
mkdir src\pages\projects   2>nul
mkdir src\data             2>nul
mkdir src\scripts          2>nul
mkdir public\drawings      2>nul
mkdir public\models        2>nul
mkdir public\video\desktop 2>nul
mkdir public\video\mobile  2>nul
mkdir public\photos        2>nul
mkdir public\about         2>nul


echo Creating blank code/text files...
type nul > "src\styles\global.css"
type nul > "src\styles\tailwind.css"
type nul > "src\layouts\Base.astro"
type nul > "src\components\Hero.astro"
type nul > "src\components\react\Preloader.tsx"
type nul > "src\components\react\WorkGallery.tsx"
type nul > "src\pages\index.astro"
type nul > "src\pages\projects\[slug].astro"
type nul > "src\data\site.json"
type nul > "src\data\projects.json"
type nul > "src\data\photos.json"
type nul > "src\scripts\gen_models.py"
type nul > "src\scripts\gen_drawings.py"
type nul > "public\video\README.txt"


echo Creating blank drawing SVGs (18)...
for %%s in (riverside-pavilion courtyard-house vertical-studio market-hall concrete-chapel hillside-studios) do (
 type nul > "public\drawings\%%s-plan.svg"
 type nul > "public\drawings\%%s-section.svg"
 type nul > "public\drawings\%%s-elevation.svg"
)


echo.
echo ============================================================
echo  Done. Blank Group A files + folders created.
echo.
echo  NEXT:
echo   1) Paste each file's content into the matching blank file.
echo   2) Put the config files you made in the portfolio root.
echo   3) Drop binary assets into:
echo        public\models    (.glb)
echo        public\video\desktop and public\video\mobile  (.mp4)
echo        public\photos and public\about and public\drawings  (.jpg)
echo   4) Run:  npm install
echo   5) Preview:  npm run dev     Build:  npm run build
echo.
echo  TIP: the 18 drawing SVGs can be auto-generated instead of pasted:
echo        python src\scripts\gen_drawings.py
echo ============================================================
pause





