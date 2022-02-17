import * as ts from 'typescript'

// TODO: better names
export type TransformerConfig = {
  macrosIdentifier: string
  macrosSyntaxFlag: string
}

export type Macros = Map<string, ts.Expression>
