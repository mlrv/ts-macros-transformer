import * as ts from 'typescript'

export const createSimpleArrowFunction =
  (context: ts.TransformationContext) =>
  (parametersIdentifiersText: string[], body: ts.ConciseBody): ts.ArrowFunction => {
    const paramDeclaration = createSimpleParameterDeclaration(context)

    return context.factory.createArrowFunction(
      undefined, // modifiers
      undefined, // type parameters
      parametersIdentifiersText.map(paramDeclaration),
      undefined, // type
      context.factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
      body,
    )
  }

export const createSimpleParameterDeclaration =
  (context: ts.TransformationContext) =>
  (parameterIdentifierText: string): ts.ParameterDeclaration =>
    context.factory.createParameterDeclaration(
      undefined, // decorators
      undefined, // modifiders
      undefined, // dotdot token
      context.factory.createIdentifier(parameterIdentifierText),
      undefined, // question token
      undefined, // type
      undefined, // initializer
    )
