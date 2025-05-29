export const products = {
  "black-cap": {
    slug: "black-cap", // used for the URL
    name: "Maison Metapack Black Cap",
    price: "£24.99",
    breadcrumbs: [
      { id: 1, name: "Home", href: "/" },
    ],
    images: [
        {
            id: 1,
            imageSrc: "/images/blackcap2.png", // relative to /public
            imageAlt: "model wearting the black cap",
            primary: true,
        },
        {
            id: 2,
            imageSrc: "/images/blacktee1.png",
            imageAlt: "Back of the black tee",
            primary: false,
        },
        {
            id: 3,
            imageSrc: "/images/greyhoodie1.png",
            imageAlt: "side of the black tee",
            primary: false,
        },
    ],
    colors: [
      { name: "Black", bgColor: "bg-gray-900", selectedColor: "ring-gray-900" },
      { name: "Heather Grey", bgColor: "bg-gray-400", selectedColor: "ring-gray-400" },
    ],
    sizes: [
      { name: "XXS", inStock: false },
      { name: "XS", inStock: false },
      { name: "S", inStock: false },
      { name: "M", inStock: false },
      { name: "L", inStock: true },
      { name: "XL", inStock: false },
    ],
    description: `
      <p>Our new custom headwear silhouette – a structured 5-panel cap with a wide visor and more structured body. Made from lightweight nylon with a screen printed box logo at the front and metal strap adjuster at the back. Clean, breathable, and built to hold shape.</p>
    `,
    details: [
      "Only the best materials",
      "Ethically and locally made",
      "Pre-washed and pre-shrunk",
      "Machine wash cold with similar colors",
    ],
  },

  "black-tee": {
    slug: "black-tee", // used for the URL
    name: "Maison Metapack Black tee",
    price: "£24.99",
    breadcrumbs: [
      { id: 1, name: "Home", href: "/" },
    ],
    images: [
        {
            id: 1,
            imageSrc: "/images/blacktee2.png", // relative to /public
            imageAlt: "model wearting the black cap",
            primary: true,
        },
        {
            id: 2,
            imageSrc: "/images/blacktee1.png",
            imageAlt: "Back of the black tee",
            primary: false,
        },
        {
            id: 3,
            imageSrc: "/images/blackcap1.png",
            imageAlt: "side of the black tee",
            primary: false,
        },
    ],
    colors: [
      { name: "Black", bgColor: "bg-gray-900", selectedColor: "ring-gray-900" },
      { name: "Heather Grey", bgColor: "bg-gray-400", selectedColor: "ring-gray-400" },
    ],
    sizes: [
      { name: "XXS", inStock: true },
      { name: "XS", inStock: true },
      { name: "S", inStock: true },
      { name: "M", inStock: true },
      { name: "L", inStock: true },
      { name: "XL", inStock: true },
    ],
    description: `
      <p> A heavyweight 340gsm cotton tee with an enzyme wash for a vintage, worn-in finish. Printed with water-based discharge ink for a soft handfeel, it’s built on our signature cropped and boxy t-shirt block with twin-needle detailing and no side seam topstitch for a cleaner drape.</p>
    `,
    details: [
      "Only the best materials",
      "Ethically and locally made",
      "Pre-washed and pre-shrunk",
      "Machine wash cold with similar colors",
    ],
  },
  "black-hoodie": {
    slug: "black-hoodie", // used for the URL
    name: "Maison Metapack Black hoodie",
    price: "£59.99",
    breadcrumbs: [
      { id: 1, name: "Home", href: "/" },
    ],
    images: [
        {
            id: 1,
            imageSrc: "/images/blackhoodie1.png", // relative to /public
            imageAlt: "black hoodie displayed",
            primary: true,
        },
        {
            id: 2,
            imageSrc: "/images/blacktee1.png",
            imageAlt: "Black tee displayed",
            primary: false,
        },
        {
            id: 3,
            imageSrc: "/images/blackcap1.png",
            imageAlt: "black cap displayed",
            primary: false,
        },
    ],
    colors: [
      { name: "Black", bgColor: "bg-gray-900", selectedColor: "ring-gray-900" },
      { name: "Heather Grey", bgColor: "bg-gray-400", selectedColor: "ring-gray-400" },
    ],
    sizes: [
      { name: "XXS", inStock: true },
      { name: "XS", inStock: true },
      { name: "S", inStock: true },
      { name: "M", inStock: true },
      { name: "L", inStock: true },
      { name: "XL", inStock: true },
    ],
    description: `
      <p> The a:b box hoodie is made from 520GSM loopback-cotton jersey. It is cut with dropped shoulders and a cropped hem to create a boxy, laid-back silhouette. It features puff print about:blank branding across the back and a smaller brand signature on the front.</p>
    `,
    details: [
      "Only the best materials",
      "Ethically and locally made",
      "Pre-washed and pre-shrunk",
      "Machine wash cold with similar colors",
    ],
  },
  "grey-tee": {
    slug: "grey-tee", // used for the URL
    name: "Maison Metapack grey tee",
    price: "£24.99",
    breadcrumbs: [
      { id: 1, name: "Home", href: "/" },
    ],
    images: [
        {
            id: 1,
            imageSrc: "/images/greytee1.png", // relative to /public
            imageAlt: "grey tee displayed",
            primary: true,
        },
        {
            id: 2,
            imageSrc: "/images/blacktee1.png",
            imageAlt: "Black tee displayed",
            primary: false,
        },
        {
            id: 3,
            imageSrc: "/images/blackcap1.png",
            imageAlt: "black cap displayed",
            primary: false,
        },
    ],
    colors: [
      { name: "Black", bgColor: "bg-gray-900", selectedColor: "ring-gray-900" },
      { name: "Heather Grey", bgColor: "bg-gray-400", selectedColor: "ring-gray-400" },
    ],
    sizes: [
      { name: "XXS", inStock: true },
      { name: "XS", inStock: true },
      { name: "S", inStock: true },
      { name: "M", inStock: true },
      { name: "L", inStock: true },
      { name: "XL", inStock: true },
    ],
    description: `
      <p> Our bestselling tee is cut from our signature 340gsm cotton jersey to ensure a structural fit. The tee has an oversized silhouette with dropped shoulders and a ribbed crewneck and features about:blank branding in puff print across the back of the shoulders.</p>
    `,
    details: [
      "Only the best materials",
      "Ethically and locally made",
      "Pre-washed and pre-shrunk",
      "Machine wash cold with similar colors",
    ],
  },
  "grey-hoodie": {
    slug: "grey-hoodie", // used for the URL
    name: "Maison Metapack grey hoodie",
    price: "£59.99",
    breadcrumbs: [
      { id: 1, name: "Home", href: "/" },
    ],
    images: [
        {
            id: 1,
            imageSrc: "/images/greyhoodie1.png", // relative to /public
            imageAlt: "grey hoodie displayed",
            primary: true,
        },
        {
            id: 2,
            imageSrc: "/images/blacktee1.png",
            imageAlt: "Black tee displayed",
            primary: false,
        },
        {
            id: 3,
            imageSrc: "/images/blackcap1.png",
            imageAlt: "black cap displayed",
            primary: false,
        },
    ],
    colors: [
      { name: "Black", bgColor: "bg-gray-900", selectedColor: "ring-gray-900" },
      { name: "Heather Grey", bgColor: "bg-gray-400", selectedColor: "ring-gray-400" },
    ],
    sizes: [
      { name: "XXS", inStock: true },
      { name: "XS", inStock: true },
      { name: "S", inStock: true },
      { name: "M", inStock: true },
      { name: "L", inStock: true },
      { name: "XL", inStock: true },
    ],
    description: `
      <p> This hoodie is a heavyweight knitted version of our bestselling hoodie. It features a structural double knit, kangaroo pocket, oversized hood and raw cuffs. It comes as a matching set with our heavyweight knitted sweatpant.</p>
    `,
    details: [
      "Only the best materials",
      "Ethically and locally made",
      "Pre-washed and pre-shrunk",
      "Machine wash cold with similar colors",
    ],
  },
  // Add other products here using the same format
};