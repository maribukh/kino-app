"use client";

import { useState, FormEvent } from "react";
import { User } from "@/types/auth";
import { useAuth } from "@/context/AuthContext";
import { useConfig } from "@/context/ConfigContext";
import { AuthInput } from "@/components/ui/AuthInput";
import { Button } from "@/components/ui/Button";

interface PersonalInfoFormProps {
  user: User | null;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://api.kinoxii.redberryinternship.ge/api";

export const PersonalInfoForm = ({ user }: PersonalInfoFormProps) => {
  const { updateUser } = useAuth();
  const { options } = useConfig();
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [mobileNumber, setMobileNumber] = useState(user?.mobileNumber || "");
  const [dateOfBirth, setDateOfBirth] = useState(user?.dateOfBirth || "");
  const [preferredVenueId, setPreferredVenueId] = useState(
    user?.preferredVenue?.id?.toString() || "",
  );

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const token = localStorage.getItem("token");
    if (!token) {
      setErrorMessage("Please log in to update your profile.");
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("mobileNumber", mobileNumber);
    formData.append("dateOfBirth", dateOfBirth);
    if (preferredVenueId) {
      formData.append("preferredVenueId", preferredVenueId);
    }

    try {
      const res = await fetch(`${API_BASE_URL}/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: formData,
      });

      const result = await res.json();

      if (!res.ok) {
        if (result?.errors?.mobileNumber) {
          throw new Error(result.errors.mobileNumber[0]);
        }
        throw new Error(result?.message || "Failed to update profile");
      }

      const selectedVenue = options?.venues.find(
        (venue) => venue.id.toString() === preferredVenueId,
      );
      updateUser({
        fullName,
        mobileNumber,
        dateOfBirth,
        preferredVenue: selectedVenue,
        profileComplete: Boolean(
          fullName.trim() && mobileNumber.trim() && dateOfBirth,
        ),
      });
      setSuccessMessage("Profile saved successfully!");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-[18px] max-w-xl">
      {errorMessage && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-[13px] rounded-[12px]">
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="p-3 bg-green-500/10 border border-green-500/30 text-green-400 text-[13px] rounded-[12px]">
          {successMessage}
        </div>
      )}

      <AuthInput
        label="Full name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
      />

      <div className="flex flex-col gap-1.5">
        <AuthInput
          label="Email"
          value={user?.email || ""}
          disabled
          className="opacity-60 cursor-not-allowed"
        />
        <span className="text-[12px] text-text-secondary">
          Set at registration and cannot be changed
        </span>
      </div>

      <AuthInput
        label="Mobile number"
        placeholder="599123456"
        value={mobileNumber}
        onChange={(e) => setMobileNumber(e.target.value)}
      />

      <AuthInput
        label="Date of birth"
        type="date"
        value={dateOfBirth}
        onChange={(e) => setDateOfBirth(e.target.value)}
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-[12px] font-medium text-text-primary">
          Preferred Venue (Optional)
        </label>
        <select
          value={preferredVenueId}
          onChange={(e) => setPreferredVenueId(e.target.value)}
          className="w-full h-12 px-4 rounded-2xl bg-bg-card text-text-primary text-[14px] outline-none transition-all appearance-none cursor-pointer"
        >
          <option value="">No preferred venue</option>
          {options?.venues.map((venue) => (
            <option key={venue.id} value={venue.id}>
              {venue.name}, {venue.city}
            </option>
          ))}
        </select>
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          disabled={isLoading}
          className="w-40 h-12 bg-color-red hover:bg-color-red/90 text-white rounded-2xl font-medium"
        >
          {isLoading ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </form>
  );
};
