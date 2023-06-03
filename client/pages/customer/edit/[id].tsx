import Head from "next/head"
import { useRouter } from "next/router"
import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { E_FORM_STATUS } from "../../../lib/enums"

function Customer() {
  const router = useRouter()
  const params = router.query
  const id = Number(router.query.id)
  const title = `Edit Customer ${id}`

  const {
    register,
    handleSubmit,
    formState: { dirtyFields, errors },
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
  })

  const [formStatus, setFormStatus] = useState<{ [key: string]: number }>({
    Update: E_FORM_STATUS.READY,
    Delete: E_FORM_STATUS.READY,
  })

  const updateCustomer = async (e: any) => {
    try {
      setFormStatus((prev: { [key: string]: number }) => ({
        ...prev,
        Update: E_FORM_STATUS.WORKING,
      }))

      const response = await fetch(`/api/customers/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...e }),
      })

      const result = await response.json()

      if (result.success) {
        return setFormStatus((prev: { [key: string]: number }) => ({
          ...prev,
          Update: E_FORM_STATUS.SUCCESS,
        }))
      } else {
        return setFormStatus((prev: { [key: string]: number }) => ({
          ...prev,
          Update: E_FORM_STATUS.ERROR,
        }))
      }
    } catch ({ message }) {
      console.log("update: caught exception ", message)
      setFormStatus((prev: { [key: string]: number }) => ({
        ...prev,
        Update: E_FORM_STATUS.ERROR,
      }))
    }
  }

  const deleteCustomer = async (e: any) => {
    try {
      e.preventDefault()
      setFormStatus((prev: { [key: string]: number }) => ({
        ...prev,
        Delete: E_FORM_STATUS.WORKING,
      }))
      const response = await fetch(`/api/customers/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })
      const result = await response.json()
      if (result.success) {
        setFormStatus((prev: { [key: string]: number }) => ({
          ...prev,
          Delete: E_FORM_STATUS.SUCCESS,
        }))
        router.push("/")
      } else {
        setFormStatus((prev: { [key: string]: number }) => ({
          ...prev,
          Delete: E_FORM_STATUS.ERROR,
        }))
      }
    } catch ({ message }) {
      setFormStatus((prev: { [key: string]: number }) => ({
        ...prev,
        Delete: E_FORM_STATUS.ERROR,
      }))
      console.log("delete: caught exception ", message)
    }
  }

  const getFormStatus = (form: string) => {
    return formStatus[form] === E_FORM_STATUS.READY
      ? form
      : formStatus[form] === E_FORM_STATUS.WORKING
      ? "Wait..."
      : formStatus[form] === E_FORM_STATUS.SUCCESS
      ? "Success!"
      : "Error"
  }

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      <div className="mx-auto mt-20 max-w-[600px] rounded-sm border p-2 shadow-md">
        {id >= 0 ? (
          <>
            <h1 className="text-xl font-bold">{title}</h1>

            <form
              onSubmit={handleSubmit(updateCustomer)}
              className="mt-2 flex flex-col space-y-2"
            >
              <input
                {...register("firstName", { required: true })}
                className={`rounded-md border p-1 outline-none  ${
                  errors.firstName
                    ? "bg-red-500"
                    : dirtyFields.firstName && "bg-green-500"
                }`}
                placeholder="First Name"
                defaultValue={params.firstName}
              />

              <input
                {...register("lastName", { required: true })}
                className={`rounded-md border p-1 outline-none  ${
                  errors.lastName
                    ? "bg-red-500"
                    : dirtyFields.lastName && "bg-green-500"
                }`}
                placeholder="Last Name"
                defaultValue={params.lastName}
              ></input>

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
                  errors.email
                    ? "bg-red-500"
                    : dirtyFields.email && "bg-green-500"
                }`}
                placeholder="Email"
                defaultValue={params.email}
              ></input>

              <input
                {...register("phone", {
                  required: true,
                  validate: {
                    matchPattern: (v) =>
                      /^\d{9,10}$/.test(v) ||
                      "The phone should have only numbers and be 9 to 10 in length",
                  },
                })}
                className={`rounded-md border p-1 outline-none  ${
                  errors.phone
                    ? "bg-red-500"
                    : dirtyFields.phone && "bg-green-500"
                }`}
                placeholder="Phone"
                defaultValue={params.phone}
              ></input>

              <div className="flex justify-between">
                <div className="flex space-x-2">
                  <button
                    className="rounded-sm border bg-slate-200 p-1 px-3 hover:bg-slate-50"
                    type="submit"
                  >
                    {getFormStatus("Update")}
                  </button>
                  <button
                    onClick={deleteCustomer}
                    className="rounded-sm border p-1 px-3 hover:bg-slate-50"
                  >
                    {getFormStatus("Delete")}
                  </button>
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    router.push("/")
                  }}
                  className="rounded-sm border p-1 px-3 hover:bg-slate-50"
                >
                  Return
                </button>
              </div>
            </form>
          </>
        ) : (
          <div>Customer Id is invalid</div>
        )}
      </div>
    </>
  )
}

export default Customer
