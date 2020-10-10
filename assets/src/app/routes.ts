import { Formatter, Match, Parser, Route, end, format, lit, parse, zero } from 'fp-ts-routing'
import type * as C from 'io-ts/Codec'

import { Dict, Fn, Maybe, pipe } from '../shared/fp'
import { RaceId } from './models/RaceId'

interface Home {
  _tag: 'Home'
}
const home: Home = { _tag: 'Home' }

interface Create {
  _tag: 'Create'
}
const create: Create = { _tag: 'Create' }

interface Race {
  _tag: 'Race'
  raceId: RaceId
}
const race = (args: Omit<Race, '_tag'>): Race => ({ _tag: 'Race', ...args })

interface NotFound {
  _tag: 'NotFound'
}
const notFound: NotFound = { _tag: 'NotFound' }

type Location = Home | Create | Race | NotFound

const app = lit('app')
const matchers = {
  home: app.then(end),
  create: app.then(lit('create')).then(end),
  race: app.then(lit('race')).then(codec('raceId', RaceId.codec)).then(end),
}

const router = zero<Location>()
  .alt(matchers.home.parser.map(() => home))
  .alt(matchers.create.parser.map(() => create))
  .alt(matchers.race.parser.map(race))

const locationParse = (route: Route): Location => parse(router, route, notFound)

const locationFormat = {
  home: format(matchers.home.formatter, {}),
  create: format(matchers.create.formatter, {}),
  race: (raceId: RaceId): string => format(matchers.race.formatter, { raceId }),
}

const Location = {
  parse: locationParse,
  match: pipe(
    matchers,
    Dict.mapWithIndex((key, matcher) => (route: Route): boolean =>
      Maybe.isSome(matcher.parser.run(route)),
    ),
  ),
  format: locationFormat,
}

export { Location }

function codec<K extends string, A>(
  k: K,
  codec: C.Codec<unknown, string, A>,
): Match<{ [_ in K]: A }> {
  return new Match(
    new Parser(r => {
      if (r.parts.length === 0) {
        return Maybe.none
      } else {
        const head = r.parts[0]
        const tail = r.parts.slice(1)
        return Maybe.option.map(Maybe.fromEither(codec.decode(head)), a =>
          Fn.tuple(Dict.singleton(k, a), new Route(tail, r.query)),
        )
      }
    }),
    new Formatter((r, o) => new Route(r.parts.concat(codec.encode(o[k])), r.query)),
  )
}
