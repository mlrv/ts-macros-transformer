import { some, none, map, getOrElse, Option } from 'fp-ts/Option'

declare function MACRO<T>(t: T): T

// @ts-ignore
const mapOption = MACRO(<T, U>(t: Option<T>, f: (t: T) => U) => {
  return map(f)(t)
})

// @ts-ignore
const getOrElseOption = MACRO(<T>(t: Option<T>, onNone: () => T) => {
  return getOrElse(onNone)(t)
})

const source = Math.random() > 0.5 ? some(1) : none
const before = source
  .map(x => x.toString().repeat(10))
  .map(x => x + 'foobar')
  .getOrElse(() => 'loool')

const m = some(50).map
const a = m(x => x + 12)

const somethingThatShouldNotBetouched = [1, 2, 3].map(x => x + 1).map(x => x.toString())

console.log(before, somethingThatShouldNotBetouched, a)
