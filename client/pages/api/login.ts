import { NextApiRequest, NextApiResponse } from "next"

type Response = {
  error?: string
}
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  try {
    console.log("hello@", req.body)
    const { email, firstName, lastName, password } = req.body

    const body = {
      Email: email,
      FirstName: firstName,
      LastName: lastName,
      Password: password,
    }

    const result = await fetch("https://localhost:44398/Login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    console.log("result", result)

    res.status(result.status).send({})
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
}
