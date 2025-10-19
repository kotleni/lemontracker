'use client';

import {useMemo} from 'react';
import {Bar, BarChart, CartesianGrid, XAxis, YAxis} from 'recharts';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from '@/components/ui/chart';

// Define a type for the player data, matching the Prisma model structure
type Player = {
    id: number;
    name: string;
    lastLatency: number;
};

interface LatencyChartProps {
    players: Player[];
}

export function LatencyChart({players}: LatencyChartProps) {
    const chartData = useMemo(() => {
        return players
            .filter(p => p.lastLatency > 0)
            .sort((a, b) => b.lastLatency - a.lastLatency)
            .slice(0, 32)
            .map(player => ({
                name: player.name,
                latency: player.lastLatency,
            }));
    }, [players]);

    const chartConfig = {
        latency: {
            label: 'Latency (ms)',
            color: 'hsl(var(--chart-1))',
        },
    } satisfies ChartConfig;

    if (chartData.length === 0) {
        return null;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Player Latency</CardTitle>
                <CardDescription>
                    Showing top {chartData.length} players by latency
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div style={{height: '200px'}}>
                    <ChartContainer
                        config={chartConfig}
                        className="w-full h-full"
                    >
                        <BarChart
                            accessibilityLayer
                            data={chartData}
                            margin={{
                                top: 20,
                                right: 20,
                                left: 0,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="name"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                                tick={{
                                    fontSize: 12,
                                    fill: 'hsl(var(--muted-foreground))',
                                }}
                            />
                            <YAxis
                                tickFormatter={value => `${value} ms`}
                                tick={{fill: 'hsl(var(--primary-foreground))'}}
                            />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent />}
                            />
                            <Bar
                                dataKey="latency"
                                fill="var(--color-primary)"
                                radius={4}
                            />
                        </BarChart>
                    </ChartContainer>
                </div>
            </CardContent>
        </Card>
    );
}
