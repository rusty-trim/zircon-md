// pub enum AstNode {
//     Document { children: Vec<AstNode> },
//     Heading { level: u8, children: Vec<AstNode> },
//     Paragraph { children: Vec<AstNode> },
//     Text(String),
//     Bold { children: Vec<AstNode> },
//     Italic { children: Vec<AstNode> },
// }

export type AstNode =
    | Heading
    | Paragraph
    | Text
    | Bold
    | Italic
    | Spoiler
    | InlineCode

export interface Document {
    children: AstNode[];
}

export interface Heading {
    type: "heading"
    level: number;
    children: AstNode[];
};

export interface Paragraph {
    type: "paragraph";
    children: AstNode[];
};

export interface Text {
    type: "text";
    value: string;
}

export interface Bold {
    type: "bold";
    children: AstNode[];
};

export interface Italic {
    type: "italic";
    children: AstNode[];
};

export interface Spoiler {
    type: "spoiler";
    children: AstNode[];
};

export interface InlineCode {
    type: "inlineCode";
    children: AstNode[];
};