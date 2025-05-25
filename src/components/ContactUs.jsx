"use client";
import { useState } from "react";

export default function ContactUs() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [requirements, setRequirements] = useState("");
  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState("");

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          requirements,
        }),
      });

      if (res.ok) {
        setStatus("Message sent successfully.");
        setStatusType("success");
        setFirstName("");
        setLastName("");
        setEmail("");
        setPhone("");
        setRequirements("");
      } else {
        const errorData = await res.json();
        setStatus("Error: " + errorData.error);
        setStatusType("error");
      }
    } catch (err) { // Correctly positioned catch block
      setStatus("Something went wrong. However we would still love to hear from you. Please use one of our other contact methods.");
      setStatusType("error");
    }
  };

    return (
        <div id="contact" className="contact relative isolate bg-white font-montserrat">
        <div className="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-2">
          <div className="relative px-6 pb-20 pt-24 sm:pt-32 lg:static lg:px-8 lg:py-48">
            <div className="mx-auto max-w-xl lg:mx-0 lg:max-w-lg">
              <div className="absolute inset-y-0 left-0 -z-10 w-full overflow-hidden bg-white ring-1 ring-white lg:w-1/2">
              </div>
              <h2 className="text-pretty text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">Contact us</h2>
              <dl className="mt-10 space-y-4 text-base/7 text-gray-600">
                <div className="flex gap-x-4">
                  <dt className="flex-none">
                    <span className="sr-only">Address</span>
                    <svg className="h-7 w-6 text-black" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
                    </svg>
                  </dt>
                  <dd>Marcoso Global Resources Ltd<br />70 Gracechurch Street<br />Suite 322<br />London, EC3V 0HR</dd>
                </div>
                <div className="flex gap-x-4">
                  <dt className="flex-none">
                    <span className="sr-only">Telephone</span>
                    <svg className="h-7 w-6 text-black" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                    </svg>
                  </dt>
                  <dd><a className="hover:text-gray-900" href="tel:+ 44 203 9688 022">+ 44 203 9688 022</a></dd>
                </div>
                <div className="flex gap-x-4">
                  <dt className="flex-none">
                    <span className="sr-only">Email</span>
                    <svg className="h-7 w-6 text-black" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                    </svg>
                  </dt>
                  <dd><a className="hover:text-gray-900" href="mailto:aa@marcosotrade.com">info@marcosotech.com</a></dd>
                </div>
              </dl>
            </div>
          </div>
          <form onSubmit={handleFormSubmit} className="px-6 pb-24 pt-20 sm:pb-32 lg:px-8 lg:py-48">
            <div className="mx-auto max-w-xl lg:mr-0 lg:max-w-lg">
              <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="first-name" className="block text-sm/6 font-semibold text-gray-900">First name</label>
                  <div className="mt-2.5">
                    <input type="text" name="first-name" id="first-name" value={firstName} onChange={(event) => setFirstName(event.target.value)} required autoComplete="given-name" className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#8b0000] sm:text-sm/6" />
                  </div>
                </div>
                <div>
                  <label htmlFor="last-name" className="block text-sm/6 font-semibold text-gray-900">Last name</label>
                  <div className="mt-2.5">
                    <input type="text" name="last-name" id="last-name" value={lastName} onChange={(event) => setLastName(event.target.value)} required autoComplete="family-name" className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#8b0000] sm:text-sm/6" />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="email" className="block text-sm/6 font-semibold text-gray-900">Email</label>
                  <div className="mt-2.5">
                    <input type="email" name="email" id="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#8b0000] sm:text-sm/6" />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="phone-number" className="block text-sm/6 font-semibold text-gray-900">Phone number</label>
                  <div className="mt-2.5">
                    <input type="tel" name="phone-number" id="phone-number" value={phone} onChange={(event) => {
                      const value = event.target.value;
                      if (value === '' || /^[0-9]+$/.test(value)) {
                      setPhone(value);}}} 
                      autoComplete="tel" className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#8b0000] sm:text-sm/6" />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="message" className="block text-sm/6 font-semibold text-gray-900">Tell us about your requirements</label>
                  <div className="mt-2.5">
                    <textarea name="message" id="message" rows="4" value={requirements} onChange={(event) => setRequirements(event.target.value)} required className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#8b0000] sm:text-sm/6"></textarea>
                  </div>
                </div>
              </div>
              <div>
              {status && (
              <div className={`mb-4 ${statusType === "error" ? "text-[#8b0000]" : "text-green-500"}`}> {status}</div>
              )}
              </div>
              <div className="mt-8 flex justify-end">
                <button type="submit" className="rounded-md bg-black px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">Send message</button>
              </div>
            </div>
          </form>
        </div>
      </div> 
    );
}
