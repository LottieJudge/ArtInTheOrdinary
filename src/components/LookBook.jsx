"use client"
import Image from "next/image"

export default function LookBook({ gallery }) {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 id="gallery-heading" className="sr-only">
          Lookbook
        </h2>

        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
          {gallery.map((gallery) => (
            <a key={gallery.id} href={gallery.href} className="group">
              <img
                alt={gallery.imageAlt}
                src={gallery.imageSrc}
                className="aspect-square w-full overflow-hidden rounded-lg object-cover group-hover:opacity-75 sm:aspect-2/3"
              />
              <div className="mt-4 flex items-center justify-between text-base font-medium text-gray-900">
                <h3>{gallery.title}</h3>
              </div>
              <p className="mt-1 text-sm text-gray-500 italic">{gallery.date}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
