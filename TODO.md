# TODO - MovieHub Error Handling & Stability

- [ ] Add React Error Boundary with modern fallback UI (retry + auto refresh)
- [ ] Create reusable components: ErrorPage, LoadingSpinner, EmptyState, RetryButton
- [ ] Add toast notifications using `react-toastify` with dark-theme compatible styling and auto dismiss
- [ ] Add console-safe logger (dev detailed, prod hidden/minimal)
- [ ] Refactor `frontend/src/utils/tmdb.js` to normalize API/network errors (timeout, 401/403, 404, 429, invalid responses)
- [ ] Update pages to use reusable loading/empty/error UIs and handle TMDB errors gracefully
- [ ] Add route-level protection: custom NotFoundPage + catch-all route
- [ ] Prevent white screen crashes: ensure key pages/images have safe fallbacks
- [ ] Improve async handling: ensure try/catch + cleanup patterns in critical page effects
- [ ] Ensure production stability: graceful degradation + lazy/image fallback
- [ ] Verify build and Vercel compatibility (`npm run build` in frontend)

