# TODO - Blank page / Registration not displaying

## Step 1 - Instrument mount/render failures
- [x] Update `src/main.tsx` to wrap `createRoot(...).render(...)` in try/catch and show a visible error in `#root`.
- [x] Add temporary CSS in `src/index.css` to ensure `#root` has `min-height: 100vh`.


## Step 2 - Add render-time error boundary
- [x] Update `src/App.tsx` to wrap app UI with an ErrorBoundary component.


## Step 3 - Re-test
- [ ] Run dev server and open the page; verify that instead of a blank page, an error message appears.
- [ ] If an error appears, fix the underlying runtime exception.

