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

  let thisAmount = 0;
  switch (play.type) {
    case PlayType.TRAGEDY:
      thisAmount = 40000;
      if (performance.audience > 30) {
        thisAmount += 1000 * (performance.audience - 30);
      }
      break;
    case PlayType.COMEDY:
      thisAmount = 30000;
      if (performance.audience > 20) {
        thisAmount += 10000 + 500 * (performance.audience - 20);
      }
      thisAmount += 300 * performance.audience;
      break;
  }
  return thisAmount;
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
