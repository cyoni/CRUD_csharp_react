import { NextPageContext } from "next"
import Head from "next/head"
import React from "react"
import CustomersTable from "../components/CustomersTable"
import { getCustomers } from "../lib/getCustomers"

interface IProps {
  customers: Customer[]
}
function index({ customers }: IProps) {
  console.log("customers", customers)



  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <div className="mx-auto mt-20 max-w-[600px]">

        <CustomersTable customers={customers} />
      </div>
    </>
  )
}

export default index

export async function getServerSideProps(context: NextPageContext) {
  const result = await getCustomers()

  return {
    props: { customers: result.customers },
  }
}
