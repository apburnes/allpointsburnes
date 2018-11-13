import React from 'react'
import styled from 'styled-components'
import academic from '../../static/academic.svg'
import code from '../../static/code.svg'
import download from '../../static/download.svg'
import talk from '../../static/talk.svg'
import website from '../../static/website.svg'
import work from '../../static/work.svg'

const icons = {
  academic,
  download,
  code,
  talk,
  website,
  work,
}

const Comp = ({ className, type }) => {
  const svg = icons[type] ? icons[type] : icons['website']

  return <img alt="icon" className={className} src={svg} />
}

const Icon = styled(Comp)`
  width: 20px;
  height: auto;
  margin: 0;
  padding: 0;
`

export default Icon
