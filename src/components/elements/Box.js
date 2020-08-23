import styled from 'styled-components'
import {
  background,
  border,
  color,
  compose,
  flexbox,
  position,
  layout,
  shadow,
  space,
} from 'styled-system'

const Box = styled('div')(
  compose(background, border, color, flexbox, position, layout, shadow, space)
)

export default Box
