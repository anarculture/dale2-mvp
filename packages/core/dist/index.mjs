// src/api/tripsApi.ts
async function searchTrips(supabase, params) {
  let query = supabase.from("trips").select("*").eq("status", "scheduled");
  if (params.origin) {
    query = query.ilike("origin", `%${params.origin}%`);
  }
  if (params.destination) {
    query = query.ilike("destination", `%${params.destination}%`);
  }
  if (params.date) {
    const startDate = `${params.date}T00:00:00.000Z`;
    const tempDate = new Date(params.date);
    tempDate.setUTCDate(tempDate.getUTCDate() + 1);
    const endDate = `${tempDate.toISOString().split("T")[0]}T00:00:00.000Z`;
    query = query.gte("departure_datetime", startDate).lt("departure_datetime", endDate);
  }
  query = query.order("departure_datetime", { ascending: true });
  const { data, error } = await query;
  if (error) {
    console.error("Error searching trips:", error.message);
    return { data: null, error };
  }
  return { data, error: null };
}
async function createTrip(supabase, tripData) {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) {
    console.error("Error getting user:", userError.message);
    return { data: null, error: userError };
  }
  if (!userData.user) {
    const authError = new Error("User not authenticated");
    console.error("Error creating trip:", authError.message);
    return { data: null, error: authError };
  }
  const { data, error } = await supabase.from("trips").insert([{
    ...tripData,
    driver_id: userData.user.id,
    // Set the driver_id to the current user's ID
    status: "scheduled",
    departure_datetime: new Date(tripData.departure_datetime).toISOString()
  }]).select().single();
  if (error) {
    console.error("Error creating trip:", error.message);
    return { data: null, error };
  }
  return { data, error: null };
}
export {
  createTrip,
  searchTrips
};
