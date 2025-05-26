export async function GET() {
  return Response.json({
    header: {
      requestId: 'maison-pudo-test',
      requestDate: new Date().toISOString()
    },
    results: [
      {
        storeId: "S32692",
        storeName: "Evri ParcelShop - Tesco Stratford",
        address: "Tesco, 10 High Street, Stratford, London",
        postcode: "E15 2EE",
        lat: 51.5416,
        long: 0.0010,
        carrierCode: "HERMESPOS",
        carrierServiceCode: "HERMPSND",
        bookingCode: "HERMPSND_S32692_6612/2025-05-29/*-*/*/*-*",
        delivery: {
          from: "2025-05-29T08:00:00Z",
          to: "2025-05-29T20:00:00Z"
        }
      },
      {
        storeId: "S44501",
        storeName: "Evri ParcelShop - WHSmith Oxford Street",
        address: "WHSmith, 160 Oxford St, London",
        postcode: "W1D 1NF",
        lat: 51.5154,
        long: -0.1410,
        carrierCode: "HERMESPOS",
        carrierServiceCode: "HERMPSSTD",
        bookingCode: "HERMPSSTD_S44501_7214/2025-05-30/*-*/*/*-*",
        delivery: {
          from: "2025-05-30T08:00:00Z",
          to: "2025-05-30T20:00:00Z"
        }
      },
      {
        storeId: "S55893",
        storeName: "Evri ParcelShop - Co-op Camden",
        address: "Co-op Food, 196 Camden High St, London",
        postcode: "NW1 8QP",
        lat: 51.5412,
        long: -0.1438,
        carrierCode: "HERMESPOS",
        carrierServiceCode: "HERMPSND",
        bookingCode: "HERMPSND_S55893_9198/2025-06-01/*-*/*/*-*",
        delivery: {
          from: "2025-06-01T08:00:00Z",
          to: "2025-06-01T20:00:00Z"
        }
      }
    ]
  });
}
