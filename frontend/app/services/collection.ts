import axios from "axios";
import {API_URL} from "../utils/API_url";

export async function createCollection(
  name: string,
  items: string[],
  token: string
) {
  try {
    console.log("Service payload:", {name, items});
    const response = await axios.post(
      `${API_URL}/collections/create`,
      {name, items},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Create collection error:", error);
    throw error;
  }
}

export async function fetchCollections(token: string) {
  try {
    const response = await axios.get(`${API_URL}/collections`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Fetch collections error:", error);
    throw error;
  }
}

export const deleteCollection = async (collectionId: string, token: string) => {
  try {
    const response = await axios.delete(
      `${API_URL}/collections/${collectionId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting collection:", error);
    throw error;
  }
};
