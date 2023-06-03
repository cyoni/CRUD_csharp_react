import { E_SORTING_OPTIONS } from "./../lib/enums"
import { useMemo } from "react"
interface IProps<T> {
  data: T[]
  sortingType: string
  sortingConfig: { [key: string]: Function }
}

export function useSort<T>({ data, sortingType, sortingConfig }: IProps<T>) {
  const sortedResults = useMemo(() => {
    if (!Array.isArray(data)) return

    const clonedResults = [...data]
    switch (sortingType) {
      case E_SORTING_OPTIONS.ID_ASCENDING:
        return sortingConfig[E_SORTING_OPTIONS.ID_ASCENDING](clonedResults)

      case E_SORTING_OPTIONS.ID_DESCENDING:
        return sortingConfig[E_SORTING_OPTIONS.ID_DESCENDING](clonedResults)

      case E_SORTING_OPTIONS.NAME_LEXICOGRAPHICALLY_ASCENDING:
        return sortingConfig[
          E_SORTING_OPTIONS.NAME_LEXICOGRAPHICALLY_ASCENDING
        ](clonedResults)

      case E_SORTING_OPTIONS.NAME_LEXICOGRAPHICALLY_DESCENDING:
        return sortingConfig[
          E_SORTING_OPTIONS.NAME_LEXICOGRAPHICALLY_DESCENDING
        ](clonedResults)

      case E_SORTING_OPTIONS.PHONE_ASCENDING:
        return sortingConfig[E_SORTING_OPTIONS.PHONE_ASCENDING](clonedResults)

      case E_SORTING_OPTIONS.PHONE_DESCENDING:
        return sortingConfig[E_SORTING_OPTIONS.PHONE_DESCENDING](clonedResults)

      default:
        console.log("this sorting type is not implemented", sortingType)
    }

    return clonedResults
  }, [data, sortingType])

  return { sortedResults }
}
