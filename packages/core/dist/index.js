"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  searchTrips: () => searchTrips
});
module.exports = __toCommonJS(index_exports);

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  searchTrips
});
