import { TokenType, Token, Tokens } from './Token';

let hadError = false;

function error(line: number, message: string) {
    report(line, '', message);
}

function report(line: number, where: string, message: string) {
    hadError = true;

    console.log('[line ' + line + '] Error' + where + ': ' + message);
}

const keywords = {
    and: TokenType.AND,
    class: TokenType.CLASS,
    else: TokenType.ELSE,
    false: TokenType.FALSE,
    for: TokenType.FOR,
    fun: TokenType.FUN,
    if: TokenType.IF,
    nil: TokenType.NIL,
    or: TokenType.OR,
    print: TokenType.PRINT,
    return: TokenType.RETURN,
    super: TokenType.SUPER,
    this: TokenType.THIS,
    true: TokenType.TRUE,
    var: TokenType.VAR,
    while: TokenType.WHILE
};

export class Scanner {
    source: string;
    tokens: Tokens = [];
    start = 0;
    current = 0;
    line = 1;

    constructor(source: string) {
        this.source = source;
    }

    scanTokens(): Tokens {
        while (!this.isAtEnd()) {
            // We are at the beginning of the next lexeme.
            this.start = this.current;
            this.scanToken();
        }

        this.tokens.push(new Token(TokenType.EOF, '', null, this.line));

        console.log({ hadError });

        return this.tokens;
    }

    scanToken() {
        const char = this.advance();
        switch (char) {
            case '(':
                this.addToken(TokenType.LEFT_PAREN);
                break;
            case ')':
                this.addToken(TokenType.RIGHT_PAREN);
                break;
            case '{':
                this.addToken(TokenType.LEFT_BRACE);
                break;
            case '}':
                this.addToken(TokenType.RIGHT_BRACE);
                break;
            case ',':
                this.addToken(TokenType.COMMA);
                break;
            case '.':
                this.addToken(TokenType.DOT);
                break;
            case '-':
                this.addToken(TokenType.MINUS);
                break;
            case '+':
                this.addToken(TokenType.PLUS);
                break;
            case ';':
                this.addToken(TokenType.SEMICOLON);
                break;
            case '*':
                this.addToken(TokenType.STAR);
                break;
            case '!':
                this.addToken(
                    this.match('=') ? TokenType.BANG_EQUAL : TokenType.BANG
                );
                break;
            case '=':
                this.addToken(
                    this.match('=') ? TokenType.EQUAL_EQUAL : TokenType.EQUAL
                );
                break;
            case '<':
                this.addToken(
                    this.match('=') ? TokenType.LESS_EQUAL : TokenType.LESS
                );
                break;
            case '>':
                this.addToken(
                    this.match('=')
                        ? TokenType.GREATER_EQUAL
                        : TokenType.GREATER
                );
                break;
            case '/':
                if (this.match('/')) {
                    // A comment goes until the end of the line.
                    while (this.peek() !== '\n' && !this.isAtEnd()) {
                        this.advance();
                    }
                } else {
                    this.addToken(TokenType.SLASH);
                }
                break;
            case ' ':
            case '\r':
            case '\t':
                // Ignore whitespace.
                break;
            case '\n':
                this.line++;
                break;
            case '"':
                this.string();
                break;
            default:
                if (this.isDigit(char)) {
                    this.number();
                } else if (this.isAlpha(char)) {
                    this.identifier();
                } else {
                    error(this.line, 'Unexpected character.');
                }
                break;
        }
    }

    string() {
        while (this.peek() !== '"' && !this.isAtEnd()) {
            if (this.peek() === '\n') {
                this.line++;
            }
            this.advance();
        }

        // Unterminated string.
        if (this.isAtEnd()) {
            error(this.line, 'Unterminated string.');
            return;
        }

        // The closing ".
        this.advance();

        // Trim the surrounding quotes.
        const value = this.source.substring(this.start + 1, this.current - 1);
        this.addToken(TokenType.STRING, value);
    }

    number() {
        while (this.isDigit(this.peek())) {
            //
        }

        // Look for a fractional part.
        if (this.peek() === '.' && this.isDigit(this.peekNext())) {
            // Consume the "."
            this.advance();

            while (this.isDigit(this.peek())) {
                //
            }
        }

        this.addToken(
            TokenType.NUMBER,
            Number(this.source.substring(this.start, this.current))
        );
    }

    identifier() {
        while (this.isAlphaNumeric(this.peek())) {
            this.advance();
        }

        const text = this.source.substring(this.start, this.current);

        this.addToken(keywords[text] || TokenType.IDENTIFIER);
    }

    isAlpha(char: string) {
        return /^[A-Z_]$/i.test(char);
    }

    isAlphaNumeric(char: string) {
        return this.isAlpha(char) || this.isDigit(char);
    }

    match(expected: string) {
        if (this.isAtEnd()) {
            return false;
        }

        if (this.source.charAt(this.current) !== expected) {
            return false;
        }

        this.current++;
        return true;
    }

    peek() {
        if (this.isAtEnd()) {
            return '\0';
        }
        return this.source.charAt(this.current);
    }

    peekNext() {
        if (this.current + 1 >= this.source.length) {
            return '\0';
        }
        return this.source.charAt(this.current + 1);
    }

    advance() {
        this.current++;
        return this.source.charAt(this.current - 1);
    }

    addToken(type: TokenType, literal = null) {
        const text = this.source.substring(this.start, this.current);

        this.tokens.push(new Token(type, text, literal, this.line));
    }

    isDigit(char: string) {
        const number = parseFloat(char);
        return !isNaN(number) && isFinite(number);
    }

    isAtEnd(): boolean {
        return this.current >= this.source.length;
    }
}
