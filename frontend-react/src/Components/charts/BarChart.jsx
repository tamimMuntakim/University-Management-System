import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

const CHART_COLORS = [
    '#3b82f6', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6', '#6b7280', '#ef4444', '#14b8a6'
];

/**
 * BarChart — vertical bar chart
 * @param {Object} data   - { label: count, ... }
 * @param {string} color  - Override all bars with a single color (optional)
 * @param {number} height - SVG height in px
 */
const BarChart = ({ data = {}, color, height = 280 }) => {
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

        const entries = Object.entries(data);
        const margin  = { top: 12, right: 16, bottom: 48, left: 44 };
        const W = width  - margin.left - margin.right;
        const H = height - margin.top  - margin.bottom;

        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();
        svg.attr('width', width).attr('height', height);

        const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

        const x = d3.scaleBand().domain(entries.map(([k]) => k)).range([0, W]).padding(0.35);
        const y = d3.scaleLinear()
            .domain([0, d3.max(entries, ([, v]) => Number(v)) * 1.18])
            .range([H, 0]).nice();

        // Grid lines
        g.append('g')
            .call(d3.axisLeft(y).tickSize(-W).tickFormat('').ticks(4))
            .call(s => s.select('.domain').remove())
            .call(s => s.selectAll('.tick line')
                .attr('stroke', 'currentColor').attr('stroke-opacity', 0.07).attr('stroke-dasharray', '4,3'));

        // Bars
        g.selectAll('.bar').data(entries).enter().append('rect')
            .attr('x',      ([k]) => x(k))
            .attr('width',  x.bandwidth())
            .attr('y',      H)
            .attr('height', 0)
            .attr('rx',     7)
            .attr('fill',   (_, i) => color || CHART_COLORS[i % CHART_COLORS.length])
            .attr('opacity', 0.82)
            .style('cursor', 'pointer')
            .on('mouseenter', function (event, [k, v]) {
                d3.select(this).transition().duration(120).attr('opacity', 1);
                const r = svgRef.current.getBoundingClientRect();
                d3.select(tooltipRef.current)
                    .style('display', 'block')
                    .style('left', `${event.clientX - r.left + 14}px`)
                    .style('top',  `${event.clientY - r.top  - 34}px`)
                    .html(`<strong>${k}</strong>: ${v}`);
            })
            .on('mouseleave', function () {
                d3.select(this).transition().duration(120).attr('opacity', 0.82);
                d3.select(tooltipRef.current).style('display', 'none');
            })
            .transition().duration(720).delay((_, i) => i * 65).ease(d3.easeCubicOut)
            .attr('y',      ([, v]) => y(Number(v)))
            .attr('height', ([, v]) => H - y(Number(v)));

        // X axis
        g.append('g').attr('transform', `translate(0,${H})`)
            .call(d3.axisBottom(x).tickSize(0))
            .call(s => s.select('.domain').attr('stroke', 'currentColor').attr('stroke-opacity', 0.12))
            .call(s => s.selectAll('.tick text')
                .attr('fill', 'currentColor').attr('opacity', 0.6)
                .attr('font-size', '10px').attr('dy', '1.25em')
                .each(function () {
                    const t = d3.select(this);
                    const v = t.text();
                    if (v.length > 8) t.text(v.slice(0, 7) + '…');
                }));

        // Y axis
        g.append('g').call(d3.axisLeft(y).ticks(4).tickSize(0))
            .call(s => s.select('.domain').remove())
            .call(s => s.selectAll('.tick text')
                .attr('fill', 'currentColor').attr('opacity', 0.5).attr('font-size', '10px'));

    }, [data, width, height, color]);

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

export default BarChart;