"use client";
import Image from "next/image";

export default function About() {
  return (
    <div className="bg-white mt-">
      {/* Full-width image section */}
      <div className="relative w-full h-[1200px]"> {/* Adjust height as needed */}
        <Image
          alt="Maison Metapack Lobby"
          fill
          src="/images/lobby.png"
          className="object-cover w-full"
          priority
        />
      </div>
      
      {/* Content section */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 sm:py-24">
        <figure className="relative isolate pt-6 sm:pt-12">
          <svg
            fill="none"
            viewBox="0 0 162 128"
            aria-hidden="true"
            className="absolute top-0 left-0 -z-10 h-32 stroke-gray-200"
          >
            <path
              d="M65.5697 118.507L65.8918 118.89C68.9503 116.314 71.367 113.253 73.1386 109.71C74.9162 106.155 75.8027 102.28 75.8027 98.0919C75.8027 94.237 75.16 90.6155 73.8708 87.2314C72.5851 83.8565 70.8137 80.9533 68.553 78.5292C66.4529 76.1079 63.9476 74.2482 61.0407 72.9536C58.2795 71.4949 55.276 70.767 52.0386 70.767C48.9935 70.767 46.4686 71.1668 44.4872 71.9924L44.4799 71.9955L44.4726 71.9988C42.7101 72.7999 41.1035 73.6831 39.6544 74.6492C38.2407 75.5916 36.8279 76.455 35.4159 77.2394L35.4047 77.2457L35.3938 77.2525C34.2318 77.9787 32.6713 78.3634 30.6736 78.3634C29.0405 78.3634 27.5131 77.2868 26.1274 74.8257C24.7483 72.2185 24.0519 69.2166 24.0519 65.8071C24.0519 60.0311 25.3782 54.4081 28.0373 48.9335C30.703 43.4454 34.3114 38.345 38.8667 33.6325C43.5812 28.761 49.0045 24.5159 55.1389 20.8979C60.1667 18.0071 65.4966 15.6179 71.1291 13.7305C73.8626 12.8145 75.8027 10.2968 75.8027 7.38572C75.8027 3.6497 72.6341 0.62247 68.8814 1.1527C61.1635 2.2432 53.7398 4.41426 46.6119 7.66522C37.5369 11.6459 29.5729 17.0612 22.7236 23.9105C16.0322 30.6019 10.618 38.4859 6.47981 47.558L6.47976 47.558L6.47682 47.5647C2.4901 56.6544 0.5 66.6148 0.5 77.4391C0.5 84.2996 1.61702 90.7679 3.85425 96.8404L3.8558 96.8445C6.08991 102.749 9.12394 108.02 12.959 112.654L12.959 112.654L12.9646 112.661C16.8027 117.138 21.2829 120.739 26.4034 123.459L26.4033 123.459L26.4144 123.465C31.5505 126.033 37.0873 127.316 43.0178 127.316C47.5035 127.316 51.6783 126.595 55.5376 125.148L55.5376 125.148L55.5477 125.144C59.5516 123.542 63.0052 121.456 65.9019 118.881L65.5697 118.507Z"
              id="b56e9dab-6ccb-4d32-ad02-6b4bb5d9bbeb"
            />
            <use x={86} href="#b56e9dab-6ccb-4d32-ad02-6b4bb5d9bbeb" />
          </svg>
          
          <div className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold text-black mb-8">About Maison Metapack</h2>
            
            <div className="text-xl/8 text-gray-700 space-y-6">
              <p>
                Maison Metapack is a curated merchandise webshop designed to bring the world of delivery to life — through design, culture, and commerce. But this isn't just about limited-edition pieces. This is a live environment built to showcase what Metapack can really do.
              </p>
              
              <p>
                Soon, Maison Metapack will become a complete test ground for brands and retailers to experience Metapack's full capabilities — from the moment a customer checks out, to the moment their order is delivered and analyzed. With also the addition of real photos of our team in the merch and not AI interpretations.
              </p>
              
              <p>
                Built on Metapack's enterprise delivery management platform, the experience reflects what leading global brands already rely on every day. With over 25 years of delivery expertise, Metapack enables retailers to:
              </p>
              
              <ul className="list-disc pl-6 space-y-2 text-lg">
                <li>Automate shipping using a vast global carrier library</li>
                <li>Offer dynamic delivery options at checkout to increase conversions</li>
                <li>Provide real-time tracking and reduce customer service costs</li>
                <li>Unlock deep delivery insights to drive performance and recover costs</li>
              </ul>
              
              <p className="font-semibold text-black">
                Maison Metapack lets you see — and feel — the future of ecommerce delivery.
              </p>
            </div>
            
            {/* Explore More Section */}
            <div className="mt-16 border-t border-gray-200 pt-16">
              <h3 className="text-2xl font-bold text-black mb-8">Explore More</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <a 
                  href="https://www.metapack.com/resources/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group block p-6 border border-gray-200 rounded-lg hover:border-black transition-colors"
                >
                  <div className="flex items-start space-x-3">
                    <Image 
                        src="/icons/book.svg" 
                        alt="Resources icon"
                        width={40}
                        height={40}
                      />
                    <div>
                      <h4 className="font-semibold text-black group-hover:underline">Metapack Resources and Case Studies</h4>
                      <p className="text-gray-600 mt-1">Visit Resource Hub →</p>
                    </div>
                  </div>
                </a>
                
                <a 
                  href="https://help.metapack.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group block p-6 border border-gray-200 rounded-lg hover:border-black transition-colors"
                >
                  <div className="flex items-start space-x-3">
                    <Image 
                        src="/icons/gear.svg" 
                        alt="Resources icon"
                        width={40}
                        height={40}
                      />
                    <div>
                      <h4 className="font-semibold text-black group-hover:underline">How Our Technology Works</h4>
                      <p className="text-gray-600 mt-1">Visit the Help Centre →</p>
                    </div>
                  </div>
                </a>
                
                <a 
                  href="https://developers.metapack.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group block p-6 border border-gray-200 rounded-lg hover:border-black transition-colors"
                >
                  <div className="flex items-start space-x-3">
                    <Image 
                        src="/icons/laptop.svg" 
                        alt="Resources icon"
                        width={40}
                        height={40}
                      />
                    <div>
                      <h4 className="font-semibold text-black group-hover:underline">Developer Documentation</h4>
                      <p className="text-gray-600 mt-1">Explore API & Integration Docs →</p>
                    </div>
                  </div>
                </a>
                
                <a 
                  href="https://www.metapack.com/contact/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group block p-6 border border-gray-200 rounded-lg hover:border-black transition-colors"
                >
                  <div className="flex items-start space-x-3">
                    <Image 
                        src="/icons/mailbox.svg" 
                        alt="Resources icon"
                        width={40}
                        height={40}
                      />
                    <div>
                      <h4 className="font-semibold text-black group-hover:underline">Contact Metapack</h4>
                      <p className="text-gray-600 mt-1">Get in Touch →</p>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
          
          <figcaption className="mt-12 text-base">
            <div className="font-semibold text-black">The Metapack Team</div>
            <div className="mt-1 text-gray-600">Delivering the future of ecommerce</div>
          </figcaption>
        </figure>
      </div>
    </div>
  )
}