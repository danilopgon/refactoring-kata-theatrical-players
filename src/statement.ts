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
  let totalAmount = 0;
  let volumeCredits = 0;
  let result = `Statement for ${summary.customer}\n`;
  const format = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format;

  for (let perf of summary.performances) {
    const play = plays[perf.playID];
    let thisAmount = calculateAmount(play, perf);
    volumeCredits += calculateCredits(play, perf);

    result += ` ${play.name}: ${format(thisAmount / 100)} (${
      perf.audience
    } seats)\n`;
    totalAmount += thisAmount;
  }
  result += `Amount owed is ${format(totalAmount / 100)}\n`;
  result += `You earned ${volumeCredits} credits\n`;
  return result;
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
