import * as _Either from 'fp-ts/Either'
import * as _Fn from 'fp-ts/function'
import type * as _IO from 'fp-ts/IO'
import * as _IOEither from 'fp-ts/IOEither'
import * as _Maybe from 'fp-ts/Option'
import { pipe as _pipe } from 'fp-ts/pipeable'
import * as _List from 'fp-ts/ReadonlyArray'
import * as _NonEmptyArray from 'fp-ts/ReadonlyNonEmptyArray'
import * as _Record from 'fp-ts/Record'
import * as _Task from 'fp-ts/Task'
import * as _TaskEither from 'fp-ts/TaskEither'

export const unknownToError = (e: unknown): Error =>
  e instanceof Error ? e : new Error('unknown error')

export const inspect = (...label: readonly unknown[]) => <A>(a: A): A => {
  console.log(...label, a)
  return a
}

/**
 * ???
 */
export const todo = (..._: readonly unknown[]): never => {
  // eslint-disable-next-line functional/no-throw-statement
  throw Error('missing implementation')
}

/**
 * Array
 */
export const List = {
  ..._List,

  concat: <A>(a: readonly A[], b: readonly A[]): readonly A[] => [...a, ...b],

  exists: <A>(predicate: _Fn.Predicate<A>) => (l: readonly A[]): boolean =>
    _pipe(l, List.findIndex(predicate), _Maybe.isSome),
}

/**
 * NonEmptyArray
 */
export type NonEmptyArray<A> = _NonEmptyArray.ReadonlyNonEmptyArray<A>
export const NonEmptyArray = _NonEmptyArray

/**
 * Record
 */
export type Dict<A> = Record<string, A>
export const Dict = {
  ..._Record,

  insertOrUpdateAt: <A>(k: string, a: _Fn.Lazy<A>, update: (a: A) => A) => (
    dict: Dict<A>,
  ): Dict<A> =>
    _pipe(
      _Record.lookup(k, dict),
      _Maybe.fold(
        () => _pipe(dict, _Record.insertAt(k, a())),
        a => _pipe(dict, _Record.insertAt(k, update(a))),
      ),
    ),
}

/**
 * Option
 */
export type Maybe<A> = _Maybe.Option<A>
export const Maybe = {
  ..._Maybe,

  toArray: <A>(opt: Maybe<A>): readonly A[] =>
    _pipe(
      opt,
      _Maybe.fold(
        () => [],
        a => [a],
      ),
    ),
}

/**
 * Either
 */
export type Either<E, A> = _Either.Either<E, A>
export const Either = _Either

/**
 * Try
 */
export type Try<A> = Either<Error, A>
export const Try = {
  ...Either,

  right: <A>(a: A): Try<A> => Either.right(a),

  left: <A = never>(e: Error): Try<A> => Either.left(e),

  apply: <A>(a: _Fn.Lazy<A>): Try<A> => Either.tryCatch(a, unknownToError),

  get: <A>(t: Try<A>): A =>
    _pipe(
      t,
      Either.getOrElse<Error, A>(e => {
        // eslint-disable-next-line functional/no-throw-statement
        throw e
      }),
    ),
}

/**
 * Task
 */
export type Task<A> = _Task.Task<A>
export const Task = {
  ..._Task,

  run: <A>(task: Task<A>): Promise<A> => task(),
}

/**
 * Future
 */
export type Future<A> = _Task.Task<Try<A>>
export const Future = {
  ..._TaskEither,

  right: <A>(a: A): Future<A> => _TaskEither.right(a),

  left: <A = never>(e: Error): Future<A> => _TaskEither.left(e),

  apply: <A>(f: _Fn.Lazy<Promise<A>>): Future<A> => Future.tryCatch(f, unknownToError),

  unit: _TaskEither.right<Error, void>(undefined),

  parallel: <A>(futures: readonly Future<A>[]): Future<readonly A[]> =>
    List.readonlyArray.sequence(Future.taskEither)(futures),

  sequence: <A>(futures: readonly Future<A>[]): Future<readonly A[]> =>
    List.readonlyArray.sequence(Future.taskEitherSeq)(futures),

  recover: <A>(onError: (e: Error) => Future<A>): ((future: Future<A>) => Future<A>) =>
    _Task.chain(
      _Either.fold(
        e => onError(e),
        a => _TaskEither.right(a),
      ),
    ),

  runUnsafe: <A>(future: Future<A>): Promise<A> => _pipe(future, _Task.map(Try.get))(),
}

/**
 * IO
 */
export type IO<A> = _IO.IO<Try<A>>
export const IO = {
  ..._IOEither,

  apply: <A>(a: _Fn.Lazy<A>): IO<A> => IO.tryCatch(a, unknownToError),

  unit: _IOEither.right(undefined),

  runFuture: <A>(f: Future<A>): IO<Promise<A>> => IO.apply(() => Future.runUnsafe(f)),

  runUnsafe: <A>(io: IO<A>): A => Try.get(io()),
}

export const pipe = _pipe

/**
 * Fun
 */
export const Fn = _Fn
