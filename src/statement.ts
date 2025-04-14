type Play = {
  name: string;
  type: string;
};

type Performance = {
  playID: string;
  audience: number;
};

type PerformanceSummary = {
  customer: string;
  performances: Performance[];
};

export function statement(
  summary: PerformanceSummary,
  plays: Record<string, Play>
) {
  let totalAmount = calculateTotalAmount(summary, plays);

  let result = `Statement for ${summary.customer}\n`;
  for (let perf of summary.performances) {
    const play = plays[perf.playID];
    let thisAmount = calculateAmount(play, perf);

    result += ` ${play.name}: ${formatAsUSD(thisAmount)} (${
      perf.audience
    } seats)\n`;
  }

  result += `Amount owed is ${formatAsUSD(totalAmount)}\n`;
  result += `You earned ${calculateVolumeCredits(summary, plays)} credits\n`;
  return result;
}

function calculateTotalAmount(
  summary: PerformanceSummary,
  plays: Record<string, Play>
) {
  return summary.performances.reduce((totalAmount, perf) => {
    const play = plays[perf.playID];
    return totalAmount + calculateAmount(play, perf);
  }, 0);
}

function calculateAmount(play: Play, performance: Performance) {
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

function calculateVolumeCredits(
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

function formatAsUSD(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount / 100);
}
