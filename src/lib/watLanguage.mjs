export const watLanguage = {
  name: "wat",
  scopeName: "source.wat",
  patterns: [
    {
      name: "comment.line.double-semicolon.wat",
      match: ";;.*$",
    },
    {
      name: "comment.block.wat",
      begin: "\\(;",
      end: ";\\)",
    },
    {
      name: "string.quoted.double.wat",
      begin: '"',
      end: '"',
      patterns: [
        {
          name: "constant.character.escape.wat",
          match: "\\\\(?:[0-9A-Fa-f]{2}|[btnrf\\\"'\\\\])",
        },
      ],
    },
    {
      name: "variable.other.wat",
      match: "\\$[A-Za-z_][A-Za-z0-9_.$-]*|\\$[0-9]+",
    },
    {
      name: "constant.numeric.wat",
      match:
        "\\b(?:0x[0-9A-Fa-f](?:_?[0-9A-Fa-f])*|[0-9](?:_?[0-9])*)(?:\\.[0-9A-Fa-f](?:_?[0-9A-Fa-f])*)?(?:[eEpP][-+]?[0-9](?:_?[0-9])*)?\\b",
    },
    {
      name: "constant.language.wat",
      match: "\\b(?:nan(?::0x[0-9A-Fa-f_]+)?|inf)\\b",
    },
    {
      name: "keyword.control.wat",
      match:
        "\\b(?:block|loop|if|then|else|end|br|br_if|br_table|return|call|call_indirect|try|catch|catch_all|throw|rethrow|delegate|unreachable|nop)\\b",
    },
    {
      name: "keyword.declaration.wat",
      match:
        "\\b(?:module|func|type|param|result|local|global|memory|table|elem|data|import|export|start|mut|offset|item|declare|tag)\\b",
    },
    {
      name: "support.function.instruction.wat",
      match: "\\b[A-Za-z][A-Za-z0-9_]*\\.[A-Za-z0-9_./]+\\b",
    },
    {
      name: "storage.type.wat",
      match:
        "\\b(?:i32|i64|f32|f64|v128|funcref|externref|anyref|eqref|i31ref|structref|arrayref|exnref)\\b",
    },
    {
      name: "punctuation.section.parens.wat",
      match: "[()]",
    },
  ],
};
