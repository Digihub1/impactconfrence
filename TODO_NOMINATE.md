# TODO_NOMINATE.md — Awards Nomination Redirect

- [ ] Inspect `src/App.tsx` awards section and add click handler to the “Nominate a Leader” button.
- [ ] Implement React state-driven view swap for a dedicated nomination view.
- [ ] Wrap state changes in View Transition API (`document.startViewTransition`) when available.
- [ ] Simulate route `/nominate` via `history.pushState` and support back via `popstate`.
- [ ] Create nomination form UI in React (amber Award Categories, blue Judging Criteria).
- [ ] Implement form submission handler in React (no `document.body.innerHTML` injection).
- [ ] Add a way to close/back to awards view.
- [x] Build/verify `npm run build` compiles and click behavior works.

