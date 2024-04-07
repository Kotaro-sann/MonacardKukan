import kukanData from "../kukan_data/kukan_data.json" with { type: "json" };

/**
 * Request Kukan Date
 * @param address 
 */
export async function requestKukanData() {
  const selectKukanData = kukanData.kukan_details;
  return selectKukanData;
}