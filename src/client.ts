import {useMemo} from 'react'
import {useClient} from 'sanity'

export function useSanityClient(apiVersion?: string) {
  const client = useClient()
  return useMemo(
    () =>
      client.withConfig({
        apiVersion: apiVersion ?? '2021-09-06'
      }),
    [client, apiVersion]
  )
}
