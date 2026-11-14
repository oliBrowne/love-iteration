# Love Iteration architecture

## Product

Love Iteration is a small gallery of art pieces made for one person to enjoy. Each piece is drawn in ASCII or built as a three.js scene. The home page is the collection; a piece opens full screen with a title and a short caption. There is nothing to fill in. It should feel cute, warm, and carefully made, and work well on a phone.

It is not a journal, planner, or relationship tracker. Tasks L001–L307 built one, with a sharing server in `api/`. That direction stopped on 2026-11-13. The old code remains in the repository, tucked behind one quiet link, and is not extended.

## The craft bar

The effort level to match is [iremcnar/eyeTutorial](https://github.com/iremcnar/eyeTutorial), a procedurally rendered ASCII animation with a timeline, layered detail, and glow. It is a standard for effort, not code to copy. A piece is done when it is:

- **Rendered, not typed:** ASCII pieces compute a dense grid from maths and noise and map brightness through a character ramp with colour.
- **A small journey:** a timeline of at least three eased phases with a moment of surprise, looping or resting gracefully.
- **Layered:** subject, texture, light, atmosphere, and particles working together, with glow or depth where it helps.
- **Detailed:** small touches that reward a second look.
- **Polished:** right at 320px and on desktop, with a title and caption, smooth on a phone.
- **Considerate:** a composed still under reduced motion, and a text description for screen readers.

## Technical shape

React, TypeScript, and Vite. three.js is the only 3D library and loads lazily, so the home page stays light.

- **Registry.** One typed list describes every piece: id, title, medium (`ascii` or `three`), caption, text description, and a lazily loaded component. The gallery and routes read from it.
- **ASCII pieces.** A shared field renderer draws a dense character grid to a canvas, redrawing only cells that changed. A piece supplies a pure function from time to a brightness and colour field; shared helpers provide value noise, easing, timelines, a character ramp, particle stamping, and a soft bloom pass. Pure functions keep it testable. The loop adapts to the device's speed and stops when the piece is hidden.
- **three.js pieces.** A shared stage component owns the renderer, resize handling, the animation loop, and disposal. A piece supplies a function that builds its scene and a timeline-driven update step, with the same expectations: layered, lit, and choreographed, not a single spinning shape. Geometry is built in code; no large model or texture downloads.
- **Fallbacks.** Under `prefers-reduced-motion`, or without WebGL, a piece shows a composed still.
- **Each piece lives in its own folder** under `src/pieces/<id>/`, with small pure helpers and a focused test.

Unit tests cover frame generators, the registry, and fallbacks. A browser test opens the gallery and a piece. The static build works offline after first load. No analytics, tracking, or third-party fonts.

## Content boundaries

- Pieces are scenes and moods. Never invent relationship details, names, dates, or messages.
- Any words inside a piece are clearly labelled demo text.
- Nothing personal is stored or sent anywhere. Favourites, if added, stay in the browser.
- Never commit personal entries, secrets, or tokens.

## Definition of done for one task

The task's acceptance check passes, a piece meets the craft bar, tests and the build pass, the result has been looked at running at phone and desktop widths, and the commit contains the task ID. If a task cannot be finished well, record why and stop. Do not mark it complete or jump to the next task.
