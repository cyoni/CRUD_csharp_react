export async function getCustomers() {
  try {
    const result = await fetch(
      `${process.env.API_ENDPOINT}/Customers/GetAllCustomers`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )

    const customers: Customer[] = await result.json()

    console.log("customers", customers)
    return { success: true, customers }
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error."
    return { success: false, error: message }
  }
}
