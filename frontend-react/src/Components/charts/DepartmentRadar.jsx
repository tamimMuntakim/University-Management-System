import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

/**
 * DepartmentRadar — spider/radar chart comparing departments across one or
 * more metrics. Each metric is its own polygon, normalised against its own
 * `max` so different scales (CGPA /4, rating /5) overlay fairly.
 *
 * @param {Array}  series - [{ label, values: { deptCode: number }, max, color }]
 * @param {number} height - SVG height in px (square, capped by width)
 */
const DepartmentRadar = ({ series = [], height = 360 }) => {
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
        if (!svgRef.current || width === 0 || !series.length) return;

        // Axes = union of all department codes across every series
        const axes = [...new Set(series.flatMap(s => Object.keys(s.values || {})))];
        if (axes.length < 3) return;   // a radar needs at least a triangle

        const size = Math.min(width, height);
        const cx   = width / 2;
        const cy   = size / 2;
        const R    = size * 0.34;
        const n    = axes.length;
        const angle = i => (i / n) * 2 * Math.PI - Math.PI / 2;   // start at top

        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();
        svg.attr('width', width).attr('height', size);
        const g = svg.append('g').attr('transform', `translate(${cx},${cy})`);

        // Concentric grid rings
        [0.25, 0.5, 0.75, 1].forEach(f => {
            g.append('polygon')
                .attr('points', axes.map((_, i) =>
                    `${R * f * Math.cos(angle(i))},${R * f * Math.sin(angle(i))}`).join(' '))
                .attr('fill', 'none')
                .attr('stroke', 'currentColor')
                .attr('stroke-opacity', 0.08);
        });

        // Spokes + axis labels
        axes.forEach((ax, i) => {
            const x = R * Math.cos(angle(i));
            const y = R * Math.sin(angle(i));
            g.append('line')
                .attr('x1', 0).attr('y1', 0).attr('x2', x).attr('y2', y)
                .attr('stroke', 'currentColor').attr('stroke-opacity', 0.1);
            const lr = R + size * 0.05;
            g.append('text')
                .attr('x', lr * Math.cos(angle(i)))
                .attr('y', lr * Math.sin(angle(i)))
                .attr('text-anchor', Math.abs(Math.cos(angle(i))) < 0.3 ? 'middle'
                    : Math.cos(angle(i)) > 0 ? 'start' : 'end')
                .attr('dominant-baseline', 'central')
                .attr('font-size', '10px').attr('font-weight', '800')
                .attr('fill', 'currentColor').attr('opacity', 0.6)
                .text(ax);
        });

        // One polygon per metric
        series.forEach((s, si) => {
            const max = s.max || d3.max(axes, ax => Number(s.values[ax] || 0)) || 1;
            const pts = axes.map((ax, i) => {
                const v = Number(s.values[ax] || 0);
                const rr = R * Math.min(1, v / max);
                return { ax, v, x: rr * Math.cos(angle(i)), y: rr * Math.sin(angle(i)) };
            });

            const poly = g.append('polygon')
                .attr('points', pts.map(p => `${p.x},${p.y}`).join(' '))
                .attr('fill', s.color).attr('fill-opacity', 0.14)
                .attr('stroke', s.color).attr('stroke-width', 2).attr('stroke-opacity', 0.9)
                .attr('transform', 'scale(0)');
            poly.transition().duration(700).delay(si * 140).ease(d3.easeCubicOut)
                .attr('transform', 'scale(1)');

            g.selectAll(`.v-${si}`).data(pts).enter().append('circle')
                .attr('cx', p => p.x).attr('cy', p => p.y).attr('r', 0)
                .attr('fill', s.color).style('cursor', 'pointer')
                .on('mouseenter', function (event, p) {
                    d3.select(this).attr('r', 6);
                    const r = svgRef.current.getBoundingClientRect();
                    d3.select(tooltipRef.current)
                        .style('display', 'block')
                        .style('left', `${event.clientX - r.left + 14}px`)
                        .style('top',  `${event.clientY - r.top  - 38}px`)
                        .html(`<span style="color:${s.color};font-weight:800">${s.label}</span> · ${p.ax}<br/>${p.v.toFixed(2)}`);
                })
                .on('mouseleave', function () {
                    d3.select(this).attr('r', 4);
                    d3.select(tooltipRef.current).style('display', 'none');
                })
                .transition().duration(500).delay(si * 140 + 400).attr('r', 4);
        });

    }, [series, width, height]);

    return (
        <div ref={containerRef} className="relative w-full text-base-content space-y-3">
            <div className="flex justify-center">
                <svg ref={svgRef} />
            </div>
            <div className="flex flex-wrap justify-center gap-x-5 gap-y-2">
                {series.map(s => (
                    <div key={s.label} className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-[3px]" style={{ background: s.color }} />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-base-content/65">
                            {s.label}
                        </span>
                        {s.max ? <span className="text-[10px] font-black text-base-content/30">/{s.max}</span> : null}
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

export default DepartmentRadar;
