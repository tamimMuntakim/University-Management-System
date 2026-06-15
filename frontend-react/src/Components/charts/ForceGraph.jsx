import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

const DEPT_COLORS = [
    '#3b82f6', '#ec4899', '#10b981', '#f59e0b',
    '#8b5cf6', '#ef4444', '#14b8a6', '#f97316',
    '#06b6d4', '#84cc16',
];

/**
 * ForceGraph — Disjoint force-directed graph
 * Each department is a hub node connected to its course satellite nodes.
 * Clusters are kept visually separate via forceX / forceY per group.
 *
 * @param {Object} data   - { deptCode: [courseName, ...], ... }
 * @param {number} height - SVG height in px
 */
const ForceGraph = ({ data = {}, height = 500 }) => {
    const svgRef        = useRef(null);
    const containerRef  = useRef(null);
    const tooltipRef    = useRef(null);
    const simRef        = useRef(null);
    const [width, setWidth] = useState(0);

    useEffect(() => {
        if (!containerRef.current) return;
        const ro = new ResizeObserver(e => setWidth(e[0].contentRect.width));
        ro.observe(containerRef.current);
        return () => ro.disconnect();
    }, []);

    useEffect(() => {
        if (!svgRef.current || width === 0) return;

        const deptEntries = Object.entries(data).filter(([, v]) => Array.isArray(v) && v.length > 0);
        if (!deptEntries.length) return;

        // ── Build nodes & links ──────────────────────────────────────────────
        const nodes = [];
        const links = [];

        // Grid of cluster anchor points
        const cols    = Math.ceil(Math.sqrt(deptEntries.length));
        const rows    = Math.ceil(deptEntries.length / cols);
        const cellW   = width  / cols;
        const cellH   = height / rows;

        deptEntries.forEach(([dept, courses], di) => {
            const color = DEPT_COLORS[di % DEPT_COLORS.length];
            const col   = di % cols;
            const row   = Math.floor(di / cols);

            // Cluster centre — nodes are attracted here via forceX/Y
            const cx = (col + 0.5) * cellW;
            const cy = (row + 0.5) * cellH;

            // Department hub node
            nodes.push({
                id:    `dept::${dept}`,
                label: dept,
                type:  'dept',
                group: di,
                color,
                r:     20,
                cx,
                cy,
            });

            // Course satellite nodes
            courses.forEach((course, ci) => {
                nodes.push({
                    id:    `course::${dept}::${ci}`,
                    label: course,
                    type:  'course',
                    group: di,
                    color,
                    r:     15,
                    cx,
                    cy,
                });
                links.push({
                    source: `dept::${dept}`,
                    target: `course::${dept}::${ci}`,
                });
            });
        });

        // ── SVG setup ────────────────────────────────────────────────────────
        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();
        svg.attr('width', width).attr('height', height);

        // Zoom layer
        const zoomG = svg.append('g');
        svg.call(
            d3.zoom()
                .scaleExtent([0.3, 3])
                .on('zoom', event => zoomG.attr('transform', event.transform))
        );

        // ── Links ────────────────────────────────────────────────────────────
        const linkSel = zoomG.append('g').attr('class', 'links')
            .selectAll('line')
            .data(links)
            .enter()
            .append('line')
            .attr('stroke',         d => {
                const src = nodes.find(n => n.id === d.source || n === d.source);
                return src ? src.color : 'currentColor';
            })
            .attr('stroke-opacity', 0.25)
            .attr('stroke-width',   1.5)
            .attr('stroke-dasharray', '4,3');

        // ── Node groups ──────────────────────────────────────────────────────
        const nodeSel = zoomG.append('g').attr('class', 'nodes')
            .selectAll('.node')
            .data(nodes)
            .enter()
            .append('g')
            .attr('class', 'node')
            .style('cursor', 'pointer')
            .call(
                d3.drag()
                    .on('start', (event, d) => {
                        if (!event.active) simRef.current?.alphaTarget(0.3).restart();
                        d.fx = d.x;
                        d.fy = d.y;
                    })
                    .on('drag', (event, d) => {
                        d.fx = event.x;
                        d.fy = event.y;
                    })
                    .on('end', (event, d) => {
                        if (!event.active) simRef.current?.alphaTarget(0);
                        d.fx = null;
                        d.fy = null;
                    })
            );

        // Glow ring (dept only)
        nodeSel.filter(d => d.type === 'dept')
            .append('circle')
            .attr('r',       d => d.r + 7)
            .attr('fill',    d => d.color)
            .attr('opacity', 0.12);

        // Main circle
        nodeSel.append('circle')
            .attr('r',             d => d.r)
            .attr('fill',          d => d.color)
            .attr('opacity',       d => d.type === 'dept' ? 0.92 : 0.6)
            .attr('stroke',        d => d.color)
            .attr('stroke-width',  d => d.type === 'dept' ? 2.5 : 1)
            .attr('stroke-opacity',0.6)
            .on('mouseenter', function (event, d) {
                d3.select(this)
                    .transition().duration(130)
                    .attr('r', d.r + 4)
                    .attr('opacity', 1);

                const rect = svgRef.current.getBoundingClientRect();
                d3.select(tooltipRef.current)
                    .style('display', 'block')
                    .style('left',  `${event.clientX - rect.left + 14}px`)
                    .style('top',   `${event.clientY - rect.top  - 38}px`)
                    .html(
                        d.type === 'dept'
                            ? `<span style="color:${d.color};font-weight:900">Dept:</span> ${d.label}`
                            : `<span style="color:${d.color}">●</span>&nbsp;${d.label}`
                    );
            })
            .on('mouseleave', function (_, d) {
                d3.select(this)
                    .transition().duration(130)
                    .attr('r', d.r)
                    .attr('opacity', d.type === 'dept' ? 0.92 : 0.6);
                d3.select(tooltipRef.current).style('display', 'none');
            });

        // Dept label (inside hub circle)
        nodeSel.filter(d => d.type === 'dept')
            .append('text')
            .attr('text-anchor',    'middle')
            .attr('dominant-baseline', 'central')
            .attr('font-size',      '9px')
            .attr('font-weight',    '900')
            .attr('letter-spacing', '0.04em')
            .attr('fill',           'white')
            .attr('pointer-events', 'none')
            .text(d => d.label.length > 5 ? d.label.slice(0, 4) + '…' : d.label);

        // ── Force simulation ─────────────────────────────────────────────────
        const sim = d3.forceSimulation(nodes)
            .force('link',      d3.forceLink(links).id(d => d.id).distance(65).strength(0.85))
            .force('charge',    d3.forceManyBody().strength(-110))
            .force('collision', d3.forceCollide(d => d.r + 5).iterations(3))
            // Pull each node toward its cluster centre — keeps groups disjoint
            .force('x',         d3.forceX(d => d.cx).strength(0.2))
            .force('y',         d3.forceY(d => d.cy).strength(0.2));

        simRef.current = sim;

        sim.on('tick', () => {
            linkSel
                .attr('x1', d => d.source.x)
                .attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x)
                .attr('y2', d => d.target.y);

            nodeSel.attr('transform', d => `translate(${d.x ?? 0},${d.y ?? 0})`);
        });

        return () => sim.stop();
    }, [data, width, height]);

    const deptEntries = Object.entries(data).filter(([, v]) => Array.isArray(v));

    return (
        <div ref={containerRef} className="relative w-full text-base-content space-y-4">

            {/* Hint bar */}
            <div className="flex flex-wrap items-center gap-4 px-1">
                <div className="flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full border-2 border-primary bg-primary/80 shrink-0" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-base-content/50">Department hub</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary/50 shrink-0" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-base-content/50">Course node</span>
                </div>
                <span className="ml-auto text-[10px] font-bold text-base-content/30 italic">
                    Drag nodes · Scroll to zoom
                </span>
            </div>

            <svg ref={svgRef} className="rounded-xl w-full" />

            {/* Dept colour legend */}
            <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 px-2">
                {deptEntries.map(([dept, courses], i) => (
                    <div key={dept} className="flex items-center gap-1.5">
                        <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ background: DEPT_COLORS[i % DEPT_COLORS.length] }}
                        />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-base-content/65">
                            {dept}
                        </span>
                        <span className="text-[10px] font-black text-base-content/30">
                            ({courses.length})
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

export default ForceGraph;