const {registerIncompatiblePlugin} = require('@snorreeb/incompatible-plugin')
const {name, version} = require('./package.json')

registerIncompatiblePlugin({
  name: name,
  versions: {
    v2: '^1.2.5',
    v3: version
  },
  exchangeLink: 'https://www.sanity.io/plugins/content-calendar'
})
