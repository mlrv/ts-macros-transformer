import * as ts from 'typescript'

import { Macros } from '../types'

export const visitNodeAndExtractMacros = (
  context: ts.TransformationContext,
  macrosIdentifier: string,
  source: ts.SourceFile,
): [ts.SourceFile, Macros] => [
  ts.visitNode(source, extractMacrosFromContext(macrosIdentifier)(context)),
  macros,
]

const extractMacrosFromContext =
  (macrosIdentifier: string) =>
  (context: ts.TransformationContext) =>
  (node: ts.Node): ts.Node | undefined => {
    const extractMacros = extractMacrosFromContext(macrosIdentifier)(context)

    if (ts.isVariableStatement(node)) {
      const first = node.declarationList.declarations[0]
      const initializer = first?.initializer

      // const <identifier> = <macrosIdentifier>(<expr>)
      if (
        initializer &&
        ts.isCallExpression(initializer) &&
        ts.isIdentifier(initializer.expression) &&
        initializer.expression.escapedText === macrosIdentifier
      ) {
        const name = first.name

        if (!ts.isIdentifier(name)) {
          throw new Error('Expected name to be Identifier for macro declaration')
        }

        const escapedName = name.escapedText.toString()
        const value = initializer.arguments[0]

        if (!value) {
          throw new Error(`Macro with identifir ${escapedName} was initialised with no argument`)
        }

        macros.set(name.escapedText.toString(), value)

        // macro nodes are extracted and removed from the AST
        return ts.visitEachChild(undefined, extractMacros, context)
      }

      // all other variable statements are left untouched
      return ts.visitEachChild(node, extractMacros, context)
    }

    // nodes that are not variable statemens are left untouched
    return ts.visitEachChild(node, extractMacros, context)
  }

const macros: Macros = new Map()
