import { getUsageStats } from '../api';
import { OverviewChart } from './overview-chart'
import { use } from 'react';

export function OverviewChartContainer() {
    const usageStats = use(getUsageStats());
    return (
        <OverviewChart data={usageStats} />
    )
}
