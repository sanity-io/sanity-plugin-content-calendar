import {useClient} from 'sanity'

export function useSanityClient(apiVersion?: string) {
  return useClient({apiVersion: apiVersion ?? '2021-09-06'})
}
