import { Link } from 'react-router-dom'
import Marketplace from './Marketplace'

export default function Shop() {
  return (
    <div className="space-y-10">
      <section className="rounded-3xl bg-gradient-to-br from-teal-700 via-teal-600 to-cyan-600 px-6 py-10 text-white sm:px-10 sm:py-14">
        <p className="text-sm font-semibold uppercase tracking-wide text-teal-100">
          Welcome to 1Fi Shop
        </p>
        <h1 className="mt-3 max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl">
          Buy now. Pay with EMI backed by mutual funds.
        </h1>
        <p className="mt-4 max-w-xl text-base text-teal-50">
          Explore the 1Fi Marketplace below, open a product, select your variant and EMI plan, then proceed.
        </p>
        <Link
          to="/marketplace"
          className="mt-6 inline-flex rounded-xl bg-white px-5 py-3 text-sm font-semibold text-teal-800 transition hover:bg-teal-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          Browse Marketplace
        </Link>
      </section>

      <Marketplace showIntro={false} />
    </div>
  )
}
