# TODO (Simple)

## Goal
Update the placeholder portrait (`Portrait 1.jpg`) for the leadership team with the correct new image.

---

## Steps
1) **Find where the leadership images are shown**
   - Open: `src/App.tsx`
   - Search for: `LEADERSHIP_TEAM.map`
   - Inside the `<img src={member.imageUrl} ... />` you’ll see the image comes from `member.imageUrl`.

2) **Find which person is using `Portrait 1.jpg`**
   - Open: `src/data.ts`
   - Look at `LEADERSHIP_TEAM`.
   - You will see entries like `Bishop Jimmy Kimani`, `Bishop Simon Kaniaru`, etc. using `imageUrl: placeholderPortrait`.

3) **Add the new image import**
   - In `src/data.ts`, add an import for the new image (example pattern):
     - `import newPortrait from './assets/images/<NEW-FILENAME>.jpg';`

4) **Update only the correct team member**
   - In `LEADERSHIP_TEAM`, change just the one member you want:
     - from: `imageUrl: placeholderPortrait`
     - to: `imageUrl: newPortrait`

5) **Build to confirm no errors**
   - Run:
     - `npm run build`

---

## Done when
- The correct portrait shows up for the selected leadership member in the “APOSTOLIC BISHOPS” section.
- `npm run build` succeeds.

