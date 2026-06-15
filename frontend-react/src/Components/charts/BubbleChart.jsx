import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

const COLORS = [
    '#3b82f6', '#ec4899', '#10b981', '#f59e0b',
    '#8b5cf6', '#ef4444', '#14b8a6', '#f97316',
    '#06b6d4', '#84cc16',
];

/**
 * BubbleChart — force-packed circles sized by value
 * @param {Object} data   - { label: value, ... }
 * @param {number} height - SVG height in px
 */
const BubbleChart = ({ data = {}, height = 420 }) => {
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

        const entries = Object.entries(data).filter(([, v]) => Number(v) > 0);
        if (!entries.length) return;

        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();
        svg.attr('width', width).attr('height', height);

        const maxVal = d3.max(entries, ([, v]) => Number(v));
        const minR   = 24;
        const maxR   = Math.min(width, height) / 4.5;
        const rScale = d3.scaleSqrt().domain([0, maxVal]).range([minR, maxR]);

        // Build node array — x/y start at center so simulation pulls from there
        const nodes = entries.map(([label, value], i) => ({
            id: i,
            label,
            value: Number(value),
            r:     rScale(Number(value)),
            color: COLORS[i % COLORS.length],
            x: width  / 2 + (Math.random() - 0.5) * 80,
            y: height / 2 + (Math.random() - 0.5) * 80,
        }));

        // Run simulation synchronously (300 ticks) so there's no jitter on mount
        const sim = d3.forceSimulation(nodes)
            .force('charge',    d3.forceManyBody().strength(8))
            .force('center',    d3.forceCenter(width / 2, height / 2).strength(0.06))
            .force('collision', d3.forceCollide(d => d.r + 3.5).iterations(3))
            .force('x',         d3.forceX(width  / 2).strength(0.035))
            .force('y',         d3.forceY(height / 2).strength(0.035))
            .stop();

        for (let i = 0; i < 320; i++) sim.tick();

        const g = svg.append('g');

        // ── Defs: radial gradient per bubble ────────────────────────────────
        const defs = svg.append('defs');
        nodes.forEach(d => {
            const grad = defs.append('radialGradient')
                .attr('id',    `bg-${d.id}`)
                .attr('cx',    '35%').attr('cy', '35%')
                .attr('r',     '65%');
            grad.append('stop').attr('offset', '0%')
                .attr('stop-color', d3.color(d.color).brighter(0.6)).attr('stop-opacity', 1);
            grad.append('stop').attr('offset', '100%')
                .attr('stop-color', d3.color(d.color).darker(0.4)).attr('stop-opacity', 1);
        });

        // ── Bubble groups ────────────────────────────────────────────────────
        const clamp = (val, lo, hi) => Math.max(lo, Math.min(hi, val));

        const bubble = g.selectAll('.bubble')
            .data(nodes)
            .enter()
            .append('g')
            .attr('class', 'bubble')
            .attr('transform', d =>
                `translate(${clamp(d.x, d.r, width - d.r)},${clamp(d.y, d.r, height - d.r)})`
            );

        // Shadow ring
        bubble.append('circle')
            .attr('r', d => d.r + 4)
            .attr('fill', d => d.color)
            .attr('opacity', 0.12);

        // Main circle — animates in
        bubble.append('circle')
            .attr('r', 0)
            .attr('fill',         d => `url(#bg-${d.id})`)
            .attr('stroke',       d => d.color)
            .attr('stroke-width', 2)
            .attr('stroke-opacity', 0.45)
            .style('cursor', 'pointer')
            .on('mouseenter', function (event, d) {
                d3.select(this)
                    .transition().duration(150)
                    .attr('r', d.r + 5)
                    .attr('stroke-opacity', 0.9);
                const rect = svgRef.current.getBoundingClientRect();
                d3.select(tooltipRef.current)
                    .style('display', 'block')
                    .style('left', `${event.clientX - rect.left + 16}px`)
                    .style('top',  `${event.clientY - rect.top  - 38}px`)
                    .html(`<strong>${d.label}</strong>&nbsp;·&nbsp;${d.value.toLocaleString()}`);
            })
            .on('mouseleave', function (_, d) {
                d3.select(this)
                    .transition().duration(150)
                    .attr('r', d.r)
                    .attr('stroke-opacity', 0.45);
                d3.select(tooltipRef.current).style('display', 'none');
            })
            .transition().duration(750)
            .delay((_, i) => i * 60)
            .ease(d3.easeElasticOut.amplitude(1).period(0.55))
            .attr('r', d => d.r);

        // Label — primary (dept code / short name)
        bubble.filter(d => d.r >= 28)
            .append('text')
            .attr('text-anchor',  'middle')
            .attr('dy', d => d.r >= 44 ? '-0.45em' : '0.35em')
            .attr('font-size',    d => `${Math.max(9, Math.min(14, d.r / 3.2))}px`)
            .attr('font-weight',  '900')
            .attr('fill',         'white')
            .attr('letter-spacing', '0.04em')
            .attr('pointer-events', 'none')
            .attr('opacity', 0)
            .text(d => d.label.length > 9 ? d.label.slice(0, 8) + '…' : d.label)
            .transition().delay((_, i) => i * 60 + 400).duration(220)
            .attr('opacity', 1);

        // Value — secondary (shown only when bubble is large enough)
        bubble.filter(d => d.r >= 44)
            .append('text')
            .attr('text-anchor',  'middle')
            .attr('dy',           '1.1em')
            .attr('font-size',    d => `${Math.max(10, Math.min(15, d.r / 3.8))}px`)
            .attr('font-weight',  '800')
            .attr('fill',         'white')
            .attr('opacity',       0)
            .attr('pointer-events', 'none')
            .text(d => d.value.toLocaleString())
            .transition().delay((_, i) => i * 60 + 500).duration(220)
            .attr('opacity', 0.65);

    }, [data, width, height]);

    // Legend (always rendered via React)
    const entries = Object.entries(data).filter(([, v]) => Number(v) > 0);

    return (
        <div ref={containerRef} className="relative w-full text-base-content space-y-4">
            <svg ref={svgRef} />

            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 px-2">
                {entries.map(([label, value], i) => (
                    <div key={label} className="flex items-center gap-1.5">
                        <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ background: COLORS[i % COLORS.length] }}
                        />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-base-content/65">
                            {label}
                        </span>
                        <span className="text-[10px] font-black text-base-content/35">
                            ({Number(value).toLocaleString()})
                        </span>
                    </div>
                ))}
            </div>

            {/* Tooltip */}
            <div
                ref={tooltipRef}
                style={{ display: 'none', position: 'absolute', pointerEvents: 'none' }}
                className="bg-base-100 border border-base-300 rounded-xl px-3 py-1.5 text-xs shadow-xl z-20 text-base-content whitespace-nowrap"
            />
        </div>
    );
};

export default BubbleChart;