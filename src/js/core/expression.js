export class ExpressionProcessor {
    constructor() { }

    findExpressions(targets) {
        const first = targets[0];
        const second = targets[1];
        const third = targets[2];

        // Check if pattern is correct and targets are close enough
        if (
            first.type === 'number' &&
            second.type === 'operator' &&
            third.type === 'number'
        ) {

            return {
                operand1: first,
                operator: second,
                operand2: third,
                display: `${first.symbol} ${second.symbol} ${third.symbol}`,
                positions: [first.position, second.position, third.position]
            };
        }
    }

    calculateResult(expression) {
        const a = expression.operand1.value;
        const b = expression.operand2.value;
        const op = expression.operator.value;

        let result;
        switch (op) {
            case '+': result = a + b; break;
            case '-': result = a - b; break;
            case '*': result = a * b; break;
            case '/': result = b !== 0 ? Math.floor(a / b) : null; break;
            default: return null;
        }

        console.log(`Calculating: ${a} ${op} ${b} = ${result}`);
        return result;
    }
}