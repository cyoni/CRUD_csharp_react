export async function deleteCustomer(id: number) {
  try {
    if (isNaN(id) || id < 0) {
      return { success: false, error: "deleteCustomer: customer id is invalid" }
    }
    const result = await fetch(
      `${process.env.API_ENDPOINT}/Customers/DeleteCustomer?id=${id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )

    return { success: result.status === 200 }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error."
    return { success: false, error: message }
  }
}
