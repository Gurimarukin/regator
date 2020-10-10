import * as C from 'io-ts/Codec'
import { AnyNewtype, CarrierOf, iso } from 'newtype-ts'

import { Either, Fn } from '../../shared/fp'

export function fromNewtype<N extends AnyNewtype = never>(
  codec: C.Codec<unknown, CarrierOf<N>, CarrierOf<N>>,
): C.Codec<unknown, CarrierOf<N>, N> {
  const i = iso<N>()
  return C.make(
    { decode: Fn.flow(codec.decode, Either.map(i.wrap)) },
    { encode: Fn.flow(i.unwrap, codec.encode) },
  )
}
