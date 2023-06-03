import Head from "next/head"
import { useRouter } from "next/router"
import React, { ChangeEvent, useState } from "react"
import { useForm } from "react-hook-form"
function Login() {
  const router = useRouter()
  const {
    register,
    handleSubmit,

    formState: { dirtyFields, errors },
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
  })

  const [isSigningIn, setIsSigningIn] = useState<boolean>(false)

  const onSubmit = async (e: any) => {
    try {
      setIsSigningIn(true)
      const result = await fetch("api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...e }),
      })

      if (result.status === 200) {
        console.log("login succeed")
        router.push("/")
      } else {
        console.log("Wrong credentials.")
      }
    } catch (_) {}

    setIsSigningIn(false)
  }

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <div className="h-screen items-center">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mx-auto mt-20 flex w-[400px] flex-col space-y-2 rounded-md border p-5"
        >
          <h1 className="mb-2 text-2xl font-bold">Login</h1>

          <input
            {...register("email", {
              required: true,
              validate: {
                maxLength: (v) =>
                  v.length <= 50 ||
                  "The email should have at most 50 characters",
                matchPattern: (v) =>
                  /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
                  "Email address must be a valid address",
              },
            })}
            className={`rounded-md border p-1 outline-none  ${
              errors.email ? "bg-red-500" : dirtyFields.email && "bg-green-500"
            }`}
            name="email"
            placeholder="Email"
            defaultValue="emilywilson@example.com"
          />
          <input
            {...register("firstName", { required: true })}
            className={`rounded-md border p-1 outline-none  ${
              errors.firstName
                ? "bg-red-500"
                : dirtyFields.firstName && "bg-green-500"
            }`}
            name="firstName"
            placeholder="First name"
            defaultValue="Emily"
          />
          <input
            {...register("lastName", { required: true })}
            className={`rounded-md border p-1 outline-none  ${
              errors.lastName
                ? "bg-red-500"
                : dirtyFields.lastName && "bg-green-500"
            }`}
            name="lastName"
            placeholder="Last name"
            defaultValue="Brown"
          />
          <input
            {...register("password", { required: true })}
            className={`rounded-md border p-1 outline-none  ${
              errors.password
                ? "bg-red-500"
                : dirtyFields.password && "bg-green-500"
            }`}
            name="password"
            type="password"
            placeholder="Password"
            defaultValue="123"
          />
          <button
            type="submit"
            className="rounded-sm border bg-gray-200 p-2 hover:bg-gray-100"
          >
            {isSigningIn ? "Signing in..." : "Login"}
          </button>
        </form>
      </div>
    </>
  )
}

export default Login
