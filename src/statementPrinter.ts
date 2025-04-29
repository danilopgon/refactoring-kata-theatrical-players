import { PerformanceSummary, Play } from './calculate';
import { createStatement, Statement } from './statement';

export function statementPrinter(
  summary: PerformanceSummary,
  plays: Record<string, Play>,
  format: 'text' | 'html'
) {
  const statement = createStatement(summary, plays);

  if (format === 'text') {
    return renderStatementAsPlainTextNew(statement);
  }

  if (format === 'html') {
    return renderStatementAsHtml(statement);
  }

  return `unknown format: ${format}`;
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

function renderStatementAsHtml(statement: Statement) {
  let result = `<h1>Statement for ${statement.customer}</h1>`;
  result += `<ul>`;
  for (let performance of statement.performances) {
    result += ` <li>${performance.playName}: ${performance.amountInUSD} (${performance.audience} seats)</li>`;
  }
  result += `</ul>`;
  result += `<p>Amount owed is <em>${statement.totalAmountInUSD}</em></p>`;
  result += `<p>You earned <em>${statement.totalCredits}</em> credits</p>`;
  return result;
}
