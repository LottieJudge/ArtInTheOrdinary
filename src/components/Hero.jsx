"use client";
import Image from "next/image";

export default function Hero ({image, alt}) {
    return (
      <div className="z-10 mx-auto flex max-w-3xl flex-col items-center px-6 py-32 text-center sm:py-64 lg:py-110 lg:px-0">
            <Image
              src={image}
              alt={alt}
              fill
              priority
              className="object-cover object-center z-[-1]"
              style={{ zIndex: -1, objectPosition: 'center top' }}
            />
              
           {/* <div className="bg-white/25 backdrop-blur-sm p-8 rounded-lg shadow-md">
            <h1 className="text-4xl font-bold tracking-tight text-black lg:text-6xl">New arrivals are here</h1>
            <p className="mt-4 text-xl text-black">
              The new arrivals have, well, newly arrived. Check out the latest options from our summer small-batch release
              while they're still in stock.
            </p>
            <a
              href="#"
              className="mt-8 inline-block rounded-md border border-transparent bg-black px-8 py-3 text-base font-medium text-white hover:bg-gray-800"
            >
              Shop New Arrivals
            </a>
          </div> */}
        </div>
    );
  }
  