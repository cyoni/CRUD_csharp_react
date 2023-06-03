export async function updateCustomer(id: number, customer: Customer) {
  try {
    if (isNaN(id) || id < 0) {
      return { success: false, error: "updateCustomer: customer id is invalid" }
    }

    const result = await fetch(
      `${process.env.API_ENDPOINT}/Customers/UpdateCustomer`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...customer, id }),
      }
    )
    const success = result.status === 200
    return { success }
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error."
    return { success: false, error: message }
  }
}
