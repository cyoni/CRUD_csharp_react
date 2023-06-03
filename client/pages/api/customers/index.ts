import { NextApiRequest, NextApiResponse } from "next"
import { getCustomers } from "../../../lib/getCustomers"

type Response = {
  error?: string
  customers?: Customer[]
}
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  const { method } = req
  let result: Response
  try {
    switch (method) {
      case "GET":
        result = await getCustomers()
        break
      default:
        return res.status(400).send({ error: "method is not valid" })
    }

    return res.status(200).send({ ...result })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error."
    return res.status(500).send({ error: message })
  }
}
