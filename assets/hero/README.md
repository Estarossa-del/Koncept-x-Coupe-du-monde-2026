# Door Hero — Assets

Place tes deux images dans ce dossier :

- `porte_fermee.png` — état AVANT le coup d'envoi (porte gravée fermée)
- `porte_ouverte.png` — état APRÈS le coup d'envoi (porte ouverte, lumière qui jaillit)

## Logique de bascule

Le composant `DoorHero` (dans `index.html`) bascule automatiquement à
**11 juin 2026 — 20h00 heure de Mexico (UTC-6)**.

- `now < KICKOFF` → affiche `porte_fermee.png` + countdown live
- `now >= KICKOFF` → affiche `porte_ouverte.png` + message « La Coupe du Monde a commencé »

## Recommandations

- Format : **WebP** (plus léger) ou **PNG** (compatibilité)
- Dimensions : **1080×1500px** minimum (ratio 0.72)
- Poids : viser < 500 KB par image
- Compression : `cwebp -q 85 porte_fermee.png -o porte_fermee.webp`

Si les fichiers sont absents, le composant utilise un fallback CSS
(gradient stone gravé) qui reste élégant en attendant.
assets/hero/porte_fermee.png   ← première image que tu as envoyée
assets/hero/porte_ouverte.png  ← celle que tu viens d'envoyer
