import * as D from 'io-ts/Decoder'

export const TransformerConfigDecoder = D.struct({
  macrosIdentifier: D.string,
  macrosSyntaxFlag: D.string,
})
