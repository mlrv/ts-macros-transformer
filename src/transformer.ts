import * as ts from 'typescript'

import { TransformerConfigDecoder } from './utils/decoders'
import { visitNodeAndExtractMacros } from './visitors/extract'
import { replaceMacrosFromContext } from './visitors/replace'
import { isLeft } from 'fp-ts/Either'

const transformerProgram = (program: ts.Program, config: unknown) => {
  const checker = program.getTypeChecker()

  const configOrErr = TransformerConfigDecoder.decode(config)
  if (isLeft(configOrErr)) {
    throw new Error(`Supplied config is incorrect. Got ${configOrErr.left}`)
  } else {
    const { macrosIdentifier, macrosSyntaxFlag } = configOrErr.right

    const transformerFactory: ts.TransformerFactory<ts.SourceFile> = context => {
      return sourceFile => {
        const [updatedSource, macros] = visitNodeAndExtractMacros(
          context,
          macrosIdentifier,
          sourceFile,
        )
        const replaceMacros = replaceMacrosFromContext(context, checker, macros, macrosSyntaxFlag)

        return ts.visitNode(updatedSource, replaceMacros)
      }
    }

    return transformerFactory
  }
}

export default transformerProgram
