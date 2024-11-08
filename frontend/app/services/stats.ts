import axios from "axios";
import {StatsData} from "@/types/stats";

export async function fetchStats(
  userId: string,
  token: string,
  timeFrame: "week" | "month" | "year"
): Promise<StatsData> {
  const response = await axios.get(
    `${process.env.EXPO_PUBLIC_API_URL}/stats/${userId}`,
    {
      headers: {Authorization: `Bearer ${token}`},
      params: {timeFrame},
    }
  );
  return response.data;
}
