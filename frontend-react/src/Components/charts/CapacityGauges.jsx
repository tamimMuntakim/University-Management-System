import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

/**
 * CapacityGauges — a responsive grid of 270° arc gauges, one per course
 * offering, showing how full each section is. Arc colour shifts by fill band
 * so "almost out of seats" pops without reading the number.
 *
 * @param {Object} data - { "CS101 §A": 87.5, ... }  (percent, 0–100)
 */
const CapacityGauges = ({ data = {} }) => {
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

    // fill-band colour: blue → amber → green → red(near full)
    const colourFor = pct =>
        pct >= 90 ? '#ef4444' :
        pct >= 70 ? '#10b981' :
        pct >= 40 ? '#f59e0b' :
                    '#3b82f6';

    useEffect(() => {
        if (!svgRef.current || width === 0) return;

        const entries = Object.entries(data).map(([label, pct]) => ({ label, pct: Number(pct) }));
        if (!entries.length) return;

        const cols  = width < 360 ? 2 : width < 560 ? 3 : 4;
        const cellW = width / cols;
        const cellH = cellW * 0.96;
        const rows  = Math.ceil(entries.length / cols);
        const height = rows * cellH;

        const r        = Math.min(cellW, cellH) * 0.30;
        const arcW     = r * 0.26;
        const START    = -0.75 * Math.PI;            // 270° sweep
        const END      =  0.75 * Math.PI;
        const angle    = pct => START + (Math.max(0, Math.min(100, pct)) / 100) * (END - START);

        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();
        svg.attr('width', width).attr('height', height);

        const track = d3.arc().innerRadius(r - arcW).outerRadius(r)
            .startAngle(START).endAngle(END).cornerRadius(arcW / 2);
        const valArc = d3.arc().innerRadius(r - arcW).outerRadius(r).cornerRadius(arcW / 2);

        const cell = svg.selectAll('.gauge').data(entries).enter().append('g')
            .attr('transform', (_, i) => {
                const col = i % cols, row = Math.floor(i / cols);
                return `translate(${col * cellW + cellW / 2},${row * cellH + cellH / 2 - 6})`;
            });

        // Track
        cell.append('path').attr('d', track)
            .attr('fill', 'currentColor').attr('fill-opacity', 0.09);

        // Value arc (animated sweep)
        cell.append('path')
            .attr('fill', d => colourFor(d.pct))
            .style('cursor', 'pointer')
            .each(function (d) { d._end = angle(d.pct); })
            .attr('d', d => valArc({ startAngle: START, endAngle: START }))
            .on('mouseenter', function (event, d) {
                const rect = svgRef.current.getBoundingClientRect();
                d3.select(tooltipRef.current)
                    .style('display', 'block')
                    .style('left', `${event.clientX - rect.left + 14}px`)
                    .style('top',  `${event.clientY - rect.top  - 38}px`)
                    .html(`<strong>${d.label}</strong><br/>${d.pct.toFixed(1)}% filled`);
            })
            .on('mouseleave', () => d3.select(tooltipRef.current).style('display', 'none'))
            .transition().duration(900).delay((_, i) => i * 80).ease(d3.easeCubicOut)
            .attrTween('d', function (d) {
                const i = d3.interpolate(START, d._end);
                return t => valArc({ startAngle: START, endAngle: i(t) });
            });

        // Centre percent
        cell.append('text')
            .attr('text-anchor', 'middle').attr('dy', '0.0em')
            .attr('font-size', `${r * 0.46}px`).attr('font-weight', '900')
            .attr('fill', d => colourFor(d.pct))
            .attr('opacity', 0)
            .text(d => `${Math.round(d.pct)}%`)
            .transition().delay((_, i) => i * 80 + 500).duration(300).attr('opacity', 1);

        // Course label under the gauge
        cell.append('text')
            .attr('text-anchor', 'middle').attr('y', r + arcW + 10)
            .attr('font-size', '10px').attr('font-weight', '700')
            .attr('fill', 'currentColor').attr('opacity', 0.6)
            .text(d => (d.label.length > 14 ? d.label.slice(0, 13) + '…' : d.label));

    }, [data, width]);

    return (
        <div ref={containerRef} className="relative w-full text-base-content space-y-3">
            <svg ref={svgRef} />
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5">
                {[['<40%', '#3b82f6'], ['40–70%', '#f59e0b'], ['70–90%', '#10b981'], ['≥90%', '#ef4444']].map(([lbl, c]) => (
                    <div key={lbl} className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-base-content/55">{lbl}</span>
                    </div>
                ))}
            </div>
            <div
                ref={tooltipRef}
                style={{ display: 'none', position: 'absolute', pointerEvents: 'none' }}
                className="bg-base-100 border border-base-300 rounded-xl px-3 py-1.5 text-xs shadow-xl z-20 text-base-content whitespace-nowrap leading-relaxed"
            />
        </div>
    );
};

export default CapacityGauges;
