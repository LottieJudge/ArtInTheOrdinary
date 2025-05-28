  "use client"
  import Image from "next/image"

  export default function LookBook({ items }) {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 id="gallery-heading" className="sr-only">Lookbook</h2>

        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
          {items.map((item) => (
            <a key={item.id} href={item.href} className="group">
              <div className="relative w-full h-140">
                <Image
                  src={item.image.src}
                  alt={item.image.alt}
                  fill
                  className="object-cover group-hover:opacity-75"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <div className="mt-4 flex items-center justify-between text-base font-medium text-gray-900">
                <h3>{item.title}</h3>
              </div>
              <p className="mt-1 text-sm text-gray-500 italic">{item.date}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
