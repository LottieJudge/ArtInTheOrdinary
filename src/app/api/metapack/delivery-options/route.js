import deliveryOptions from '@/data/metapack/delivery-options/response.json';

export async function GET() {
  return Response.json(deliveryOptions);
}
