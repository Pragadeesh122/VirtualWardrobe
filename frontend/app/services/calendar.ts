import axios from "axios";
import {API_URL} from "../utils/API_url";
import {OutfitLog} from "@/types/calendar";

export async function createOutfitLog(
  date: string,
  collectionId: string,
  token: string
) {
  try {
    const response = await axios.post(
      `${API_URL}/calendar/outfits`,
      {date, collectionId},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Create outfit log error:", error);
    throw error;
  }
}

export async function fetchOutfitLogs(token: string) {
  try {
    const response = await axios.get(`${API_URL}/calendar/outfits`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Fetch outfit logs error:", error);
    throw error;
  }
}

export async function deleteOutfitLog(outfitId: string, token: string) {
  try {
    const response = await axios.delete(
      `${API_URL}/calendar/outfits/${outfitId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Delete outfit log error:", error);
    throw error;
  }
}

