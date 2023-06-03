import { useMemo, useState } from "react"
interface IProps<T> {
  unfilteredData: T[]
  filterInput: string
}
export function useFilter<T>({ unfilteredData, filterInput }: IProps<T>) {
  const [cacheFilter, setCacheFilter] = useState<{ [key: string]: T[] }>()

  const filteredData = useMemo(() => {
    if (cacheFilter) {
      if (cacheFilter[filterInput]) return cacheFilter[filterInput]

      if (filterInput.length > 1) {
        const lastResult = cacheFilter[filterInput.slice(0, -1)]
        if (lastResult?.length === 0) {
          return []
        }

        if (lastResult?.length === 1) {
          return lastResult
        }
      }
    }
    const filteredCustomers = unfilteredData.filter(
      (item) =>
        item &&
        Object.values(item).some((value) =>
          value?.toString().toLowerCase().includes(filterInput)
        )
    )
    setCacheFilter({ ...cacheFilter, [filterInput]: filteredCustomers })
    return filteredCustomers
  }, [filterInput])

  return { filteredData }
}
