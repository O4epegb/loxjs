export enum TokenType {
    // Single-character tokens
    LEFT_PAREN = 1,
    RIGHT_PAREN,
    LEFT_BRACE,
    RIGHT_BRACE,
    COMMA,
    DOT,
    MINUS,
    PLUS,
    SEMICOLON,
    SLASH,
    STAR,
    // One or two character tokens
    BANG,
    BANG_EQUAL,
    EQUAL,
    EQUAL_EQUAL,
    GREATER,
    GREATER_EQUAL,
    LESS,
    LESS_EQUAL,
    // Literals
    IDENTIFIER,
    STRING,
    NUMBER,
    // Keywords
    AND,
    CLASS,
    ELSE,
    FALSE,
    FUN,
    FOR,
    IF,
    NIL,
    OR,
    PRINT,
    RETURN,
    SUPER,
    THIS,
    TRUE,
    VAR,
    WHILE,
    // Other
    EOF
}

export type Tokens = Array<Token>;
export class Token {
    type: TokenType;
    typeName: string;
    lexeme: string;
    literal;
    line: number;

    constructor(type: TokenType, lexeme: string, literal, line: number) {
        this.type = type;
        this.typeName = TokenType[type];
        this.lexeme = lexeme;
        this.literal = literal;
        this.line = line;
    }

    toString(): string {
        return `${this.type} ${this.lexeme} ${this.literal}`;
    }
}
