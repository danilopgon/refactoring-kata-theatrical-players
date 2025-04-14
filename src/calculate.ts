

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
  plays: Record<string, Play>) {
  return summary.performances.reduce((totalAmount, perf) => {
    const play = plays[perf.playID];
    return totalAmount + calculateAmount(play, perf);
  }, 0);
}
export function calculateAmount(play: Play, performance: Performance) {
  let thisAmount = 0;
  switch (play.type) {
    case 'tragedy':
      thisAmount = 40000;
      if (performance.audience > 30) {
        thisAmount += 1000 * (performance.audience - 30);
      }
      break;
    case 'comedy':
      thisAmount = 30000;
      if (performance.audience > 20) {
        thisAmount += 10000 + 500 * (performance.audience - 20);
      }
      thisAmount += 300 * performance.audience;
      break;
    default:
      throw new Error(`unknown type: ${play.type}`);
  }
  return thisAmount;
}
export function calculateVolumeCredits(
  summary: PerformanceSummary,
  plays: Record<string, Play>) {
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
