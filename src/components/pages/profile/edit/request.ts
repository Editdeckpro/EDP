"use server";
import GetServerAxiosWithAuth from "@/lib/axios-instance-server";
import { ProfileFormType } from "@/schemas/edit-profile-schema";
import { AxiosError } from "axios";

export async function editFormDataSubmit(data: ProfileFormType) {
  const formData = new FormData();
  if (data.image) {
    formData.append("profileImage", data.image);
  }
  if (data.username) {
    formData.append("username", data.username);
  }
  if (data.firstName) {
    formData.append("firstName", data.firstName);
  }
  if (data.lastName) {
    formData.append("lastName", data.lastName);
  }
  if (data.email) {
    formData.append("email", data.email);
  }

  try {
    const axios = await GetServerAxiosWithAuth();
    const response = await axios.put(`user`, formData);
    return response.data;
  } catch (error) {
    const e = error as AxiosError<{ error: string }>;
    console.error("API request failed:", e);
    throw new Error(e.response?.data.error || "Something went wrong!");
  }
}
