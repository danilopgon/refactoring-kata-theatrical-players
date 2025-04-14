import {
  PerformanceSummary,
  Play
} from './calculate';
import { createStatement, Statement } from './statement';


export function statementPrinter(
  summary: PerformanceSummary,
  plays: Record<string, Play>
) {
  const statement = createStatement(summary, plays);
  return renderStatementAsPlainTextNew(statement);
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


