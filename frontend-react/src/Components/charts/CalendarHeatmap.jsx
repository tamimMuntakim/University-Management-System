import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

/**
 * CalendarHeatmap — GitHub-contributions-style grid.
 * Columns are weeks, rows are weekdays (Sun→Sat). Cell opacity encodes the
 * daily count, so streaks and quiet stretches are visible at a glance.
 *
 * @param {Object} data   - { "YYYY-MM-DD": count, ... }
 * @param {string} color  - Accent colour for "busy" days
 */
const CalendarHeatmap = ({ data = {}, color = '#10b981' }) => {
    const svgRef       = useRef(null);
    const containerRef = useRef(null);
    const tooltipRef   = useRef(null);
    const [width, setWidth] = useState(0);

    useEffect(() => {
        if (!containerRef.current) return;
        const ro = new ResizeObserver(e => setWidth(e[0].contentRect.width));
        ro.observe(containerRef.current);
        return () => ro.disconnect();
    }, []);

    useEffect(() => {
        if (!svgRef.current || width === 0) return;

        const parse   = d3.timeParse('%Y-%m-%d');
        const entries = Object.entries(data)
            .map(([k, v]) => ({ date: parse(k), count: Number(v) }))
            .filter(d => d.date)
            .sort((a, b) => a.date - b.date);
        if (!entries.length) return;

        const counts  = new Map(entries.map(d => [d3.timeFormat('%Y-%m-%d')(d.date), d.count]));
        const maxCount = d3.max(entries, d => d.count) || 1;

        // Date span: from the Sunday on/before the first registration → last day
        const start = d3.timeWeek.floor(entries[0].date);
        const end   = entries[entries.length - 1].date;
        const days  = d3.timeDay.range(start, d3.timeDay.offset(end, 1));
        const weeks = d3.timeWeek.count(start, end) + 1;

        const leftPad = 30, topPad = 18;
        const cell    = Math.max(8, Math.min(18, Math.floor((width - leftPad) / weeks) - 3));
        const gap     = Math.max(2, Math.round(cell * 0.16));
        const step    = cell + gap;
        const height  = topPad + 7 * step;

        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();
        svg.attr('width', width).attr('height', height);
        const g = svg.append('g').attr('transform', `translate(${leftPad},${topPad})`);

        // 5-stop opacity ramp (GitHub-like), theme-safe via single accent
        const bucket = d3.scaleQuantize().domain([1, Math.max(2, maxCount)]).range([0.28, 0.46, 0.64, 0.82, 1]);

        const cells = days.map(day => {
            const key = d3.timeFormat('%Y-%m-%d')(day);
            const c   = counts.get(key) || 0;
            return {
                day, key, count: c,
                wx: d3.timeWeek.count(start, day),
                wd: day.getDay(),
            };
        });

        g.selectAll('rect').data(cells).enter().append('rect')
            .attr('x', d => d.wx * step)
            .attr('y', d => d.wd * step)
            .attr('width', cell).attr('height', cell)
            .attr('rx', Math.max(2, cell * 0.2))
            .attr('fill', d => (d.count === 0 ? 'currentColor' : color))
            .attr('fill-opacity', d => (d.count === 0 ? 0.07 : 0))
            .style('cursor', 'pointer')
            .on('mouseenter', function (event, d) {
                d3.select(this).attr('stroke', 'currentColor').attr('stroke-opacity', 0.35);
                const r = svgRef.current.getBoundingClientRect();
                d3.select(tooltipRef.current)
                    .style('display', 'block')
                    .style('left', `${event.clientX - r.left + 14}px`)
                    .style('top',  `${event.clientY - r.top  - 38}px`)
                    .html(`<strong>${d3.timeFormat('%b %-d, %Y')(d.day)}</strong><br/>${d.count} registration${d.count === 1 ? '' : 's'}`);
            })
            .on('mouseleave', function () {
                d3.select(this).attr('stroke', 'none');
                d3.select(tooltipRef.current).style('display', 'none');
            })
            .transition().duration(500).delay(d => d.wx * 14 + d.wd * 4)
            .attr('fill-opacity', d => (d.count === 0 ? 0.07 : bucket(d.count)));

        // Month labels along the top
        const seen = new Set();
        cells.forEach(d => {
            const m = d3.timeFormat('%b')(d.day);
            const key = `${d.day.getFullYear()}-${d.day.getMonth()}`;
            if (d.day.getDate() <= 7 && !seen.has(key)) {
                seen.add(key);
                g.append('text')
                    .attr('x', d.wx * step).attr('y', -6)
                    .attr('font-size', '9.5px').attr('font-weight', '800')
                    .attr('letter-spacing', '0.04em')
                    .attr('fill', 'currentColor').attr('opacity', 0.55)
                    .text(m);
            }
        });

        // Weekday labels (Mon / Wed / Fri)
        DAY_LABELS.forEach((lbl, i) => {
            if (!lbl) return;
            g.append('text')
                .attr('x', -8).attr('y', i * step + cell / 2)
                .attr('text-anchor', 'end').attr('dominant-baseline', 'central')
                .attr('font-size', '9px').attr('font-weight', '800')
                .attr('fill', 'currentColor').attr('opacity', 0.5)
                .text(lbl);
        });

    }, [data, width, color]);

    const total = Object.values(data).reduce((s, v) => s + Number(v), 0);

    return (
        <div ref={containerRef} className="relative w-full text-base-content space-y-3">
            <svg ref={svgRef} />
            <div className="flex items-center gap-2 px-1">
                <span className="mr-auto flex items-baseline gap-1.5">
                    <span className="text-sm font-black text-base-content/80">{total.toLocaleString()}</span>
                    <span className="text-[10px] font-bold text-base-content/40 uppercase tracking-wider">total registrations</span>
                </span>
                <span className="text-[9px] font-bold text-base-content/40 uppercase">Less</span>
                {[0.07, 0.28, 0.46, 0.64, 0.82, 1].map((o, i) => (
                    <span key={i} className="w-3 h-3 rounded-[3px]"
                        style={{ background: i === 0 ? 'currentColor' : color, opacity: o }} />
                ))}
                <span className="text-[9px] font-bold text-base-content/40 uppercase">More</span>
            </div>
            <div
                ref={tooltipRef}
                style={{ display: 'none', position: 'absolute', pointerEvents: 'none' }}
                className="bg-base-100 border border-base-300 rounded-xl px-3 py-1.5 text-xs shadow-xl z-20 text-base-content whitespace-nowrap leading-relaxed"
            />
        </div>
    );
};

export default CalendarHeatmap;
