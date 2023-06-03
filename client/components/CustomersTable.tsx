import { useRouter } from "next/router"
import React, { useState } from "react"
import { useFilter } from "../hooks/useFilter"
import { useSort } from "../hooks/useSort"
import { customerSortingConfig } from "../lib/customerSortingConfig"
import { E_SORTING_OPTIONS } from "../lib/enums"

interface IProps {
  customers: Customer[]
}

function CustomersTable({ customers }: IProps) {
  const router = useRouter()

  const [filterInput, setFilterInput] = useState<string>("")
  const [sortingType, setSortingType] = useState<string>(
    E_SORTING_OPTIONS.ID_ASCENDING
  )

  const { filteredData } = useFilter<Customer>({
    unfilteredData: customers,
    filterInput,
  })

  const { sortedResults } = useSort<Customer>({
    data: filteredData,
    sortingType,
    sortingConfig: customerSortingConfig,
  })

  const handleTableClick = (customer: Customer) => {
    const id = customer.id
    router.push({ pathname: `/customer/edit/${id}`, query: { ...customer } })
  }

  return (
    <div>
      <div className="flex justify-between space-x-2">
        <div>
          Filter:{" "}
          <input
            className="rounded-sm border p-1 outline-none"
            type="text"
            value={filterInput}
            onChange={(e) => setFilterInput(e.target.value.toLowerCase())}
          />
        </div>

        <div>
          Sort:{" "}
          <select
            value={sortingType}
            onChange={(e) => setSortingType(e.target.value)}
            className="rounded-sm border p-1 outline-none"
          >
            <option value={E_SORTING_OPTIONS.ID_ASCENDING}>Id ascending</option>
            <option value={E_SORTING_OPTIONS.ID_DESCENDING}>
              Id descending
            </option>
            <option value={E_SORTING_OPTIONS.NAME_LEXICOGRAPHICALLY_ASCENDING}>
              Lexicographically ascending
            </option>
            <option value={E_SORTING_OPTIONS.NAME_LEXICOGRAPHICALLY_DESCENDING}>
              Lexicographically descending
            </option>
            <option value={E_SORTING_OPTIONS.PHONE_ASCENDING}>
              Phone ascending
            </option>
            <option value={E_SORTING_OPTIONS.PHONE_DESCENDING}>
              Phone descending
            </option>
          </select>
        </div>
      </div>
      <table className="mt-3 w-full border-l border-r">
        <thead>
          <tr>
            <th className="border border-slate-600">ID</th>
            <th className="border border-slate-600">First Name</th>
            <th className="border border-slate-600">Last Name</th>
            <th className="border border-slate-600">Email</th>
            <th className="border border-slate-600">Phone</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(sortedResults) &&
            sortedResults.map((c) => (
              <tr
                key={c.id}
                onClick={() => handleTableClick(c)}
                className="cursor-pointer border-b text-center hover:bg-gray-100"
              >
                <td className="p-1">{c.id}</td>
                <td className="p-1">{c.firstName}</td>
                <td className="p-1">{c.lastName}</td>
                <td className="p-1">{c.email}</td>
                <td className="p-1">{c.phone}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}

export default CustomersTable
