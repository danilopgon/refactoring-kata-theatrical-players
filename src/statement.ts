import {
  Performance,
  PerformanceSummary,
  Play,
  calculateAmount,
  calculateTotalAmount,
  calculateVolumeCredits,
} from './calculate';

export type Statement = {
  readonly customer: string;
  readonly performances: PerformanceRow[];
  readonly totalAmountInUSD: string;
  readonly totalCredits: number;
};

export function createStatement(
  summary: PerformanceSummary,
  plays: Record<string, Play>
): Statement {
  {
    return {
      customer: summary.customer,
      performances: summary.performances.map((performance) => {
        const play = plays[performance.playID];
        return createPerformanceRow(performance, play);
      }),
      totalAmountInUSD: formatAsUSD(calculateTotalAmount(summary, plays)),
      totalCredits: calculateVolumeCredits(summary, plays),
    };
  }
}

export type PerformanceRow = {
  readonly playName: string;
  readonly audience: number;
  readonly amountInUSD: string;
};

export function createPerformanceRow(
  performance: Performance,
  play: Play
): PerformanceRow {
  return {
    playName: play.name,
    audience: performance.audience,
    amountInUSD: formatAsUSD(calculateAmount(play, performance)),
  };
}

export function formatAsUSD(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount / 100);
}
