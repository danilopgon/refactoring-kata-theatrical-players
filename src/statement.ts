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

type Statement = {
  readonly customer: string;
  readonly performances: PerformanceRow[];
  readonly totalAmountInUSD: string;
  readonly totalCredits: number;
};

function createStatement(
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

type PerformanceRow = {
  readonly playName: string;
  readonly audience: number;
  readonly amountInUSD: string;
};

function createPerformanceRow(
  performance: Performance,
  play: Play
): PerformanceRow {
  return {
    playName: play.name,
    audience: performance.audience,
    amountInUSD: formatAsUSD(calculateAmount(play, performance)),
  };
}

export function statement(
  summary: PerformanceSummary,
  plays: Record<string, Play>
) {
  return renderStatementAsPlainTextNew(createStatement(summary, plays));
}

function renderStatementAsPlainTextNew(statement: Statement) {
  let result = `Statement for ${statement.customer}\n`;
  for (let performance of statement.performances) {
    result += ` ${performance.playName}: ${performance.amountInUSD} (${performance.audience} seats)\n`;
  }

  result += `Amount owed is ${statement.totalAmountInUSD}\n`;
  result += `You earned ${statement.totalCredits} credits\n`;
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
