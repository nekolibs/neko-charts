import { femaleBack } from './femaleBack'
import { femaleFront } from './femaleFront'
import { maleBack } from './maleBack'
import { maleFront } from './maleFront'

export * from './keys'

export const BODIES = {
  male: { front: maleFront, back: maleBack },
  female: { front: femaleFront, back: femaleBack },
}
