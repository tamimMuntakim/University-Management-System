import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

const CHART_COLORS = [
    '#3b82f6', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6', '#6b7280', '#ef4444', '#14b8a6'
];

/**
 * DonutChart
 * @param {Object} data   - Plain object: { label: count, ... }
 * @param {number} maxSize - Max pixel size of the donut (default 220)
 */
const DonutChart = ({ data = {}, maxSize = 220 }) => {
    const svgRef       = useRef(null);
    const containerRef = useRef(null);
    const [size, setSize] = useState(0);

    // Responsive: measure container width
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

        const entries = Object.entries(data).filter(([, v]) => Number(v) > 0);
        if (entries.length === 0) return;

        const r  = size / 2;
        const ir = r * 0.58;

        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();
        svg.attr('width', size).attr('height', size);

        const g = svg.append('g').attr('transform', `translate(${r},${r})`);

        const total = entries.reduce((s, [, v]) => s + Number(v), 0);

        const pie = d3.pie()
            .sort(null)
            .value(d => Number(d[1]))
            .padAngle(0.028);

        const arc      = d3.arc().innerRadius(ir).outerRadius(r - 5).cornerRadius(4);
        const arcHover = d3.arc().innerRadius(ir).outerRadius(r + 1).cornerRadius(4);

        // Arcs
        const paths = g.selectAll('path')
            .data(pie(entries))
            .enter()
            .append('path')
            .attr('fill', (_, i) => CHART_COLORS[i % CHART_COLORS.length])
            .attr('opacity', 0.85)
            .style('cursor', 'pointer')
            .on('mouseenter', function () {
                d3.select(this).transition().duration(140).attr('d', arcHover).attr('opacity', 1);
            })
            .on('mouseleave', function () {
                d3.select(this).transition().duration(140).attr('d', arc).attr('opacity', 0.85);
            });

        // Entrance animation
        paths
            .transition().duration(800).ease(d3.easeCubicOut)
            .attrTween('d', d => {
                const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
                return t => arc(interpolate(t));
            });

        // Center label: total
        g.append('text')
            .attr('text-anchor', 'middle')
            .attr('dy', '-0.12em')
            .attr('font-size', `${Math.max(18, r * 0.38)}px`)
            .attr('font-weight', '900')
            .attr('fill', 'currentColor')
            .text(total);

        g.append('text')
            .attr('text-anchor', 'middle')
            .attr('dy', '1.05em')
            .attr('font-size', `${Math.max(8, r * 0.16)}px`)
            .attr('font-weight', '700')
            .attr('letter-spacing', '0.12em')
            .attr('fill', 'currentColor')
            .attr('opacity', 0.4)
            .text('TOTAL');

    }, [data, size]);

    const entries = Object.entries(data);

    return (
        <div ref={containerRef} className="flex flex-col items-center gap-4 w-full">
            <svg ref={svgRef} className="text-base-content" />
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5">
                {entries.map(([key, val], i) => (
                    <div key={key} className="flex items-center gap-1.5">
                        <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ background: CHART_COLORS[i % CHART_COLORS.length] }}
                        />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-base-content/70">
                            {key}
                        </span>
                        <span className="text-[10px] font-black text-base-content/40">({val})</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DonutChart;