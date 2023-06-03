import { NextApiRequest, NextApiResponse } from "next"
import { deleteCustomer } from "../../../lib/deleteCustomer"
import { getCustomerById } from "../../../lib/getCustomerById"
import { updateCustomer } from "../../../lib/updateCustomer"

type Response = {
  error?: string
}
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  const { method, query } = req
  const id = Number(query.id)
  let result
  try {
    switch (method) {
      case "GET":
        result = await getCustomerById(id)
        break
      case "PUT":
        result = await updateCustomer(id, req.body)
        break
      case "DELETE":
        result = await deleteCustomer(id)
        break
      default:
        result = { error: "method is not valid" }
    }
    const status = result.error ? 400 : 200
    return res.status(status).send(result)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error."
    return res.status(500).send({ error: message })
  }
}
