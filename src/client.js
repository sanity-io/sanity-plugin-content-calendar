import sanityClient from 'part:@sanity/base/client'

const client =
  typeof sanityClient.withConfig === 'function'
    ? sanityClient.withConfig({
        apiVersion: '2021-09-06'
      })
    : sanityClient

export default client
