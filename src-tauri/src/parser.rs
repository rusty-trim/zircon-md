use serde::{Deserialize, Serialize};

use crate::lexer::{Token, TokenType};

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Document {
    pub children: Vec<AstNode>,
}

#[derive(Serialize, Deserialize, Clone)]
#[serde(tag = "type", rename_all = "camelCase")]
pub enum AstNode {
    Document {
        children: Vec<AstNode>,
    },
    Heading {
        level: u8,
        line: usize,
        column: usize,
        children: Vec<AstNode>,
    },
    BlockQuote {
        level: u8,
        line: usize,
        column: usize,
        children: Vec<AstNode>,
    },
    Paragraph {
        line: usize,
        column: usize,
        children: Vec<AstNode>,
    },
    Text {
        value: String,
    },
    Bold {
        line: usize,
        column: usize,
        children: Vec<AstNode>,
    },
    Italic {
        line: usize,
        column: usize,
        children: Vec<AstNode>,
    },
    Spoiler {
        line: usize,
        column: usize,
        children: Vec<AstNode>,
    },
    InlineCode {
        line: usize,
        column: usize,
        children: Vec<AstNode>,
    },
    #[serde(rename_all = "camelCase")]
    CodeBlock {
        line: usize,
        end_line: usize,
        column: usize,
        code: String,
        lang: Option<String>,
    },
}

pub struct Parser {
    pub tokens: Vec<Token>,
    pub current: usize,
}

impl Parser {
    fn peek(&self) -> &Token {
        &self.tokens[self.current]
    }

    fn advance(&mut self) -> &Token {
        let token = &self.tokens[self.current];
        self.current += 1;
        token
    }

    fn is_at_end(&self) -> bool {
        matches!(self.peek().r#type, TokenType::DocEnd)
    }

    pub fn parse(&mut self) -> Document {
        let mut children = Vec::new();

        while !self.is_at_end() {
            children.push(self.parse_block());
        }

        Document { children }
    }

    fn parse_block(&mut self) -> AstNode {
        if self.is_at_end() {
            let current = self.peek();
            return AstNode::Paragraph {
                line: current.line,
                column: current.column,
                children: Vec::new(),
            };
        }

        match &self.peek().r#type {
            TokenType::Heading { .. } => self.parse_heading(),
            TokenType::NewLine => {
                let current = self.advance();

                AstNode::Paragraph {
                    line: current.line,
                    column: current.column,
                    children: Vec::new(),
                }
            }
            TokenType::CodeBlockDelimiter { .. } => self.parse_code_block(),
            _ => self.parse_paragraph(),
        }
    }

    fn parse_heading(&mut self) -> AstNode {
        let level = match &self.advance().r#type {
            TokenType::Heading { level } => *level,
            _ => unreachable!(),
        };

        let mut children = Vec::new();

        while !matches!(self.peek().r#type, TokenType::NewLine) {
            children.push(self.parse_inline());
        }

        let current = self.advance();

        AstNode::Heading {
            level,
            children,
            line: current.line,
            column: current.column,
        }
    }

    fn parse_paragraph(&mut self) -> AstNode {
        let mut children = Vec::new();

        while !matches!(self.peek().r#type, TokenType::NewLine | TokenType::DocEnd) {
            children.push(self.parse_inline());
        }

        let mut current = self.peek();

        if matches!(self.peek().r#type, TokenType::NewLine) {
            current = self.advance();
        }

        AstNode::Paragraph {
            children,
            line: current.line,
            column: current.column,
        }
    }

    fn parse_inline(&mut self) -> AstNode {
        match self.peek().r#type {
            TokenType::Text => {
                let token = self.advance();
                AstNode::Text {
                    value: token.value.clone(),
                }
            }
            TokenType::BoldDelimiter => self.parse_bold(),
            TokenType::ItalicDelimiter => self.parse_italic(),
            TokenType::SpoilerDelimiter => self.parse_spoiler(),
            TokenType::InlineCodeDelimiter => self.parse_inline_code(),
            _ => unreachable!(),
        }
    }

    fn parse_bold(&mut self) -> AstNode {
        self.advance();
        let mut children = Vec::new();

        let (line, column) = {
            let current = self.peek();
            (current.line, current.column)
        };

        while !matches!(self.peek().r#type, TokenType::BoldDelimiter) {
            children.push(self.parse_inline());
        }

        self.advance();

        AstNode::Bold {
            children,
            line,
            column,
        }
    }

    fn parse_italic(&mut self) -> AstNode {
        self.advance();
        let mut children = Vec::new();

        let (line, column) = {
            let current = self.peek();
            (current.line, current.column)
        };

        while !matches!(self.peek().r#type, TokenType::ItalicDelimiter) {
            children.push(self.parse_inline());
        }

        self.advance();

        AstNode::Italic {
            children,
            line,
            column,
        }
    }

    fn parse_spoiler(&mut self) -> AstNode {
        self.advance();
        let mut children = Vec::new();

        let (line, column) = {
            let current = self.peek();
            (current.line, current.column)
        };

        while !matches!(self.peek().r#type, TokenType::SpoilerDelimiter) {
            children.push(self.parse_inline());
        }

        self.advance();

        AstNode::Spoiler {
            children,
            line,
            column,
        }
    }

    fn parse_inline_code(&mut self) -> AstNode {
        self.advance();
        let mut children = Vec::new();

        let (line, column) = {
            let current = self.peek();
            (current.line, current.column)
        };

        while !matches!(self.peek().r#type, TokenType::InlineCodeDelimiter) {
            children.push(self.parse_inline());
        }

        self.advance();

        AstNode::InlineCode {
            children,
            line,
            column,
        }
    }

    fn parse_code_block(&mut self) -> AstNode {
        // let start_line = self.peek().line;

        let token = &self.advance();

        let (code, lang, start_line, end_line, column) = match &token.r#type {
            TokenType::CodeBlockDelimiter {
                code,
                lang,
                start_line,
                end_line,
            } => (
                code.clone(),
                lang.clone(),
                start_line.clone(),
                end_line.clone(),
                token.column.clone()
            ),
            _ => unreachable!(),
        };

        if matches!(self.peek().r#type, TokenType::NewLine) {
            self.advance();
        }

        AstNode::CodeBlock {
            code,
            lang,
            line: start_line,
            end_line: end_line,
            column: column
        }
    }
}
