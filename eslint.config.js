import antfu from '@antfu/eslint-config'

export default antfu({
  type: 'app', // hoặc 'lib' nếu là thư viện
  typescript: true,
  vue: true,
  stylistic: {
    indent: 2,
    quotes: 'single',
  },
})
