## 2025-05-20 - [High-frequency Event Optimization]
**Learning:** Using React state for high-frequency events like mouse tracking or scrolling causes O(N) re-renders, significantly impacting performance in complex components. Refactoring to 'useRef' combined with direct DOM manipulation or R3F 'useFrame' updates eliminates these re-renders entirely.
**Action:** Always audit for 'useState' updates triggered by 'mousemove' or 'scroll' events and refactor to 'useRef' for visual-only updates.

## 2025-05-20 - [React 19 Purity and R3F]
**Learning:** React 19's 'react-hooks/purity' linting rules flagging 'Math.random()' inside 'useMemo' or component bodies can break R3F patterns. Moving generation logic to external static helper functions satisfies linting while maintaining data stability.
**Action:** Define data generation helpers outside component scopes for R3F buffer attributes.
