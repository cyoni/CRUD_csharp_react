import { E_SORTING_OPTIONS } from "./enums"

const idAscending = (clonedResults: Customer[]) =>
  clonedResults.sort((a, b) => a.id - b.id)

const idDescending = (clonedResults: Customer[]) =>
  clonedResults.sort((a, b) => b.id - a.id)

const nameAscending = (clonedResults: Customer[]) =>
  clonedResults.sort((a, b) => {
    const first = a.firstName?.toLowerCase()
    const second = b.firstName?.toLowerCase()
    if (first < second) return -1
    else if (first > second) return 1
    else return 0
  })

const nameDescending = (clonedResults: Customer[]) =>
  clonedResults.sort((a, b) => {
    const first = a.firstName?.toLowerCase()
    const second = b.firstName?.toLowerCase()
    if (first > second) return -1
    else if (first < second) return 1
    else return 0
  })

const phoneAscending = (clonedResults: Customer[]) =>
  clonedResults.sort((a, b) => a.phone - b.phone)

const phoneDescending = (clonedResults: Customer[]) =>
  clonedResults.sort((a, b) => b.phone - a.phone)

export const customerSortingConfig = {
  [E_SORTING_OPTIONS.ID_ASCENDING]: idAscending,
  [E_SORTING_OPTIONS.ID_DESCENDING]: idDescending,
  [E_SORTING_OPTIONS.NAME_LEXICOGRAPHICALLY_ASCENDING]: nameAscending,
  [E_SORTING_OPTIONS.NAME_LEXICOGRAPHICALLY_DESCENDING]: nameDescending,
  [E_SORTING_OPTIONS.PHONE_ASCENDING]: phoneAscending,
  [E_SORTING_OPTIONS.PHONE_DESCENDING]: phoneDescending,
}
