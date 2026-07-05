/**
 * @typedef {Object} TimelineItem
 * @property {string|number} id            Unique id.
 * @property {string|Date}   start         ISO date (or Date) the item began.
 * @property {string|Date|null} [end]      ISO date it ended; `null`/omitted = ongoing.
 * @property {*}             [*]           Any extra fields you want in your card.
 */

const toDate = (value) => (value instanceof Date ? value : new Date(value));

// Alphabetical tiebreaker (by title, then id) used whenever two items share a date.
const alpha = (a, b) =>
    String(a.title ?? a.id ?? '').localeCompare(String(b.title ?? b.id ?? ''), undefined, { sensitivity: 'base' });

/**
 * Assign every item a "lane" based on temporal overlap — the core of a git-graph
 * / swimlane layout. Pure and framework-agnostic; the input order is irrelevant.
 *
 * Items that don't overlap in time reuse lane 0 (the "main" spine). Items whose
 * time span overlaps an already-occupied lane get pushed to the next free lane,
 * which the renderer draws as a parallel branch column.
 *
 * @param {TimelineItem[]} items
 * @param {Object} [options]
 * @param {'desc'|'asc'} [options.order='desc']  Display order. `desc` = newest first.
 * @returns {{
 *   rows: { backbone: TimelineItem & {lane:0}, branches: TimelineItem[] }[],
 *   ordered: (TimelineItem & { lane:number })[],
 *   maxLane: number
 * }}
 */
export function computeLanes(items, { order = 'desc' } = {}) {
    // Oldest first for the greedy lane packing; ties broken alphabetically.
    const parsed = items
        .map((it) => ({ ...it, _start: toDate(it.start), _end: it.end ? toDate(it.end) : null }))
        .sort((a, b) => (a._start - b._start) || alpha(a, b));

    // Display comparator: newest first (or oldest first for asc); equal dates go
    // alphabetically with 'a' on top.
    const displayCmp = (a, b) =>
        (order === 'desc' ? b._start - a._start : a._start - b._start) || alpha(a, b);

    // Greedy lane packing: reuse the first lane whose previous item already ended.
    const laneEnds = [];
    const withLanes = parsed.map((it) => {
        let lane = laneEnds.findIndex((end) => end !== null && end <= it._start);
        if (lane === -1) {
            lane = laneEnds.length;
            laneEnds.push(it._end);
        } else {
            laneEnds[lane] = it._end;
        }
        return { ...it, lane };
    });

    // Group each off-main item under the main-lane item it overlaps with.
    const rows = withLanes
        .filter((it) => it.lane === 0)
        .map((backbone) => ({ backbone, branches: [] }));

    withLanes
        .filter((it) => it.lane !== 0)
        .forEach((branch) => {
            let idx = rows.findIndex(
                (r) =>
                    branch._start >= r.backbone._start &&
                    (r.backbone._end === null || branch._start <= r.backbone._end)
            );
            if (idx === -1) idx = rows.length - 1;
            if (idx >= 0) rows[idx].branches.push(branch);
        });

    const maxLane = Math.max(0, ...withLanes.map((it) => it.lane));
    // Widest row = how many cards sit side by side in the busiest row (main + its
    // branches). Drives the container width so nothing gets cramped.
    const maxCols = Math.max(1, ...rows.map((r) => 1 + r.branches.length));

    return {
        rows: rows.slice().sort((a, b) => displayCmp(a.backbone, b.backbone)),
        ordered: withLanes.slice().sort(displayCmp),
        maxLane,
        maxCols,
    };
}
