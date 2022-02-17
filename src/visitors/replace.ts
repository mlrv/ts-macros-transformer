import * as ts from 'typescript'
import { createSimpleArrowFunction } from '../utils/factory'

import { Macros } from '../utils/types'

export const replaceMacrosFromContext =
  (
    context: ts.TransformationContext,
    checker: ts.TypeChecker,
    macros: Macros,
    macrosSyntaxFlag: string,
  ) =>
  (node: ts.Node): ts.Node => {
    const replaceMacros = replaceMacrosFromContext(context, checker, macros, macrosSyntaxFlag)

    // <expression>.<expression>(f)
    // e.g. some(1).map(f)
    // TODO: is there a need to check the exact name of the access expression?
    if (ts.isCallExpression(node) && ts.isPropertyAccessExpression(node.expression)) {
      const f = node.arguments?.[0]

      const symbol = checker.getSymbolAtLocation(node.expression)
      const tags = symbol?.getJsDocTags()
      const macroSyntaxFlag = tags?.find(t => t.name === macrosSyntaxFlag)
      const macroLink = macroSyntaxFlag?.text?.find(t => t.kind === 'linkText')?.text?.trim()

      let replacedNode: ts.Node = node

      if (!!macroLink && !!f) {
        const macro = macros.get(macroLink)
        const fileName = node.getSourceFile().fileName

        if (!macro) {
          throw new Error(
            `No macro was defined for ${macroLink}. Registered macros are ${[...macros.keys()].join(
              ', ',
            )}`,
          )
        }

        replacedNode = context.factory.createCallExpression(macro, undefined, [
          node.expression.expression,
          f,
        ])

        // TODO: make logger configurable
        console.log(
          `Replaced ${node.expression.name.escapedText} call with macro ${macroLink} in file ${fileName}`,
        )
      }

      return ts.visitEachChild(replacedNode, replaceMacros, context)
    }

    // <expression>.<expression>
    // e.g. some(1).map
    // TODO: is there a need to check the exact name of the access expression?
    if (ts.isPropertyAccessExpression(node) && !ts.isCallExpression(node.parent)) {
      // TODO: extract common logic
      const symbol = checker.getSymbolAtLocation(node)
      const tags = symbol?.getJsDocTags()
      const macroSyntaxFlag = tags?.find(t => t.name === macrosSyntaxFlag)
      const macroLink = macroSyntaxFlag?.text?.find(t => t.kind === 'linkText')?.text?.trim()

      let replacedNode: ts.Node = node

      if (!!macroLink) {
        const macro = macros.get(macroLink)
        const fileName = node.getSourceFile().fileName

        if (!macro) {
          throw new Error(
            `No macro was defined for ${macroLink}. Registered macros are ${[...macros.keys()].join(
              ', ',
            )}`,
          )
        }

        replacedNode = createSimpleArrowFunction(context)(
          ['f'],
          context.factory.createCallExpression(macro, undefined, [
            node.expression,
            context.factory.createIdentifier('f'),
          ]),
        )

        // TODO: make logger configurable
        console.log(
          `Replaced ${node.name.escapedText} call with macro ${macroLink} in file ${fileName}`,
        )
      }

      return ts.visitEachChild(replacedNode, replaceMacros, context)
    }

    return ts.visitEachChild(node, replaceMacros, context)
  }
