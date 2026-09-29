import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { computeLanes } from './computeLanes';

/**
 * GitTimeline — a data-driven "git graph" timeline.
 *
 * The main lane is a single vertical spine (your through-line: degree → master →
 * job …). Items whose dates overlap the main lane fork off it into a parallel
 * **branch lane**: the branch has its own vertical line and every block that
 * shares that lane stacks on it, forking off the spine once and merging back
 * once — exactly like a git graph. Input order is irrelevant.
 *
 * Branch connectors are measured from the real DOM, so they wrap over/under the
 * main card and rejoin the spine at any card height. Styling uses Tailwind
 * utility classes (bring your own Tailwind) plus inline styles for the
 * measured connectors. Everything is themeable via props.
 *
 * @typedef {Object} GitTimelineItem
 * @property {string|number} id
 * @property {string|Date}   start
 * @property {string|Date|null} [end]      `null`/omitted = ongoing
 * @property {string} [title] @property {string} [subtitle] @property {string} [meta]
 * @property {string} [location] @property {string|string[]} [description]
 * @property {React.ReactNode} [icon] @property {string[]} [badges]
 * @property {boolean} [current] @property {string} [mergedLabel] @property {string} [color]
 *
 * @param {Object} props
 * @param {GitTimelineItem[]} props.items
 * @param {string[]} [props.laneColors] @param {string} [props.surfaceColor]
 * @param {'desc'|'asc'} [props.order] @param {number} [props.mobileBreakpoint]
 * @param {boolean} [props.showArrow]
 * @param {(item, ctx:{color,isBranch}) => React.ReactNode} [props.renderCard]
 * @param {string} [props.className]
 */

const DEFAULT_LANE_COLORS = ['#22c55e', '#a78bfa', '#38bdf8', '#fb923c', '#f472b6'];

// Geometry (px)
const SPINE_W = 44;
const NODE_Y = 30;
const NODE = 16;
const NODE_C = NODE_Y + NODE / 2;
const ROW_GAP = 40;
const CAP_TOP = 34;
const CAP_BOTTOM = 34;
const COL_GAP = 28;
const CORNER = 12;
const OVER = 16;
const STACK_GAP = 16;   // vertical gap between blocks stacked on the same branch lane

const widthByLanes = ['max-w-3xl', 'max-w-4xl', 'max-w-6xl', 'max-w-[88rem]'];
const colorMix = (color, opacity) => `color-mix(in srgb, ${color} ${opacity}%, transparent)`;

const useIsDesktop = (breakpoint) => {
    const query = `(min-width: ${breakpoint}px)`;
    const [isDesktop, setIsDesktop] = useState(
        () => typeof window !== 'undefined' && window.matchMedia(query).matches
    );
    useEffect(() => {
        const mq = window.matchMedia(query);
        const handler = (e) => setIsDesktop(e.matches);
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, [query]);
    return isDesktop;
};

/* ---------- presentational pieces ---------- */

const Badges = ({ item, color }) => (
    <>
        {(item.badges || []).map((label) => (
            <span key={label} className="text-[11px] font-bold uppercase tracking-widest px-2 py-0.5 border"
                style={{ color, borderColor: colorMix(color, 35), background: colorMix(color, 10) }}>
                {label}
            </span>
        ))}
        {item.current && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest" style={{ color }}>
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: color }}></span>
                HEAD
            </span>
        )}
    </>
);

const DefaultCard = ({ item, color, compact }) => {
    const lines = Array.isArray(item.description) ? item.description : item.description ? [item.description] : [];
    return (
        <article className={`timeline-card h-full flex flex-col border bg-black/40 backdrop-blur-sm ${compact ? 'p-5' : 'p-6'} ${item.planned ? 'timeline-card--planned' : ''}`} style={{ borderColor: colorMix(color, item.planned ? 70 : 40) }}>
            <div className="timeline-context" aria-label={`${item.phaseLabel}, ${item.relationshipLabel}`}>
                <span>{item.phaseLabel}</span><span>{item.relationshipLabel}</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-2 mb-3">
                <div className="flex items-start gap-3">
                    {item.icon && <div className="p-2 bg-black/60 border border-white/10 shrink-0">{item.icon}</div>}
                    <div>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                            {item.title && <h3 className={`${compact ? 'text-base' : 'text-lg'} font-bold`} style={{ color }}>{item.title}</h3>}
                             <Badges item={item} color={color} />
                             {item.statusLabel && <span className="timeline-status" style={{ color }}>{item.statusLabel}</span>}
                        </div>
                        {item.subtitle && <h4 className="text-sm font-semibold text-gray-300">{item.subtitle}</h4>}
                    </div>
                </div>
                {item.meta && (
                    <div className="text-xs text-gray-400 bg-white/5 px-2.5 py-1 border border-white/10 whitespace-nowrap self-start">
                        {item.meta}
                    </div>
                )}
            </div>
            {item.location && <p className="text-sm text-gray-500 mb-3">{item.location}</p>}
            {lines.length > 0 && (
                <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm">
                    {lines.map((l, i) => <li key={i}>{l}</li>)}
                </ul>
            )}
            {item.image && (
                <div className="mt-4 flex-1 min-h-[180px] overflow-hidden border" style={{ borderColor: colorMix(color, 25) }}>
                    <img src={item.image} alt={item.title || ''} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                </div>
            )}
        </article>
    );
};

const MergeChip = ({ color, label }) => (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest px-2 py-1 border"
        style={{ color, borderColor: colorMix(color, 40), background: colorMix(color, 10) }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="18" cy="18" r="3" /><circle cx="6" cy="6" r="3" /><path d="M6 21V9a9 9 0 0 0 9 9" />
        </svg>
        {label}
    </span>
);

const spineLine = (accent) => ({ background: accent, boxShadow: `0 0 10px ${accent}, 0 0 3px ${accent}` });

const StartCap = ({ accent, showArrow }) => (
    <div className="flex" aria-hidden="true">
        <div className="relative shrink-0" style={{ width: SPINE_W, height: CAP_TOP }}>
            {showArrow && (
                <div className="absolute left-1/2 -translate-x-1/2 top-0 w-0 h-0 border-x-[6px] border-x-transparent border-b-[10px]"
                    style={{ borderBottomColor: accent, filter: `drop-shadow(0 0 4px ${accent})` }}></div>
            )}
            <div className="absolute left-1/2 -translate-x-1/2 w-[3px] rounded-full" style={{ top: showArrow ? 12 : 0, bottom: 0, ...spineLine(accent) }}></div>
        </div>
        <div className="flex-1" />
    </div>
);

const EndCap = ({ accent }) => (
    <div className="flex" aria-hidden="true">
        <div className="relative shrink-0" style={{ width: SPINE_W, height: CAP_BOTTOM }}>
            <div className="absolute left-1/2 -translate-x-1/2 w-[3px] rounded-full" style={{ top: 0, height: 16, ...spineLine(accent) }}></div>
            <div className="absolute left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 z-10" style={{ top: 12, background: colorMix(accent, 80), boxShadow: `0 0 8px ${accent}` }}></div>
        </div>
        <div className="flex-1" />
    </div>
);

const Spine = ({ accent, surface, isLast, planned }) => (
    <div className="relative shrink-0" style={{ width: SPINE_W, zIndex: 5 }} aria-hidden="true">
        <div className="absolute left-1/2 -translate-x-1/2 w-[3px] rounded-full" style={{ top: 0, bottom: isLast ? 0 : -ROW_GAP, ...spineLine(accent), background: planned ? `repeating-linear-gradient(to bottom, ${accent} 0 7px, transparent 7px 13px)` : accent }}></div>
        <div className="absolute left-1/2 -translate-x-1/2 rotate-45 z-10 border-2"
            style={{ top: NODE_Y, width: NODE, height: NODE, background: planned ? surface : accent, borderColor: accent, borderStyle: planned ? 'dashed' : 'solid', boxShadow: `0 0 10px ${accent}` }}></div>
        <div className="absolute left-1/2 right-[-1px] h-[2px]" style={{ top: NODE_C - 1, background: planned ? `repeating-linear-gradient(to right, ${accent} 0 7px, transparent 7px 12px)` : accent }}></div>
    </div>
);

/* A main commit whose overlapping items fork into one or more branch lanes.
   Each lane is a column of vertically-stacked blocks with its own line; the
   connector forks off the spine, wraps over the main card, runs down the lane,
   and (if every block in the lane ended) merges back under to the spine. */
const BranchRow = ({ row, isLast, accent, surface, colorFor, renderItem, mergedFallback }) => {
    const wrapRef = useRef(null);
    const mainRef = useRef(null);
    const laneRefs = useRef([]);
    const [loops, setLoops] = useState([]);

    const laneGroups = useMemo(() => {
        const m = new Map();
        row.branches.forEach((b) => { if (!m.has(b.lane)) m.set(b.lane, []); m.get(b.lane).push(b); });
        return [...m.entries()]
            .sort((a, b) => a[0] - b[0])
            .map(([lane, items]) => ({ lane, items: items.slice().sort((x, y) => y._start - x._start) }));
    }, [row]);

    useLayoutEffect(() => {
        const measure = () => {
            if (!wrapRef.current || !mainRef.current) return;
            const wrap = wrapRef.current.getBoundingClientRect();
            const main = mainRef.current.getBoundingClientRect();
            const spineX = SPINE_W / 2;
            const mainTop = main.top - wrap.top;
            setLoops(
                laneGroups.map((g, i) => {
                    const el = laneRefs.current[i];
                    if (!el) return null;
                    const r = el.getBoundingClientRect();
                    const allMerged = g.items.every((it) => it._end != null);
                    return {
                        key: g.lane,
                        color: colorFor(g.items[0]),
                        merged: allMerged,
                        planned: g.items.some((item) => item.planned),
                        spineX,
                        topY: mainTop - OVER - i * 8,
                        botY: (r.bottom - wrap.top) + OVER + i * 8,
                        branchX: (r.left - wrap.left) - 1,
                        endY: r.bottom - wrap.top,
                    };
                }).filter(Boolean)
            );
        };
        measure();
        const ro = new ResizeObserver(measure);
        if (wrapRef.current) ro.observe(wrapRef.current);
        window.addEventListener('resize', measure);
        return () => { ro.disconnect(); window.removeEventListener('resize', measure); };
    }, [laneGroups, colorFor]);

    return (
        <div role="listitem" ref={wrapRef} className="relative flex" style={{ paddingTop: 22, paddingBottom: isLast ? 8 : ROW_GAP }}>
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 4, overflow: 'visible' }} aria-hidden="true">
                {loops.map((l) => {
                    const R = CORNER;
                    const d = l.merged
                        ? `M ${l.spineX} ${l.topY} L ${l.branchX - R} ${l.topY} Q ${l.branchX} ${l.topY} ${l.branchX} ${l.topY + R}`
                          + ` L ${l.branchX} ${l.botY - R} Q ${l.branchX} ${l.botY} ${l.branchX - R} ${l.botY} L ${l.spineX} ${l.botY}`
                        : `M ${l.spineX} ${l.topY} L ${l.branchX - R} ${l.topY} Q ${l.branchX} ${l.topY} ${l.branchX} ${l.topY + R} L ${l.branchX} ${l.endY}`;
                    return (
                        <g key={l.key}>
                            <path d={d} fill="none" stroke={l.color} strokeWidth="2" strokeDasharray={l.planned ? '7 6' : undefined} strokeLinecap="round" strokeLinejoin="round" />
                            <circle cx={l.spineX} cy={l.topY} r="3.2" fill={l.color} />
                            {l.merged
                                ? <circle cx={l.spineX} cy={l.botY} r="3.2" fill={l.color} />
                                : <circle cx={l.branchX} cy={l.endY} r="3.5" fill={surface} stroke={l.color} strokeWidth="2" />}
                        </g>
                    );
                })}
            </svg>

            <Spine accent={accent} surface={surface} isLast={isLast} planned={row.backbone.planned} />

            <div className="flex-1 min-w-0 relative" style={{ zIndex: 10 }}>
                <div className="flex items-stretch" style={{ gap: COL_GAP }}>
                    <div ref={mainRef} className="min-w-0" style={{ flex: '1.7 1 0%' }}>{renderItem(row.backbone, false)}</div>
                    {laneGroups.map((g, i) => {
                        const color = colorFor(g.items[0]);
                        const merged = g.items.every((it) => it._end != null);
                        const mergedLabel = g.items.find((it) => it.mergedLabel)?.mergedLabel || mergedFallback;
                        return (
                            <div key={g.lane} ref={(el) => (laneRefs.current[i] = el)} className="flex-1 min-w-0 flex flex-col" style={{ gap: STACK_GAP }}>
                                {g.items.map((b) => <div key={b.id}>{renderItem(b, true)}</div>)}
                                {merged && <MergeChip color={color} label={mergedLabel} />}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

/* ---------- main ---------- */

const GitTimeline = ({
    items,
    laneColors = DEFAULT_LANE_COLORS,
    surfaceColor = '#05050a',
    order = 'desc',
    mobileBreakpoint = 768,
    showArrow = true,
    renderCard,
    mergedFallback = 'merged',
    className = '',
}) => {
    const isDesktop = useIsDesktop(mobileBreakpoint);
    const { rows, ordered, maxLane } = computeLanes(items, { order });
    const accent = laneColors[0];
    const colorFor = useCallback((item) => item.color || laneColors[item.lane % laneColors.length], [laneColors]);
    const renderItem = (item, isBranch) => {
        const color = colorFor(item);
        return renderCard ? renderCard(item, { color, isBranch }) : <DefaultCard item={item} color={color} compact={isBranch} />;
    };

    // Mobile: a plain chronological list. No spine, no branch graph.
    if (!isDesktop) {
        return (
            <ol className={`mobile-timeline max-w-2xl mx-auto space-y-5 ${className}`}>
                {ordered.map((item) => {
                    const merged = item.lane > 0 && item._end != null;
                    return (
                        <li key={item.id} className={`${item.lane > 0 ? 'pl-4 border-l-2' : ''} ${item.planned ? 'mobile-timeline--planned' : ''}`} style={item.lane > 0 ? { borderColor: colorFor(item), borderStyle: item.planned ? 'dashed' : 'solid' } : undefined}>
                            {renderItem(item, item.lane > 0)}
                            {merged && <div className="mt-3"><MergeChip color={colorFor(item)} label={item.mergedLabel || mergedFallback} /></div>}
                        </li>
                    );
                })}
            </ol>
        );
    }

    return (
        <div role="list" className={`${widthByLanes[Math.min(maxLane, widthByLanes.length - 1)]} mx-auto ${className}`}>
            <StartCap accent={accent} showArrow={showArrow} />
            {rows.map((row, ri) => {
                const isLast = ri === rows.length - 1;
                if (row.branches.length === 0) {
                    return (
                        <div role="listitem" key={row.backbone.id} className="flex" style={{ paddingBottom: isLast ? 0 : ROW_GAP }}>
                            <Spine accent={accent} surface={surfaceColor} isLast={isLast} planned={row.backbone.planned} />
                            <div className="flex-1 min-w-0">{renderItem(row.backbone, false)}</div>
                        </div>
                    );
                }
                return (
                    <BranchRow key={row.backbone.id} row={row} isLast={isLast} accent={accent} surface={surfaceColor}
                        colorFor={colorFor} renderItem={renderItem} mergedFallback={mergedFallback} />
                );
            })}
            <EndCap accent={accent} />
        </div>
    );
};

export default GitTimeline;
