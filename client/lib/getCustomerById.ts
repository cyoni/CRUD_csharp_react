export async function getCustomerById(id: number) {
  try {
    if (isNaN(id) || id < 0) {
      return { error: "getCustomerById: customer id is invalid" }
    }

    const result = await fetch(
      `${process.env.API_ENDPOINT}/Customers/GetCustomerById?id=${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )

    const customer: Customer = await result.json()

    return { customer }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error."
    return { customer: {}, error: message }
  }
}
