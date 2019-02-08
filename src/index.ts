import { Scanner } from './Scanner';

const source = `
var sum = 1 + 2;
var breakfast = "bagels";
print breakfast; // "bagels".
breakfast = "beignets";
print breakfast; // "beignets".
`;
const scanner = new Scanner(source);

try {
    console.log(scanner.scanTokens());
} catch (e) {
    console.error(e);
}
