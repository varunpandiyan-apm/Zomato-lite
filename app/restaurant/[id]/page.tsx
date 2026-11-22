import { RestaurantView } from "@/app/components/RestaurantView";

export default async function RestaurantPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <RestaurantView restaurantId={Number(id)} />;
}
