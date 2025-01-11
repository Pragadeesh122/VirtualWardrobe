import axios from "axios";
import {API_URL} from "../utils/API_url";
import {ClothItem} from "@/types/wardrobe";
import {Platform} from "react-native";

export async function uploadFile(
  clothName: string,
  clothType: string,
  image: string,
  imageType: string,
  token: string
) {
  const formData = new FormData();
  formData.append("clothName", clothName);
  formData.append("clothType", clothType);

  console.log(image);

  if (image) {
    console.log(image);
    formData.append("image", {
      uri: Platform.OS === "ios" ? image?.replace("file://", "") : image,
      type: imageType,
      name: image?.split("/").pop() || "image.jpg",
    } as any);
  }
  try {
    const response = await axios.post(
      `${API_URL}/wardrobe/uploadItem`,
      formData,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Upload error:", error.response?.data);
      throw new Error(error.response?.data?.error || "Upload failed");
    }
    throw error;
  }
}

export async function fetchWardrobe(
  userID: string,
  token: string
): Promise<ClothItem[]> {
  try {
    console.log("[fetchWardrobe] Fetching items for user:", userID);
    const response = await axios.post<ClothItem[]>(
      `${API_URL}/wardrobe/getItem`,
      {
        userID,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("[fetchWardrobe] Raw response data:", response.data);

    // Ensure each item has its document ID and required fields
    const items = response.data
      .map((item) => {
        if (!item.id) {
          console.warn("[fetchWardrobe] Item missing ID:", item);
          return null;
        }

        // Log each item's data
        console.log(`[fetchWardrobe] Processing item ${item.id}:`, {
          id: item.id,
          clothName: item.clothName,
          clothType: item.clothType,
          imageUrl: item.imageUrl,
        });

        return item; // Return the original item since it has an ID
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);

    console.log("[fetchWardrobe] Final processed items:", items);
    return items;
  } catch (error) {
    console.error("[fetchWardrobe] Error fetching wardrobe:", error);
    throw error;
  }
}

export const deleteClothItem = async (itemId: string, token: string) => {
  try {
    const response = await axios.delete(`${API_URL}/wardrobe/${itemId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting item:", error);
    throw error;
  }
};

export const updateClothItem = async (
  itemId: string,
  updates: {clothName: string},
  token: string
) => {
  try {
    const response = await axios.put(`${API_URL}/wardrobe/${itemId}`, updates, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating item:", error);
    throw error;
  }
};
