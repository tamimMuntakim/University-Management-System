import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

/**
 * PolarClock — radial "heat-clock" for cyclical 24-hour data.
 * Each hour is a wedge growing outward from the centre; wedge length and
 * opacity both encode the count, so busy hours read instantly as a long,
 * solid spoke. Midnight sits at the top and the day runs clockwise.
 *
 * @param {Object} data   - { "HH:00": count, ... } (sparse keys are fine)
 * @param {string} color  - Accent colour for the wedges
 * @param {number} height - SVG height in px (chart is square, capped by width)
 */
const PolarClock = ({ data = {}, color = '#3b82f6', height = 320 }) => {
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

        // Normalise to a full 24-hour ring (fill missing hours with 0)
        const hours = d3.range(24).map(h => {
            const key = `${String(h).padStart(2, '0')}:00`;
            return { hour: h, key, count: Number(data[key] || 0) };
        });
        const maxCount = d3.max(hours, d => d.count) || 1;
        const busiest  = hours.reduce((a, b) => (b.count > a.count ? b : a), hours[0]);

        const size = Math.min(width, height);
        const cx   = width / 2;
        const cy   = size / 2;
        const ir   = size * 0.14;                 // inner hole
        const R    = size * 0.40;                 // max wedge reach
        const band = (2 * Math.PI) / 24;

        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();
        svg.attr('width', width).attr('height', size);
        const g = svg.append('g').attr('transform', `translate(${cx},${cy})`);

        const lenScale = d3.scaleLinear().domain([0, maxCount]).range([ir + 4, R]);
        const opaScale = d3.scaleLinear().domain([0, maxCount]).range([0.22, 1]);
        const arc = d3.arc().cornerRadius(2);

        // Guide rings
        [0.5, 0.75, 1].forEach(f => {
            g.append('circle')
                .attr('r', ir + (R - ir) * f)
                .attr('fill', 'none')
                .attr('stroke', 'currentColor')
                .attr('stroke-opacity', 0.07)
                .attr('stroke-dasharray', '3,4');
        });

        // Hour wedges
        const wedges = hours.map(d => ({
            ...d,
            s: d.hour * band - band / 2 + 0.012,
            e: d.hour * band + band / 2 - 0.012,
            outer: lenScale(d.count),
        }));

        g.selectAll('.wedge').data(wedges).enter().append('path')
            .attr('fill', color)
            .attr('fill-opacity', d => (d.count === 0 ? 0.05 : opaScale(d.count)))
            .style('cursor', 'pointer')
            .attr('d', d => arc({ innerRadius: ir, outerRadius: ir + 1, startAngle: d.s, endAngle: d.e }))
            .on('mouseenter', function (event, d) {
                d3.select(this).attr('fill-opacity', 1);
                const r = svgRef.current.getBoundingClientRect();
                const label = `${d.key}–${String((d.hour + 1) % 24).padStart(2, '0')}:00`;
                d3.select(tooltipRef.current)
                    .style('display', 'block')
                    .style('left', `${event.clientX - r.left + 14}px`)
                    .style('top',  `${event.clientY - r.top  - 34}px`)
                    .html(`<strong>${label}</strong> · ${d.count} login${d.count === 1 ? '' : 's'}`);
            })
            .on('mouseleave', function (_, d) {
                d3.select(this).attr('fill-opacity', d.count === 0 ? 0.05 : opaScale(d.count));
                d3.select(tooltipRef.current).style('display', 'none');
            })
            .transition().duration(720).delay(d => d.hour * 28).ease(d3.easeCubicOut)
            .attrTween('d', d => {
                const i = d3.interpolate(ir + 1, d.outer);
                return t => arc({ innerRadius: ir, outerRadius: i(t), startAngle: d.s, endAngle: d.e });
            });

        // Hour ticks every 3h — cardinal hours (00/06/12/18) emphasised
        d3.range(0, 24, 3).forEach(h => {
            const a   = h * band;                       // 0 = top, clockwise
            const rad = R + size * 0.052;
            const cardinal = h % 6 === 0;
            g.append('text')
                .attr('x',  rad * Math.sin(a))
                .attr('y', -rad * Math.cos(a))
                .attr('text-anchor', 'middle')
                .attr('dominant-baseline', 'central')
                .attr('font-size', cardinal ? '11px' : '9.5px')
                .attr('font-weight', cardinal ? '900' : '700')
                .attr('letter-spacing', '0.06em')
                .attr('fill', 'currentColor')
                .attr('opacity', cardinal ? 0.7 : 0.36)
                .text(String(h).padStart(2, '0'));
        });

        // Centre readout — busiest hour
        g.append('text')
            .attr('text-anchor', 'middle').attr('dy', '-0.12em')
            .attr('font-size', `${size * 0.105}px`).attr('font-weight', '900')
            .attr('letter-spacing', '-0.02em')
            .attr('fill', color)
            .attr('opacity', 0).text(busiest.count)
            .transition().delay(600).duration(300).attr('opacity', maxCount > 1 ? 1 : 0.3);
        g.append('text')
            .attr('text-anchor', 'middle').attr('dy', '1.15em')
            .attr('font-size', '8.5px').attr('font-weight', '800')
            .attr('letter-spacing', '0.18em')
            .attr('fill', 'currentColor').attr('opacity', 0.45)
            .text(maxCount > 1 ? `PEAK ${busiest.key}` : 'NO LOGINS YET');

    }, [data, width, height, color]);

    return (
        <div ref={containerRef} className="relative w-full text-base-content flex justify-center">
            <svg ref={svgRef} />
            <div
                ref={tooltipRef}
                style={{ display: 'none', position: 'absolute', pointerEvents: 'none' }}
                className="bg-base-100 border border-base-300 rounded-xl px-3 py-1.5 text-xs shadow-xl z-20 text-base-content whitespace-nowrap"
            />
        </div>
    );
};

export default PolarClock;
