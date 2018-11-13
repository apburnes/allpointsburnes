import Typography from 'typography'
import Font from 'typography-theme-sutro'

const typography = new Typography(Font)

// Hot reload typography in development.
if (process.env.NODE_ENV !== 'production') {
  typography.injectStyles()
}

const { rhythm, scale } = typography
export { rhythm, scale, typography as default }
