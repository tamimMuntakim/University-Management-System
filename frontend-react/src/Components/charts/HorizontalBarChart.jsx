import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

const CHART_COLORS = [
    '#3b82f6', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6', '#6b7280', '#ef4444', '#14b8a6'
];

/**
 * HorizontalBarChart — sorted horizontal bars
 * @param {Object}   data        - { label: value, ... }
 * @param {string}   color       - Single color override (optional, defaults to multi-color)
 * @param {Function} valueFormat - Custom formatter for value labels and tooltips, e.g. v => v.toFixed(1)
 */
const HorizontalBarChart = ({ data = {}, color, valueFormat = v => v }) => {
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

        const entries = Object.entries(data).sort(([, a], [, b]) => Number(b) - Number(a));

        const BH      = 30;   // bar height px
        const gap     = 10;   // gap between bars px
        const totalH  = entries.length * (BH + gap) + 50;

        const margin  = { top: 10, right: 68, bottom: 18, left: 128 };
        const W = width  - margin.left - margin.right;
        const H = totalH - margin.top  - margin.bottom;

        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();
        svg.attr('width', width).attr('height', totalH);

        const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

        const x = d3.scaleLinear()
            .domain([0, d3.max(entries, ([, v]) => Number(v)) * 1.22])
            .range([0, W]);

        const y = d3.scaleBand()
            .domain(entries.map(([k]) => k))
            .range([0, H])
            .padding(0.32);

        // Light vertical grid
        g.append('g')
            .call(d3.axisTop(x).tickSize(-H).tickFormat('').ticks(4))
            .call(s => s.select('.domain').remove())
            .call(s => s.selectAll('.tick line')
                .attr('stroke', 'currentColor').attr('stroke-opacity', 0.06).attr('stroke-dasharray', '4,3'));

        // Background tracks
        g.selectAll('.track').data(entries).enter().append('rect')
            .attr('y',      ([k]) => y(k))
            .attr('height', y.bandwidth())
            .attr('x', 0)
            .attr('width',  W)
            .attr('rx', 7)
            .attr('fill', 'currentColor')
            .attr('opacity', 0.04);

        // Bars
        g.selectAll('.bar').data(entries).enter().append('rect')
            .attr('y',      ([k]) => y(k))
            .attr('height', y.bandwidth())
            .attr('x', 0)
            .attr('width',  0)
            .attr('rx', 7)
            .attr('fill',    (_, i) => color || CHART_COLORS[i % CHART_COLORS.length])
            .attr('opacity', 0.82)
            .style('cursor', 'pointer')
            .on('mouseenter', function (event, [k, v]) {
                d3.select(this).transition().duration(120).attr('opacity', 1);
                const r = svgRef.current.getBoundingClientRect();
                d3.select(tooltipRef.current)
                    .style('display', 'block')
                    .style('left', `${event.clientX - r.left + 14}px`)
                    .style('top',  `${event.clientY - r.top  - 34}px`)
                    .html(`<strong>${k}</strong>: ${valueFormat(Number(v))}`);
            })
            .on('mouseleave', function () {
                d3.select(this).transition().duration(120).attr('opacity', 0.82);
                d3.select(tooltipRef.current).style('display', 'none');
            })
            .transition().duration(720).delay((_, i) => i * 75).ease(d3.easeCubicOut)
            .attr('width', ([, v]) => x(Number(v)));

        // Value labels (appear after bars animate in)
        g.selectAll('.val-label').data(entries).enter().append('text')
            .attr('y',   ([k]) => y(k) + y.bandwidth() / 2)
            .attr('x',   0)
            .attr('dy',  '0.35em')
            .attr('font-size',   '11px')
            .attr('font-weight', '800')
            .attr('fill',    'currentColor')
            .attr('opacity', 0)
            .text(([, v]) => valueFormat(Number(v)))
            .transition().delay((_, i) => i * 75 + 560).duration(180)
            .attr('x',       ([, v]) => x(Number(v)) + 8)
            .attr('opacity', 0.55);

        // Y axis — label names
        g.append('g').call(d3.axisLeft(y).tickSize(0))
            .call(s => s.select('.domain').remove())
            .call(s => s.selectAll('.tick text')
                .attr('fill',        'currentColor')
                .attr('opacity',     0.72)
                .attr('font-size',   '11px')
                .attr('font-weight', '600')
                .attr('dx', '-7px')
                .each(function () {
                    const t = d3.select(this);
                    const v = t.text();
                    if (v.length > 16) t.text(v.slice(0, 15) + '…');
                }));

    }, [data, width, color, valueFormat]);

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

export default HorizontalBarChart;