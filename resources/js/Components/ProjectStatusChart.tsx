import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ProjectTimelineChartProps {
    projects: Array<{
        name: string;
        days_remaining: number;
    }>;
}

export default function ProjectTimelineChart({ projects }: ProjectTimelineChartProps) {
    // Sort projects by days remaining
    const sortedProjects = [...projects].sort((a, b) => b.days_remaining - a.days_remaining);

    const data = {
        labels: sortedProjects.map(project => project.name),
        datasets: [
            {
                label: 'Days Remaining',
                data: sortedProjects.map(project => project.days_remaining),
                backgroundColor: sortedProjects.map(project =>
                    project.days_remaining < 0 ? 'rgba(239, 68, 68, 0.7)' :
                        project.days_remaining < 7 ? 'rgba(234, 179, 8, 0.7)' :
                            'rgba(16, 185, 129, 0.7)'),
                borderColor: sortedProjects.map(project =>
                    project.days_remaining < 0 ? 'rgba(239, 68, 68, 1)' :
                        project.days_remaining < 7 ? 'rgba(234, 179, 8, 1)' :
                            'rgba(16, 185, 129, 1)'),
                borderWidth: 1,
            },
        ],
    };

    const options = {
        indexAxis: 'y' as const,
        elements: {
            bar: {
                borderWidth: 2,
            },
        },
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: 'Project Timeline',
            },
            tooltip: {
                callbacks: {
                    label: function (context: any) {
                        const value = context.raw;
                        return `Days ${value >= 0 ? 'remaining' : 'overdue'}: ${Math.abs(value)}`;
                    }
                }
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Days',
                },
            },
        },
        maintainAspectRatio: false,
    };

    return (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 h-80">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Project Timeline</h3>
            <div className="h-64">
                <Bar data={data} options={options} />
            </div>
        </div>
    );
}