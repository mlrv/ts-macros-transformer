import 'fp-ts/Option'

import { Lazy } from 'fp-ts/function'

// import { map, Option } from "fp-ts/Option";

// declare function MACRO<T>(t: T): T;
// // @ts-ignore
// const mapOption = MACRO(<T, U>(t: Option<T>, f: (t: T) => U) => {
//   return map(f)(t);
// });

declare module 'fp-ts/Option' {
  interface None {
    /**
     * Some explanation of map
     *
     * @fp_ts_syntax {@link mapOption}
     */
    map: <B>(f: (a: never) => B) => None // Option<B> ?

    /**
     * Some explanation of getOrElse
     *
     * @fp_ts_syntax {@link getOrElseOption}
     */
    getOrElse: <A>(onNone: Lazy<A>) => A
  }

  interface Some<A> {
    /**
     * Some explanation of map
     *
     * @fp_ts_syntax {@link mapOption}
     */
    map: <B>(f: (a: A) => B) => Some<B> // Option<B> ?

    /**
     * Some explanation of getOrElse
     *
     * @fp_ts_syntax {@link getOrElseOption}
     */
    getOrElse: (onNone: Lazy<A>) => A
  }
}
