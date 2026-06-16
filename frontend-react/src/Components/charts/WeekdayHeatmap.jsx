import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

// Display order: Monday first, weekend last. Maps each row → Postgres DOW (0=Sun..6=Sat)
const ROWS = [
    { label: 'Mon', dow: 1 },
    { label: 'Tue', dow: 2 },
    { label: 'Wed', dow: 3 },
    { label: 'Thu', dow: 4 },
    { label: 'Fri', dow: 5 },
    { label: 'Sat', dow: 6 },
    { label: 'Sun', dow: 0 },
];

/**
 * WeekdayHeatmap — login "punchcard": 7 weekdays × 24 hours.
 * Cell opacity encodes login volume, so the busiest day/time blocks read at a
 * glance — same heatmap language as the registration calendar.
 *
 * @param {Object} data  - { "dow-hour": count, ... }  (dow 0=Sun … 6=Sat)
 * @param {string} color - Accent colour for active cells
 */
const WeekdayHeatmap = ({ data = {}, color = '#3b82f6' }) => {
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

        const get = (dow, h) => Number(data[`${dow}-${h}`] || 0);
        const maxCount = d3.max(Object.values(data).map(Number)) || 1;

        const leftPad = 38, topPad = 4, bottomPad = 20;
        const cell = Math.max(9, Math.min(22, Math.floor((width - leftPad) / 24) - 3));
        const gap  = Math.max(2, Math.round(cell * 0.16));
        const step = cell + gap;
        const gridW = 24 * step;
        const height = topPad + ROWS.length * step + bottomPad;

        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();
        svg.attr('width', leftPad + gridW).attr('height', height);
        const g = svg.append('g').attr('transform', `translate(${leftPad},${topPad})`);

        const bucket = d3.scaleQuantize().domain([1, Math.max(2, maxCount)]).range([0.28, 0.46, 0.64, 0.82, 1]);

        const cells = [];
        ROWS.forEach((row, ri) => {
            for (let h = 0; h < 24; h++) {
                cells.push({ ri, h, dow: row.dow, label: row.label, count: get(row.dow, h) });
            }
        });

        g.selectAll('rect').data(cells).enter().append('rect')
            .attr('x', d => d.h * step)
            .attr('y', d => d.ri * step)
            .attr('width', cell).attr('height', cell)
            .attr('rx', Math.max(2, cell * 0.22))
            .attr('fill', d => (d.count === 0 ? 'currentColor' : color))
            .attr('fill-opacity', d => (d.count === 0 ? 0.06 : 0))
            .style('cursor', 'pointer')
            .on('mouseenter', function (event, d) {
                d3.select(this).attr('stroke', 'currentColor').attr('stroke-opacity', 0.35);
                const r = svgRef.current.getBoundingClientRect();
                const hh = String(d.h).padStart(2, '0');
                d3.select(tooltipRef.current)
                    .style('display', 'block')
                    .style('left', `${event.clientX - r.left + 14}px`)
                    .style('top',  `${event.clientY - r.top  - 38}px`)
                    .html(`<strong>${d.label} ${hh}:00</strong><br/>${d.count} login${d.count === 1 ? '' : 's'}`);
            })
            .on('mouseleave', function () {
                d3.select(this).attr('stroke', 'none');
                d3.select(tooltipRef.current).style('display', 'none');
            })
            .transition().duration(450).delay(d => d.h * 12 + d.ri * 6)
            .attr('fill-opacity', d => (d.count === 0 ? 0.06 : bucket(d.count)));

        // Weekday labels (left)
        ROWS.forEach((row, ri) => {
            g.append('text')
                .attr('x', -10).attr('y', ri * step + cell / 2)
                .attr('text-anchor', 'end').attr('dominant-baseline', 'central')
                .attr('font-size', '9px').attr('font-weight', '800')
                .attr('letter-spacing', '0.02em')
                .attr('fill', 'currentColor')
                .attr('opacity', row.dow === 0 || row.dow === 6 ? 0.35 : 0.55)  // weekends dimmer
                .text(row.label);
        });

        // Hour labels (bottom, every 3h)
        d3.range(0, 24, 3).forEach(h => {
            g.append('text')
                .attr('x', h * step + cell / 2).attr('y', ROWS.length * step + 10)
                .attr('text-anchor', 'middle')
                .attr('font-size', '8.5px').attr('font-weight', '700')
                .attr('letter-spacing', '0.03em')
                .attr('fill', 'currentColor').attr('opacity', 0.4)
                .text(String(h).padStart(2, '0'));
        });

    }, [data, width, color]);

    const total = Object.values(data).reduce((s, v) => s + Number(v), 0);

    return (
        <div ref={containerRef} className="relative w-full text-base-content space-y-3 overflow-x-auto">
            <svg ref={svgRef} />
            <div className="flex items-center gap-2 px-1 min-w-[320px]">
                <span className="mr-auto flex items-baseline gap-1.5">
                    <span className="text-sm font-black text-base-content/80">{total.toLocaleString()}</span>
                    <span className="text-[10px] font-bold text-base-content/40 uppercase tracking-wider">logins tracked</span>
                </span>
                <span className="text-[9px] font-bold text-base-content/40 uppercase">Less</span>
                {[0.06, 0.28, 0.46, 0.64, 0.82, 1].map((o, i) => (
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

export default WeekdayHeatmap;
