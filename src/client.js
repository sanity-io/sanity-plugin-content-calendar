import sanityClient from 'part:@sanity/base/client'
let client = sanityClient
if (typeof sanityClient.withConfig === 'function') {
  client = sanityClient.withConfig({
    apiVersion: '1',
  })
}
export default client