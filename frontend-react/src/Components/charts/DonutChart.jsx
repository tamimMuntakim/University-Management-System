import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

const CHART_COLORS = [
    '#3b82f6', '#ec4899', '#10b981', '#f59e0b',
    '#8b5cf6', '#6b7280', '#ef4444', '#14b8a6',
    '#f97316', '#06b6d4', '#84cc16', '#a855f7',
];

/**
 * DonutChart — Observable-style with outside labels + polyline connectors
 * @param {Object} data    - { label: count, ... }
 * @param {number} maxSize - Max SVG size in px (default 400 — use ≥300 for labels to fit)
 */
const DonutChart = ({ data = {}, maxSize = 400 }) => {
    const svgRef       = useRef(null);
    const containerRef = useRef(null);
    const [size, setSize] = useState(0);

    useEffect(() => {
        if (!containerRef.current) return;
        const ro = new ResizeObserver(entries => {
            const w = entries[0].contentRect.width;
            setSize(Math.min(w, maxSize));
        });
        ro.observe(containerRef.current);
        return () => ro.disconnect();
    }, [maxSize]);

    useEffect(() => {
        if (!svgRef.current || size === 0) return;

        const validEntries = Object.entries(data).filter(([, v]) => Number(v) > 0);
        if (!validEntries.length) return;

        const total  = validEntries.reduce((s, [, v]) => s + Number(v), 0);

        // ── Geometry ─────────────────────────────────────────────────────────
        // Reserve ~34% of half-width for labels on each side
        const r       = size * 0.29;   // donut outer radius
        const ir      = r * 0.56;      // donut inner radius (hole)
        const labelR  = r * 1.62;      // label anchor radial distance
        const tickLen = r * 0.18;      // horizontal tick length after the bend

        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();
        svg
            .attr('width',  size)
            .attr('height', size)
            .style('overflow', 'visible');   // labels can render outside the SVG box

        const g = svg.append('g')
            .attr('transform', `translate(${size / 2},${size / 2})`);

        // ── Pie layout ───────────────────────────────────────────────────────
        const pieFn = d3.pie()
            .sort(null)
            .value(d => Number(d[1]))
            .padAngle(0.022);

        const pieData = pieFn(validEntries);

        const arc      = d3.arc().innerRadius(ir).outerRadius(r - 2).cornerRadius(5);
        const arcHover = d3.arc().innerRadius(ir).outerRadius(r + 5).cornerRadius(5);

        const midAngle = d => d.startAngle + (d.endAngle - d.startAngle) / 2;

        // ── Arc slices ───────────────────────────────────────────────────────
        const paths = g.selectAll('.arc-path')
            .data(pieData)
            .enter()
            .append('path')
            .attr('class', 'arc-path')
            .attr('fill',    d => CHART_COLORS[d.index % CHART_COLORS.length])
            .attr('opacity', 0.88)
            .style('cursor', 'pointer')
            .on('mouseenter', function () {
                d3.select(this)
                    .transition().duration(140)
                    .attr('d', arcHover)
                    .attr('opacity', 1);
            })
            .on('mouseleave', function () {
                d3.select(this)
                    .transition().duration(140)
                    .attr('d', arc)
                    .attr('opacity', 0.88);
            });

        // Entrance animation — arcs sweep in from 0
        paths
            .transition().duration(820).ease(d3.easeCubicOut)
            .attrTween('d', d => {
                const interp = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
                return t => arc(interp(t));
            });

        // ── Center labels ────────────────────────────────────────────────────
        const centerFontSize  = Math.max(18, r * 0.44);
        const centerFontSize2 = Math.max(7,  r * 0.16);

        g.append('text')
            .attr('text-anchor', 'middle')
            .attr('dy', `${centerFontSize * 0.18}px`)
            .attr('font-size',   `${centerFontSize}px`)
            .attr('font-weight', '900')
            .attr('fill',        'currentColor')
            .text(total.toLocaleString());

        g.append('text')
            .attr('text-anchor',  'middle')
            .attr('dy',           `${centerFontSize * 0.82}px`)
            .attr('font-size',    `${centerFontSize2}px`)
            .attr('font-weight',  '700')
            .attr('letter-spacing', '0.14em')
            .attr('fill',         'currentColor')
            .attr('opacity',      0.38)
            .text('TOTAL');

        // ── Outside labels + connectors (fade in after arc animation) ────────
        const MIN_ARC_ANGLE = 0.13;  // ~7.4° — skip label for slices smaller than this
        const labelData = pieData.filter(d => (d.endAngle - d.startAngle) >= MIN_ARC_ANGLE);

        const labelFontSize  = Math.max(9,  r * 0.185);
        const labelFontSize2 = Math.max(8,  r * 0.158);

        labelData.forEach((d, li) => {
            const color   = CHART_COLORS[d.index % CHART_COLORS.length];
            const ma      = midAngle(d);
            const isRight = ma <= Math.PI;           // right side of the chart
            const sinA    = Math.sin(ma);
            const cosA    = Math.cos(ma);

            // Three polyline points
            const pA = [sinA * (r + 2),       -cosA * (r + 2)];        // just outside arc
            const pB = [sinA * labelR,          -cosA * labelR];         // bend point
            const pC = [pB[0] + (isRight ? tickLen : -tickLen), pB[1]]; // horizontal end

            // Text position (just past the tick end)
            const tx     = pC[0] + (isRight ? 5 : -5);
            const anchor = isRight ? 'start' : 'end';

            const pct = ((Number(d.data[1]) / total) * 100).toFixed(1);

            // Connector group — appears after arcs finish
            const cg = g.append('g').attr('opacity', 0);

            // Polyline
            cg.append('polyline')
                .attr('points',       [pA, pB, pC].map(p => p.join(',')).join(' '))
                .attr('fill',         'none')
                .attr('stroke',       color)
                .attr('stroke-width', 1.1)
                .attr('stroke-opacity', 0.55)
                .attr('stroke-linecap',  'round')
                .attr('stroke-linejoin', 'round');

            // Category name (colored, bold)
            cg.append('text')
                .attr('x',            tx)
                .attr('y',            pC[1] - labelFontSize * 0.55)
                .attr('text-anchor',  anchor)
                .attr('font-size',    `${labelFontSize}px`)
                .attr('font-weight',  '800')
                .attr('fill',         color)
                .attr('letter-spacing', '0.01em')
                .text(d.data[0]);

            // Value · percentage (muted)
            cg.append('text')
                .attr('x',           tx)
                .attr('y',           pC[1] + labelFontSize2 * 0.6)
                .attr('text-anchor', anchor)
                .attr('font-size',   `${labelFontSize2}px`)
                .attr('font-weight', '600')
                .attr('fill',        'currentColor')
                .attr('opacity',     0.45)
                .text(`${Number(d.data[1]).toLocaleString()} | ${pct}%`);

            // Fade in after arc animation completes
            cg.transition()
                .delay(840 + li * 35)
                .duration(220)
                .attr('opacity', 1);
        });

    }, [data, size]);

    return (
        <div ref={containerRef} className="flex justify-center w-full text-base-content">
            <svg ref={svgRef} />
        </div>
    );
};

export default DonutChart;