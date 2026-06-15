import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

/**
 * LineChart — line + gradient fill for ordered categorical or date-keyed data
 * @param {Object}  data      - { label: value, ... } (auto-sorted by key)
 * @param {string}  color     - Hex color for the line and fill
 * @param {Array}   yDomain   - Optional fixed [min, max] for y-axis, e.g. [0, 4.0] for CGPA
 * @param {number}  height    - SVG height in px
 */
const LineChart = ({ data = {}, color = '#8b5cf6', yDomain, height = 280 }) => {
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
        if (!svgRef.current || width === 0 || Object.keys(data).length === 0) return;

        const entries = Object.entries(data).sort(([a], [b]) => a.localeCompare(b));
        const margin  = { top: 12, right: 16, bottom: 48, left: 44 };
        const W = width  - margin.left - margin.right;
        const H = height - margin.top  - margin.bottom;

        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();
        svg.attr('width', width).attr('height', height);

        // Gradient fill
        const gid  = `lg-${color.replace('#', '')}`;
        const defs = svg.append('defs');
        const grad = defs.append('linearGradient').attr('id', gid)
            .attr('x1', '0').attr('y1', '0').attr('x2', '0').attr('y2', '1');
        grad.append('stop').attr('offset', '0%').attr('stop-color', color).attr('stop-opacity', 0.3);
        grad.append('stop').attr('offset', '100%').attr('stop-color', color).attr('stop-opacity', 0.01);

        const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

        // Scales
        const x = d3.scalePoint().domain(entries.map(([k]) => k)).range([0, W]).padding(0.15);

        const minY = yDomain ? yDomain[0] : 0;
        const maxY = yDomain
            ? yDomain[1]
            : d3.max(entries, ([, v]) => Number(v)) * 1.18;
        const y = d3.scaleLinear().domain([minY, maxY]).range([H, 0]).nice();

        // Grid
        g.append('g')
            .call(d3.axisLeft(y).tickSize(-W).tickFormat('').ticks(4))
            .call(s => s.select('.domain').remove())
            .call(s => s.selectAll('.tick line')
                .attr('stroke', 'currentColor').attr('stroke-opacity', 0.07).attr('stroke-dasharray', '4,3'));

        const curve = d3.curveCatmullRom.alpha(0.5);

        const area = d3.area().x(([k]) => x(k)).y0(H).y1(([, v]) => y(Number(v))).curve(curve);
        const line = d3.line().x(([k]) => x(k)).y(([, v]) => y(Number(v))).curve(curve);

        g.append('path').datum(entries).attr('fill', `url(#${gid})`).attr('d', area);

        const lp = g.append('path').datum(entries)
            .attr('fill', 'none').attr('stroke', color).attr('stroke-width', 2.5).attr('d', line);

        // Draw-in animation
        const len = lp.node().getTotalLength();
        lp.attr('stroke-dasharray', `${len} ${len}`).attr('stroke-dashoffset', len)
            .transition().duration(950).ease(d3.easeCubicOut).attr('stroke-dashoffset', 0);

        // Dots
        g.selectAll('.dot').data(entries).enter().append('circle')
            .attr('cx', ([k]) => x(k))
            .attr('cy', ([, v]) => y(Number(v)))
            .attr('r',  0)
            .attr('fill',         color)
            .attr('stroke',       'white')
            .attr('stroke-width', 2)
            .style('cursor', 'pointer')
            .on('mouseenter', function (event, [k, v]) {
                d3.select(this).transition().duration(100).attr('r', 6.5);
                const r = svgRef.current.getBoundingClientRect();
                d3.select(tooltipRef.current)
                    .style('display', 'block')
                    .style('left', `${event.clientX - r.left + 14}px`)
                    .style('top',  `${event.clientY - r.top  - 34}px`)
                    .html(`<strong>${k}</strong>: ${Number(v).toFixed(2)}`);
            })
            .on('mouseleave', function () {
                d3.select(this).transition().duration(100).attr('r', 4);
                d3.select(tooltipRef.current).style('display', 'none');
            })
            .transition().delay((_, i) => i * (900 / entries.length)).duration(180).attr('r', 4);

        // X axis
        const tickEvery = Math.max(1, Math.ceil(entries.length / 8));
        g.append('g').attr('transform', `translate(0,${H})`)
            .call(d3.axisBottom(x)
                .tickValues(entries.filter((_, i) => i % tickEvery === 0).map(([k]) => k))
                .tickSize(0))
            .call(s => s.select('.domain').attr('stroke', 'currentColor').attr('stroke-opacity', 0.12))
            .call(s => s.selectAll('.tick text')
                .attr('fill', 'currentColor').attr('opacity', 0.5)
                .attr('font-size', '10px').attr('dy', '1.25em'));

        // Y axis
        g.append('g').call(d3.axisLeft(y).ticks(4).tickSize(0))
            .call(s => s.select('.domain').remove())
            .call(s => s.selectAll('.tick text')
                .attr('fill', 'currentColor').attr('opacity', 0.5)
                .attr('font-size', '10px').attr('dx', '-4px'));

    }, [data, width, height, color, yDomain]);

    return (
        <div ref={containerRef} className="relative w-full text-base-content">
            <svg ref={svgRef} />
            <div
                ref={tooltipRef}
                style={{ display: 'none', position: 'absolute', pointerEvents: 'none' }}
                className="bg-base-100 border border-base-300 rounded-xl px-3 py-1.5 text-xs shadow-xl z-20 text-base-content whitespace-nowrap"
            />
        </div>
    );
};

export default LineChart;