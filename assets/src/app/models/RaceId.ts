import * as C from 'io-ts/Codec'
import { Newtype, iso } from 'newtype-ts'

import { fromNewtype } from '../utils/fromNewType'

export type RaceId = Newtype<{ readonly RaceId: unique symbol }, string>

const isoRaceId = iso<RaceId>()

export namespace RaceId {
  export const wrap = isoRaceId.wrap
  export const unwrap = isoRaceId.unwrap
  export const codec = fromNewtype<RaceId>(C.string)
}
