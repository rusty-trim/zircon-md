use serde::{Deserialize, Serialize};
use std::ops::Add;

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub enum TokenType {
    Heading {
        level: u8,
    },
    BoldDelimiter,
    ItalicDelimiter,
    SpoilerDelimiter,
    InlineCodeDelimiter,
    CodeBlockDelimiter {
        code: String,
        lang: Option<String>,
        start_line: usize,
        end_line: usize,
    },
    Text,
    NewLine,
    DocEnd,
}

pub struct Token {
    pub r#type: TokenType,
    pub value: String,
    pub line: usize,
    pub column: usize,
}

pub struct Lexer {}

impl Lexer {
    fn consume_text<I>(
        &self,
        chars: &mut std::iter::Peekable<I>,
        text: &mut String,
        column: &mut usize,
    ) where
        I: Iterator<Item = char>,
    {
        while let Some(&char) = chars.peek() {
            match char {
                '*' | '|' | '`' => break,
                _ => {
                    chars.next();
                    *column += 1;
                    text.push(char);
                }
            }
        }
    }

    pub fn tokenize(&self, input: &str) -> Vec<Token> {
        let mut tokens: Vec<Token> = vec![];

        let mut line_count: usize = 0;
        let mut lines = input.lines().peekable();

        while let Some(line) = lines.next() {
            // for line in lines {
            line_count += 1;
            let mut chars = line.chars().peekable();
            let mut column_count = 0;
            while let Some(char) = chars.next() {
                column_count += 1;
                match char {
                    '#' => {
                        let start_column = column_count;
                        let mut level = 1;

                        let mut hashes = String::from("#");

                        while let Some(&'#') = chars.peek() {
                            chars.next();
                            hashes.push('#');
                            level += 1;
                            column_count += 1;
                        }

                        if level <= 6 && chars.peek() == Some(&' ') {
                            chars.next();
                            column_count += 1;

                            tokens.push(Token {
                                r#type: TokenType::Heading { level: level },
                                value: String::new(),
                                line: line_count,
                                column: start_column,
                            });
                        } else {
                            let mut text = String::new();
                            let mut start_column = column_count;

                            text.push(char);

                            self.consume_text(&mut chars, &mut text, &mut start_column);

                            tokens.push(Token {
                                r#type: TokenType::Text,
                                value: hashes.add(text.as_str()),
                                line: line_count,
                                column: start_column,
                            });
                        }
                    }
                    '|' => {
                        let start_column = column_count;
                        if let Some(&'|') = chars.peek() {
                            chars.next();
                            column_count += 1;

                            tokens.push(Token {
                                r#type: TokenType::SpoilerDelimiter,
                                value: String::new(),
                                line: line_count,
                                column: start_column,
                            });
                        } else {
                            tokens.push(Token {
                                r#type: TokenType::Text,
                                value: "|".to_string(),
                                line: line_count,
                                column: start_column,
                            });
                        }
                    }
                    '*' => {
                        let start_column = column_count;
                        if let Some(&'*') = chars.peek() {
                            // Bold
                            chars.next();
                            column_count += 1;

                            tokens.push(Token {
                                r#type: TokenType::BoldDelimiter,
                                value: String::new(),
                                line: line_count,
                                column: start_column,
                            });
                        } else {
                            // Italics
                            tokens.push(Token {
                                r#type: TokenType::ItalicDelimiter,
                                value: String::new(),
                                line: line_count,
                                column: start_column,
                            });
                        }
                    }
                    '`' => {
                        let start_column = column_count;
                        let mut count = 1;

                        while let Some(&'`') = chars.peek() {
                            chars.next();
                            column_count += 1;
                            count += 1;
                        }

                        match count {
                            1 => {
                                tokens.push(Token {
                                    r#type: TokenType::InlineCodeDelimiter,
                                    value: String::new(),
                                    line: line_count,
                                    column: start_column,
                                });
                            }
                            3 => {
                                // Handle code block
                                let info_string = line.trim_start()[3..].trim();

                                let lang = if info_string.is_empty() {
                                    None
                                } else {
                                    Some(info_string.to_string())
                                };

                                let fence_line = line_count;
                                let mut code_lines = Vec::new();

                                while let Some(next_line) = lines.next() {
                                    line_count += 1;

                                    if next_line.trim() == "```" {
                                        break;
                                    }

                                    code_lines.push(next_line);
                                }

                                tokens.push(Token {
                                    r#type: TokenType::CodeBlockDelimiter {
                                        code: code_lines.join("\n"),
                                        lang,
                                        start_line: fence_line,
                                        end_line: line_count,
                                    },
                                    value: String::new(),
                                    line: fence_line,
                                    column: start_column,
                                });

                                break;

                                // TODO: Handle code lines
                            }
                            _ => {
                                let mut text = String::new();
                                let mut start_column = column_count;

                                text.push(char);

                                self.consume_text(&mut chars, &mut text, &mut start_column);

                                tokens.push(Token {
                                    r#type: TokenType::Text,
                                    value: text,
                                    line: line_count,
                                    column: start_column,
                                });
                            }
                        }
                    }
                    _ => {
                        let mut text = String::new();
                        let mut start_column = column_count;

                        text.push(char);

                        self.consume_text(&mut chars, &mut text, &mut start_column);

                        tokens.push(Token {
                            r#type: TokenType::Text,
                            value: text,
                            line: line_count,
                            column: start_column,
                        });
                    }
                }
            }

            tokens.push(Token {
                r#type: TokenType::NewLine,
                value: String::new(),
                line: line_count,
                column: column_count,
            });
            // }
        }

        tokens.push(Token {
            r#type: TokenType::DocEnd,
            value: String::new(),
            line: line_count,
            column: 0,
        });

        tokens
    }
}
