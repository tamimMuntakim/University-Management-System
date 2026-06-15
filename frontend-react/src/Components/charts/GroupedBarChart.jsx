import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

/**
 * GroupedBarChart — side-by-side bars for multiple datasets per category
 *
 * @param {Object} data - Shape:
 *   {
 *     labels: string[],                          // x-axis categories (e.g. dept codes)
 *     datasets: Array<{
 *       label: string,                           // series name shown in legend
 *       values: { [label]: number },             // value keyed by label
 *       color: string                            // hex color for this series
 *     }>
 *   }
 * @param {number} height - SVG height in px
 */
const GroupedBarChart = ({ data, height = 280 }) => {
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
        if (!svgRef.current || width === 0 || !data) return;

        const { labels, datasets } = data;
        if (!labels?.length || !datasets?.length) return;

        const margin = { top: 12, right: 16, bottom: 50, left: 40 };
        const W = width  - margin.left - margin.right;
        const H = height - margin.top  - margin.bottom;

        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();
        svg.attr('width', width).attr('height', height);

        const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

        // Scales
        const x0 = d3.scaleBand().domain(labels).range([0, W]).padding(0.28);
        const x1 = d3.scaleBand()
            .domain(datasets.map(d => d.label))
            .range([0, x0.bandwidth()])
            .padding(0.1);

        const allValues = datasets.flatMap(ds => labels.map(l => Number(ds.values[l] || 0)));
        const maxVal    = d3.max(allValues) || 1;

        const y = d3.scaleLinear().domain([0, maxVal * 1.18]).range([H, 0]).nice();

        // Grid
        g.append('g')
            .call(d3.axisLeft(y).tickSize(-W).tickFormat('').ticks(4))
            .call(s => s.select('.domain').remove())
            .call(s => s.selectAll('.tick line')
                .attr('stroke', 'currentColor').attr('stroke-opacity', 0.07).attr('stroke-dasharray', '4,3'));

        // Groups per label
        const groups = g.selectAll('.g-group')
            .data(labels)
            .enter()
            .append('g')
            .attr('transform', l => `translate(${x0(l)},0)`);

        // Draw each dataset's bar within each group
        datasets.forEach((ds, di) => {
            groups.append('rect')
                .attr('x',      x1(ds.label))
                .attr('width',  x1.bandwidth())
                .attr('y',      H)
                .attr('height', 0)
                .attr('rx',     5)
                .attr('fill',   ds.color)
                .attr('opacity', 0.82)
                .style('cursor', 'pointer')
                .on('mouseenter', function (event, l) {
                    d3.select(this).transition().duration(120).attr('opacity', 1);
                    const r   = svgRef.current.getBoundingClientRect();
                    const val = ds.values[l] || 0;
                    d3.select(tooltipRef.current)
                        .style('display', 'block')
                        .style('left', `${event.clientX - r.left + 14}px`)
                        .style('top',  `${event.clientY - r.top  - 34}px`)
                        .html(`<span style="color:${ds.color};font-weight:900">${ds.label}</span> · ${l}: <strong>${val}</strong>`);
                })
                .on('mouseleave', function () {
                    d3.select(this).transition().duration(120).attr('opacity', 0.82);
                    d3.select(tooltipRef.current).style('display', 'none');
                })
                .transition().duration(720)
                .delay((_, i) => i * 55 + di * 110)
                .ease(d3.easeCubicOut)
                .attr('y',      l => y(Number(ds.values[l] || 0)))
                .attr('height', l => H - y(Number(ds.values[l] || 0)));
        });

        // X axis
        g.append('g').attr('transform', `translate(0,${H})`)
            .call(d3.axisBottom(x0).tickSize(0))
            .call(s => s.select('.domain').attr('stroke', 'currentColor').attr('stroke-opacity', 0.12))
            .call(s => s.selectAll('.tick text')
                .attr('fill', 'currentColor').attr('opacity', 0.6)
                .attr('font-size', '10px').attr('dy', '1.25em'));

        // Y axis
        g.append('g').call(d3.axisLeft(y).ticks(4).tickSize(0))
            .call(s => s.select('.domain').remove())
            .call(s => s.selectAll('.tick text')
                .attr('fill', 'currentColor').attr('opacity', 0.5).attr('font-size', '10px'));

    }, [data, width, height]);

    if (!data) return null;

    return (
        <div className="space-y-3">
            <div ref={containerRef} className="relative w-full text-base-content">
                <svg ref={svgRef} />
                <div
                    ref={tooltipRef}
                    style={{ display: 'none', position: 'absolute', pointerEvents: 'none' }}
                    className="bg-base-100 border border-base-300 rounded-xl px-3 py-1.5 text-xs shadow-xl z-20 text-base-content whitespace-nowrap"
                />
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 justify-center">
                {data.datasets.map(ds => (
                    <div key={ds.label} className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-sm shrink-0" style={{ background: ds.color }} />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-base-content/60">
                            {ds.label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GroupedBarChart;