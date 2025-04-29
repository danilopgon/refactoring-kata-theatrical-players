enum PlayType {
  TRAGEDY = 'tragedy',
  COMEDY = 'comedy',
}

export type Play = {
  name: string;
  type: string;
};

export type Performance = {
  playID: string;
  audience: number;
};

export type PerformanceSummary = {
  customer: string;
  performances: Performance[];
};

export function calculateTotalAmount(
  summary: PerformanceSummary,
  plays: Record<string, Play>
) {
  return summary.performances.reduce((totalAmount, perf) => {
    const play = plays[perf.playID];
    return totalAmount + calculateAmount(play, perf);
  }, 0);
}
export function calculateAmount(play: Play, performance: Performance) {
  const isUnknownPlayType = !Object.values(PlayType).includes(
    play.type as PlayType
  );

  if (isUnknownPlayType) {
    throw new Error(`unknown type: ${play.type}`);
  }

  if (play.type === PlayType.COMEDY) {
    return calculateComedyAmount(performance);
  }

  if (play.type === PlayType.TRAGEDY) {
    return calculateTragedyAmount(performance);
  }

  return 0;
}

function calculateComedyAmount(performance: Performance) {
  let totalAmountForComedy = 30000;
  if (performance.audience > 20) {
    totalAmountForComedy += 10000 + 500 * (performance.audience - 20);
  }
  totalAmountForComedy += 300 * performance.audience;
  return totalAmountForComedy;
}

function calculateTragedyAmount(performance: Performance) {
  let totalAmountForTragedy = 40000;
  if (performance.audience > 30) {
    totalAmountForTragedy += 1000 * (performance.audience - 30);
  }
  return totalAmountForTragedy;
}

export function calculateVolumeCredits(
  summary: PerformanceSummary,
  plays: Record<string, Play>
) {
  return summary.performances.reduce((totalCredits, perf) => {
    const play = plays[perf.playID];
    return totalCredits + calculateCredits(play, perf);
  }, 0);
}
function calculateCredits(play: Play, perf: Performance) {
  let credits = 0;
  const baseCredits = Math.max(perf.audience - 30, 0);
  credits += baseCredits;
  const extraCreditsForComedyAttendees = Math.floor(perf.audience / 5);

  return play.type === 'comedy'
    ? credits + extraCreditsForComedyAttendees
    : credits;
}
