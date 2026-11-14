# Love Iteration roadmap

L001–L307 built the first version (a journal and sharing server, now set aside). **From L308 the project is a gallery of small ASCII and three.js art pieces.** Each line is one task with an observable completion check; the first unchecked task is next. A piece is one task and must meet the craft bar in [ARCHITECTURE.md](docs/ARCHITECTURE.md). See [AGENTS.md](AGENTS.md) for the daily workflow.

## 01 Foundation and app shell

- [x] L001 Create Vite React TypeScript app — Done when npm run dev shows the Love Iteration heading.
- [x] L002 Add build and typecheck scripts — Done when both commands exit successfully.
- [x] L003 Add Vitest test runner — Done when one sample domain test passes.
- [x] L004 Add Playwright browser test runner — Done when a browser smoke test opens the app.
- [x] L005 Add ESLint configuration — Done when npm run lint exits successfully.
- [x] L006 Add Prettier formatting script — Done when npm run format:check exits successfully.
- [x] L007 Add strict TypeScript settings — Done when invalid implicit any fails typecheck.
- [x] L008 Create source folder boundaries — Done when domain, data, features, and ui folders exist with index files.
- [x] L009 Define app route names — Done when route type lists Home, Check-in, Ideas, and Settings.
- [x] L010 Render Home route — Done when direct load displays a home heading.
- [x] L011 Render Settings route — Done when navigation opens Settings.
- [x] L012 Add shared page layout — Done when Home and Settings use the same header.
- [x] L013 Add skip-to-content link — Done when keyboard focus can skip the header.
- [x] L014 Add visible focus style — Done when links and buttons show a focus ring.
- [x] L015 Define color tokens — Done when light palette renders without literal component colors.
- [x] L016 Define typography tokens — Done when headings and body use shared scale.
- [x] L017 Add narrow-screen spacing — Done when Home has no horizontal overflow at 320px.
- [x] L018 Create Button component — Done when unit test covers disabled and click behavior.
- [x] L019 Create TextField component — Done when label connects to its input.
- [x] L020 Create TextArea component — Done when label connects to its control.
- [x] L021 Create EmptyState component — Done when empty text is announced as content.
- [x] L022 Create InlineError component — Done when error message has alert semantics.
- [x] L023 Create LoadingState component — Done when busy state has status semantics.
- [x] L024 Add GitHub Actions checks — Done when pull requests run lint, typecheck, tests, and build.
- [x] L025 Add no-tracking CSP baseline — Done when static page blocks unlisted remote scripts.
- [x] L026 Define domain record metadata — Done when type includes id, schemaVersion, createdAt, updatedAt.
- [x] L027 Add ID generator — Done when generated IDs are valid and distinct in a test.
- [x] L028 Add ISO timestamp helper — Done when test freezes time and checks output.
- [x] L029 Define repository interface — Done when type supports get, list, put, and delete.
- [x] L030 Add shell browser smoke test — Done when Playwright navigates Home to Settings.

## 02 Personal check-ins

- [x] L031 Define check-in record — Done when type contains date, mood, note, and record metadata.
- [x] L032 Validate mood choice — Done when unsupported value returns a domain error.
- [x] L033 Validate local date — Done when malformed date is rejected in a test.
- [x] L034 Add IndexedDB database opener — Done when schema creates checkins store.
- [x] L035 Add check-in repository save — Done when read-after-write test returns the record.
- [x] L036 Add check-in repository list — Done when test returns newest date first.
- [x] L037 Add check-in repository delete — Done when deleted record is absent in a test.
- [x] L038 Render Check-in route — Done when navigation opens the check-in screen.
- [x] L039 Add mood selection controls — Done when keyboard can select one mood.
- [x] L040 Add note field — Done when a check-in accepts optional plain text.
- [x] L041 Add check-in submit action — Done when saved check-in appears in the view.
- [x] L042 Reject empty mood submit — Done when an inline error appears and nothing is saved.
- [x] L043 Limit note length — Done when over-limit note shows remaining limit.
- [x] L044 Add today's check-in summary — Done when Home shows the saved mood.
- [x] L045 Allow one check-in per day — Done when repeat save updates the same day.
- [x] L046 Show today's edited time — Done when summary renders updatedAt in local time.
- [x] L047 Add edit-today control — Done when saved values populate the form.
- [x] L048 Add delete-today control — Done when confirmation precedes deletion.
- [x] L049 Add check-in history list — Done when earlier dates appear under a heading.
- [x] L050 Add history empty state — Done when first-time users see clear instructions.
- [x] L051 Add history date labels — Done when today and older dates are distinguishable.
- [x] L052 Add history mood labels — Done when icons have visible text alternatives.
- [x] L053 Add history pagination — Done when more than 30 items loads another page.
- [x] L054 Add check-in detail view — Done when selected entry shows complete note.
- [x] L055 Add previous-day navigation — Done when detail can move to an older entry.
- [x] L056 Add next-day navigation — Done when detail can move to a newer entry.
- [x] L057 Add keyboard check-in flow test — Done when tab, select, save, and focus work.
- [x] L058 Add persistence browser test — Done when check-in survives a page reload.
- [x] L059 Add check-in migration test — Done when older schema opens without losing records.
- [x] L060 Add check-in privacy copy — Done when screen states entries stay on this device.

## 03 Gratitude and memories

- [x] L061 Define gratitude record — Done when type includes text, date, and metadata.
- [x] L062 Validate gratitude text — Done when blank text is rejected in a test.
- [x] L063 Add gratitude store — Done when IndexedDB migration creates gratitude store.
- [x] L064 Add gratitude save method — Done when repository round trip passes.
- [x] L065 Add gratitude list method — Done when newest entries appear first.
- [x] L066 Add gratitude delete method — Done when deletion test passes.
- [x] L067 Render Gratitude route — Done when navigation opens the page.
- [x] L068 Add gratitude composer — Done when user can save one appreciation.
- [x] L069 Add gratitude empty state — Done when page suggests a first entry.
- [x] L070 Show gratitude cards — Done when text and creation date are visible.
- [x] L071 Add gratitude edit action — Done when edited text persists after reload.
- [x] L072 Add gratitude delete confirmation — Done when cancel preserves the entry.
- [x] L073 Add gratitude character limit — Done when oversized entry is blocked.
- [x] L074 Add gratitude Home preview — Done when most recent appreciation appears on Home.
- [x] L075 Add gratitude week count — Done when count matches saved entries for current week.
- [x] L076 Add gratitude filter by month — Done when selection limits visible cards.
- [x] L077 Add gratitude keyboard test — Done when create and delete are operable by keyboard.
- [x] L078 Define memory record — Done when type includes title, date, note, and metadata.
- [x] L079 Validate memory title — Done when blank title is rejected.
- [x] L080 Add memories store — Done when IndexedDB migration creates memories store.
- [x] L081 Add memory save method — Done when repository round trip passes.
- [x] L082 Add memory list method — Done when entries sort by date.
- [x] L083 Render Memories route — Done when navigation opens the page.
- [x] L084 Add memory composer — Done when title and date save a memory.
- [x] L085 Add optional memory note — Done when note persists after reload.
- [x] L086 Add memory detail — Done when selected card shows full fields.
- [x] L087 Add memory edit — Done when title, date, and note changes persist.
- [x] L088 Add memory delete — Done when confirmation and removal work.
- [x] L089 Add memories empty state — Done when first-use copy shows what to add.
- [x] L090 Add gratitude and memory browser test — Done when saved entries survive reload.

## 04 Date ideas and plans

- [x] L091 Define date idea record — Done when type includes title, note, state, and metadata.
- [x] L092 Validate idea title — Done when empty or whitespace title is rejected.
- [x] L093 Add idea store — Done when IndexedDB migration creates idea store.
- [x] L094 Add idea save method — Done when repository round trip passes.
- [x] L095 Add idea list method — Done when active ideas sort above completed.
- [x] L096 Add idea delete method — Done when deletion test passes.
- [x] L097 Render Ideas route — Done when navigation opens the board.
- [x] L098 Add new idea form — Done when valid title creates a card.
- [x] L099 Add optional idea note — Done when note appears on the card.
- [x] L100 Add idea empty state — Done when page shows a first-idea prompt.
- [x] L101 Add completed toggle — Done when idea moves between active and completed.
- [x] L102 Add idea edit — Done when title and note updates persist.
- [x] L103 Add idea delete confirmation — Done when cancel leaves the card.
- [x] L104 Add idea category field — Done when category saves with the idea.
- [x] L105 Add category selector — Done when a category can be chosen by keyboard.
- [x] L106 Add category filter — Done when selected category limits cards.
- [x] L107 Add text search — Done when title or note match appears.
- [x] L108 Add clear-search action — Done when full list returns.
- [x] L109 Add active and completed counts — Done when counts match repository data.
- [x] L110 Add idea Home preview — Done when Home links to one active idea.
- [x] L111 Define planned date record — Done when type includes ideaId, startsAt, and status.
- [x] L112 Validate planned date time — Done when invalid timestamp is rejected.
- [x] L113 Add planned date store — Done when migration creates plans store.
- [x] L114 Add schedule action — Done when an idea can get a date and time.
- [x] L115 Add plan list — Done when future plans sort soonest first.
- [x] L116 Add plan edit action — Done when changed time persists.
- [x] L117 Add plan cancellation — Done when cancelled item leaves upcoming list.
- [x] L118 Add plans Home preview — Done when next planned date appears on Home.
- [x] L119 Add board browser test — Done when create, filter, complete, and reload work.
- [x] L120 Add plans browser test — Done when schedule and cancel flow works.

## 05 Rituals and habits

- [x] L121 Define ritual record — Done when type includes name, cadence, and metadata.
- [x] L122 Validate ritual name — Done when empty name is rejected.
- [x] L123 Validate cadence — Done when only daily and weekly values pass.
- [x] L124 Add ritual store — Done when IndexedDB migration creates rituals store.
- [x] L125 Add ritual save method — Done when repository round trip passes.
- [x] L126 Add ritual list method — Done when active rituals return in name order.
- [x] L127 Render Rituals route — Done when navigation opens the page.
- [x] L128 Add ritual creation form — Done when name and cadence create a ritual.
- [x] L129 Add ritual empty state — Done when first-use instructions are shown.
- [x] L130 Add ritual edit action — Done when name and cadence changes persist.
- [x] L131 Add ritual archive action — Done when archived ritual leaves active list.
- [x] L132 Add archived ritual view — Done when archived records remain readable.
- [x] L133 Define ritual completion record — Done when type links ritual and local date.
- [x] L134 Add completion store — Done when migration creates completions store.
- [x] L135 Add mark-today action — Done when daily ritual records today's completion.
- [x] L136 Prevent duplicate completion — Done when second click does not create another record.
- [x] L137 Add undo-today action — Done when today's completion can be removed.
- [x] L138 Add weekly completion action — Done when weekly ritual records week start.
- [x] L139 Add ritual last-done label — Done when card shows most recent completion.
- [x] L140 Add daily ritual Home preview — Done when due rituals appear on Home.
- [x] L141 Add weekly ritual Home preview — Done when due weekly ritual appears on Home.
- [x] L142 Add ritual history — Done when detail lists completion dates.
- [x] L143 Add ritual streak helper — Done when pure function counts consecutive periods.
- [x] L144 Add ritual streak display — Done when detail shows tested streak count.
- [x] L145 Add ritual pause field — Done when paused ritual is not shown as due.
- [x] L146 Add ritual resume action — Done when resumed ritual reappears when due.
- [x] L147 Add ritual deletion confirmation — Done when cancel preserves history.
- [x] L148 Add ritual browser test — Done when create, complete, undo, and reload work.
- [x] L149 Add weekly boundary test — Done when week rollover uses local dates correctly.
- [x] L150 Add ritual privacy copy — Done when no partner visibility is implied.

## 06 Weekly reflection

- [x] L151 Define reflection record — Done when type contains weekStart and four optional prompts.
- [x] L152 Validate reflection week — Done when malformed weekStart is rejected.
- [x] L153 Add reflection store — Done when migration creates reflections store.
- [x] L154 Add reflection save method — Done when repository round trip passes.
- [x] L155 Add reflection list method — Done when newest week appears first.
- [x] L156 Render Reflection route — Done when navigation opens the page.
- [x] L157 Show current week dates — Done when range follows locale week setting.
- [x] L158 Add what-worked prompt — Done when response saves on submit.
- [x] L159 Add what-was-hard prompt — Done when response saves on submit.
- [x] L160 Add what-to-try prompt — Done when response saves on submit.
- [x] L161 Add appreciation prompt — Done when response saves on submit.
- [x] L162 Allow partial reflection — Done when one answered prompt can save.
- [x] L163 Add current-week edit — Done when saved responses refill the form.
- [x] L164 Prevent duplicate week record — Done when save updates the existing week.
- [x] L165 Add reflection preview — Done when Home shows current week status.
- [x] L166 Add reflection history list — Done when prior weeks are browsable.
- [x] L167 Add reflection detail — Done when selected week shows all responses.
- [x] L168 Add reflection delete confirmation — Done when cancel preserves entry.
- [x] L169 Add optional check-in summary — Done when reflection shows week's mood labels.
- [x] L170 Add optional gratitude summary — Done when reflection shows week's entries count.
- [x] L171 Add optional ritual summary — Done when reflection shows completed count.
- [x] L172 Add selected next action — Done when user can save one short next-step text.
- [x] L173 Show next action on Home — Done when saved action is visible until next week.
- [x] L174 Add copy-previous action — Done when selected prior response is copied explicitly.
- [x] L175 Add reflection print layout — Done when printed detail omits controls.
- [x] L176 Add reflection keyboard test — Done when prompts and save work with keyboard.
- [x] L177 Add reflection browser test — Done when partial save survives reload.
- [x] L178 Add timezone boundary test — Done when week selection stays stable near midnight.
- [x] L179 Add reflection empty state — Done when first week has calm guidance.
- [x] L180 Add no-judgment copy review — Done when UI makes no partner performance claims.

## 07 Timeline and discovery

- [x] L181 Define timeline entry shape — Done when type covers every local record kind.
- [x] L182 Map check-in to timeline — Done when date and summary match source record.
- [x] L183 Map gratitude to timeline — Done when date and summary match source record.
- [x] L184 Map memory to timeline — Done when date and summary match source record.
- [x] L185 Map plan to timeline — Done when date and summary match source record.
- [x] L186 Map ritual completion to timeline — Done when date and summary match source record.
- [x] L187 Map reflection to timeline — Done when week and summary match source record.
- [x] L188 Merge timeline sources — Done when pure function orders entries newest first.
- [x] L189 Resolve same-time ties — Done when stable ID order makes output deterministic.
- [x] L190 Render Timeline route — Done when navigation opens the feed.
- [x] L191 Add timeline empty state — Done when new account sees explanation.
- [x] L192 Add timeline card links — Done when card opens its source detail.
- [x] L193 Add timeline kind filter — Done when selected kinds limit results.
- [x] L194 Add timeline date range — Done when outside dates are excluded.
- [x] L195 Add timeline clear filters — Done when all entries return.
- [x] L196 Add timeline pagination — Done when feed loads 30 items at a time.
- [x] L197 Add timeline month headings — Done when month groups are labeled.
- [x] L198 Add timeline keyboard navigation — Done when cards are reachable in order.
- [x] L199 Add search index helper — Done when records produce normalized search text.
- [x] L200 Add global search input — Done when query matches supported record text.
- [x] L201 Add search result grouping — Done when results are labeled by kind.
- [x] L202 Add search no-results state — Done when query feedback is shown.
- [x] L203 Add search clear action — Done when query and results reset.
- [x] L204 Add search keyboard shortcut — Done when slash focuses search outside inputs.
- [x] L205 Add search privacy note — Done when query stays local to the device.
- [x] L206 Add date-range boundary test — Done when endpoints are included correctly.
- [x] L207 Add timeline merge test — Done when six source kinds order correctly.
- [x] L208 Add search normalization test — Done when case and whitespace do not alter matches.
- [x] L209 Add timeline browser test — Done when filters survive back navigation.
- [x] L210 Add search browser test — Done when query opens the right detail.

## 08 Portability and privacy

- [x] L211 Define export schema version — Done when export envelope has a version and timestamp.
- [x] L212 Add export serializer — Done when all six record kinds are included.
- [x] L213 Exclude transient UI state — Done when export has no search or draft state.
- [x] L214 Add export JSON download — Done when user gets a named local file.
- [x] L215 Add export preview counts — Done when dialog lists per-kind counts.
- [x] L216 Add export browser test — Done when downloaded file parses as expected.
- [x] L217 Add import schema validator — Done when malformed root object is rejected.
- [x] L218 Validate imported IDs — Done when missing or duplicate IDs are reported.
- [x] L219 Validate imported dates — Done when invalid dates are reported before writing.
- [x] L220 Add import dry run — Done when preview shows incoming counts without writes.
- [x] L221 Add import file chooser — Done when JSON file can be selected by keyboard.
- [x] L222 Add import confirmation — Done when no records change before confirmation.
- [x] L223 Add import merge rule — Done when existing IDs are updated by newer updatedAt.
- [x] L224 Add import conflict summary — Done when skipped or changed counts are visible.
- [x] L225 Add import transaction — Done when failed import leaves storage unchanged.
- [x] L226 Add import success message — Done when user sees final counts.
- [x] L227 Add import browser test — Done when export and re-import restore records.
- [x] L228 Add full data delete action — Done when confirmation explains local removal.
- [x] L229 Add full data delete test — Done when all domain stores become empty.
- [x] L230 Add per-kind delete action — Done when selected record kind alone is cleared.
- [x] L231 Add privacy dashboard — Done when settings lists locally stored record counts.
- [x] L232 Add storage availability check — Done when unsupported browser shows a clear error.
- [x] L233 Add storage quota warning — Done when write failure offers export instructions.
- [x] L234 Add app version display — Done when Settings shows build version.
- [x] L235 Add privacy policy page — Done when page accurately describes local storage.
- [x] L236 Add data model documentation — Done when each record and export field is described.
- [x] L237 Add migrations rollback fixture — Done when bad migration leaves old data available.
- [x] L238 Add screen reader pass — Done when key forms announce labels and errors.
- [x] L239 Add keyboard-only pass — Done when every primary flow works without pointer.
- [x] L240 Tag offline release candidate — Done when local-only build and checks pass.

## 09 Self-hostable API foundation

- [x] L241 Create API workspace package — Done when api has its own build and test scripts.
- [x] L242 Add API health endpoint — Done when GET /health returns version and status.
- [x] L243 Add API input validation helper — Done when invalid JSON body yields 400.
- [x] L244 Add API error response shape — Done when known errors share code and message fields.
- [x] L245 Add request ID middleware — Done when each response includes a request ID.
- [x] L246 Add safe request logging — Done when journal text never appears in logs.
- [x] L247 Add SQLite connection module — Done when test opens an in-memory database.
- [x] L248 Add migration runner — Done when schema version advances exactly once.
- [x] L249 Create accounts table — Done when migration and schema test pass.
- [x] L250 Create spaces table — Done when migration and schema test pass.
- [x] L251 Create memberships table — Done when migration and schema test pass.
- [x] L252 Create invites table — Done when migration and schema test pass.
- [x] L253 Create records table — Done when migration and schema test pass.
- [x] L254 Create tombstones table — Done when migration and schema test pass.
- [x] L255 Create sync cursors table — Done when migration and schema test pass.
- [x] L256 Add database backup command — Done when copied database passes integrity check.
- [x] L257 Add startup migration check — Done when server refuses unsupported newer schema.
- [x] L258 Add config validation — Done when missing secret produces a useful startup error.
- [x] L259 Add localhost dev config — Done when server starts without public binding by default.
- [x] L260 Add CORS allowlist — Done when unlisted origin receives no CORS grant.
- [x] L261 Add secure response headers — Done when API responses set documented headers.
- [x] L262 Add body size limit — Done when oversized JSON returns 413.
- [x] L263 Add API rate-limit hook — Done when repeated requests receive 429 in a test.
- [x] L264 Add API test database fixture — Done when tests use isolated temporary databases.
- [x] L265 Add /health integration test — Done when status and version are asserted.
- [x] L266 Add API OpenAPI base document — Done when health route appears in schema.
- [x] L267 Add Dockerfile for API — Done when local image builds successfully.
- [x] L268 Add compose development file — Done when API and data volume start locally.
- [x] L269 Document self-host setup — Done when README gives start and backup steps.
- [x] L270 Add API CI job — Done when migrations and tests run on pull requests.

## 10 Accounts and consensual sharing

- [x] L271 Validate account handle — Done when disallowed or empty handle is rejected.
- [x] L272 Add password hash helper — Done when round trip verifies and wrong secret fails.
- [x] L273 Add account creation endpoint — Done when valid request stores one account.
- [x] L274 Reject duplicate handle — Done when second registration returns conflict.
- [x] L275 Add login endpoint — Done when valid credentials create a session.
- [x] L276 Add failed-login response — Done when invalid credentials reveal no account existence.
- [x] L277 Add login throttling — Done when repeated failures are limited.
- [x] L278 Add session table — Done when migration stores hashed session token.
- [x] L279 Set secure session cookie — Done when production cookie is HttpOnly and Secure.
- [x] L280 Add logout endpoint — Done when session is revoked in a test.
- [x] L281 Add current-account endpoint — Done when authenticated request returns account ID.
- [x] L282 Reject unauthenticated write — Done when protected route returns 401.
- [x] L283 Add password change endpoint — Done when old password is required.
- [x] L284 Add password-change session revocation — Done when old sessions stop working.
- [x] L285 Add account deletion flow — Done when records and sessions are removed after confirmation.
- [x] L286 Add sharing opt-in screen — Done when local data stays local until explicit choice.
- [x] L287 Create shared space endpoint — Done when authenticated creator becomes owner.
- [x] L288 List my spaces endpoint — Done when only memberships are returned.
- [x] L289 Create invite endpoint — Done when owner receives a one-time invitation link.
- [x] L290 Set invite expiry — Done when expired token cannot be accepted.
- [x] L291 Limit invite scope — Done when token names exactly one space.
- [x] L292 Accept invite endpoint — Done when accepted person becomes member.
- [x] L293 Reject invite reuse — Done when second acceptance fails.
- [x] L294 Revoke invite endpoint — Done when owner can invalidate unused token.
- [x] L295 Leave shared space endpoint — Done when membership is removed.
- [x] L296 Remove member endpoint — Done when owner can remove another member.
- [x] L297 Protect personal records — Done when shared member cannot fetch personal entries.
- [x] L298 Show shared-space member list — Done when UI names current members.
- [x] L299 Show invitation permission copy — Done when UI explains visibility before acceptance.
- [x] L300 Add invite browser flow test — Done when invitation, acceptance, and revocation work.

## 11 Opt-in sync and offline conflicts

- [x] L301 Define sync record envelope — Done when scope, id, revision, and payload are typed.
- [x] L302 Validate sync scope — Done when personal record cannot be uploaded as shared.
- [x] L303 Add server record put — Done when owner write increments revision.
- [x] L304 Add server record list — Done when only member can read space records.
- [x] L305 Add server record delete — Done when deletion writes a tombstone.
- [x] L306 Add server cursor response — Done when changed records after cursor are returned.
- [x] L307 Add cursor pagination — Done when large change set pages without omissions.

The remaining sync and release tasks were dropped on 2026-11-13 when the project changed direction. The journal and server code stays in the repository but is no longer being built on.

## 12 Gallery foundation

- [x] L308 Add three.js with lazy loading — Done when three.js loads in its own chunk only when a three.js piece opens.
- [ ] L309 Define the piece registry — Done when one typed list gives each piece an id, title, medium, caption, and component.
- [ ] L310 Build the ASCII field renderer — Done when a brightness and colour field maps through a character ramp onto a dense grid that fits a 320px screen.
- [ ] L311 Add timeline, noise, and bloom helpers — Done when eased phases, value noise, and a soft glow pass are unit tested and reduced motion holds a composed still.
- [ ] L312 Build the three.js stage component — Done when a scene mounts, resizes with the window, and disposes cleanly when left.
- [ ] L313 Add still fallbacks for scenes — Done when reduced motion or missing WebGL shows a composed still instead of a blank.
- [ ] L314 Refresh the visual language — Done when tokens cover paper, ink, rose, and a dusk palette used by the gallery.
- [ ] L315 Build the gallery home — Done when Home shows the collection as cards with live previews at phone and desktop widths.
- [ ] L316 Add the piece page — Done when a card opens its piece full screen with its caption and a way back by touch and keyboard.
- [ ] L317 Tuck the journal tools away — Done when Home is the gallery and the old tools are reachable only from one quiet link.
- [ ] L318 Add gentle piece transitions — Done when opening and closing a piece fades softly and is instant under reduced motion.
- [ ] L319 Add gallery browser test — Done when Playwright opens Home, opens a piece, and returns.

## 13 The collection

- [ ] L320 ASCII piece: Paper boat on a slow river — Done when a boat drifts across rippling water and loops seamlessly.
- [ ] L321 three.js piece: Drifting lanterns — Done when glowing paper lanterns rise through a dusk sky and can be nudged by touch.
- [ ] L322 ASCII piece: Two windows at night — Done when two lit windows far apart share one sky with a slow shooting star.
- [ ] L323 three.js piece: Two stars in orbit — Done when two small stars circle each other and leave soft trails.
- [ ] L324 ASCII piece: Rain on the window — Done when drops run down the glass at different speeds over a blurred street.
- [ ] L325 three.js piece: Tiny floating garden — Done when a low-poly island with a tree and flowers turns slowly and sways.
- [ ] L326 ASCII piece: Cat asleep on a letter — Done when a cat breathes, flicks an ear, and stretches now and then.
- [ ] L327 three.js piece: Paper cranes — Done when folded cranes glide in a loose flock and scatter gently from a tap.
- [ ] L328 ASCII piece: Tea for two — Done when steam curls from two cups and the curls briefly meet.
- [ ] L329 three.js piece: Snow globe — Done when snow swirls inside a glass globe when it is shaken by drag or tap.
- [ ] L330 ASCII piece: Lighthouse — Done when a beam sweeps over waves and lights a far-off boat as it passes.
- [ ] L331 three.js piece: Jar of fireflies — Done when fireflies drift and pulse inside a glass jar with a warm glow.
- [ ] L332 ASCII piece: Night train — Done when a train crosses a moonlit landscape with lit carriage windows.
- [ ] L333 three.js piece: Cottage with a lit window — Done when a small cottage sits under falling snow with chimney smoke and a warm window.
- [ ] L334 ASCII piece: Moon phases — Done when the moon moves through its phases over a quiet horizon.
- [ ] L335 three.js piece: Moon and tide — Done when a low moon pulls a shimmering tide in and out.
- [ ] L336 ASCII piece: First snow — Done when snow settles on a bench and a lamp post and slowly builds up.
- [ ] L337 three.js piece: Cherry blossom — Done when petals fall from a branch and swirl in a soft wind.
- [ ] L338 ASCII piece: Constellation — Done when stars appear one by one and lines join them into a heart.
- [ ] L339 three.js piece: Little planet — Done when a tiny planet with two houses on opposite sides turns between day and night.
- [ ] L340 ASCII piece: Sprout — Done when a seed grows into a flowering plant and gently restarts.
- [ ] L341 three.js piece: Music box — Done when a music box turns with a little dancing figure and drifting notes.
- [ ] L342 ASCII piece: Fireflies in the field — Done when fireflies blink over tall grass in an unhurried rhythm.
- [ ] L343 three.js piece: Aurora — Done when ribbons of light ripple over dark hills.
- [ ] L344 ASCII piece: Typewriter — Done when keys strike and a line of clearly labelled demo text types itself onto paper.
- [ ] L345 three.js piece: Hot air balloons — Done when patchwork balloons float past clouds at different depths.
- [ ] L346 ASCII piece: Campfire — Done when flames flicker and sparks rise under a starry sky.
- [ ] L347 three.js piece: Origami heart — Done when a sheet of paper folds itself into a heart and unfolds again.
- [ ] L348 ASCII piece: Postcard — Done when a postcard turns over to show a stamp, a wavy postmark, and demo lines.
- [ ] L349 three.js piece: Kite — Done when a kite tugs on its string and follows the pointer through the wind.
- [ ] L350 ASCII piece: Waves at dusk — Done when layered waves roll in under a setting sun.
- [ ] L351 three.js piece: Night sky dome — Done when a field of stars slowly wheels overhead with an occasional meteor.

## 14 Gallery polish

- [ ] L352 Add piece descriptions for screen readers — Done when every piece has a short text description announced in place of the art.
- [ ] L353 Add a favourites shelf — Done when a piece can be hearted and favourites show first after reload.
- [ ] L354 Add piece of the day — Done when Home features one piece chosen by the date.
- [ ] L355 Add a slow slideshow mode — Done when pieces advance on their own with pause and keyboard controls.
- [ ] L356 Add performance budget — Done when each scene holds a steady frame rate on a mid-range phone profile and pauses when hidden.
- [ ] L357 Make the gallery work offline — Done when every piece opens after first load with the network off.
- [ ] L358 Add title cards — Done when each piece opens with a brief hand-set title that fades away.
- [ ] L359 Review every piece against the craft bar — Done when each piece is rechecked on a phone width and weak ones are improved or noted.
- [ ] L360 Plan the next collection — Done when thirty new piece ideas are listed for the roadmap extension.
