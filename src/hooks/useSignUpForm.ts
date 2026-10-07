"use client";

import { useState, FormEvent } from "react";
import { useAuth } from "@/context/AuthContext";
import { ApiValidationError } from "@/types/auth";

export const useSignUpForm = () => {
  const { signup } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAvatarChange = (file: File) => {
    setAvatar(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFieldErrors({});
    setGeneralError(null);
    setIsLoading(true);

    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("password_confirmation", confirmPassword);
    if (avatar) {
      formData.append("avatar", avatar);
    }

    try {
      await signup(formData);
    } catch (err: unknown) {
      const apiError = err as ApiValidationError;
      console.error("SignUp Error:", apiError);

      if (apiError?.errors) {
        const mappedErrors: Record<string, string> = {};
        Object.keys(apiError.errors).forEach((key) => {
          const messages = apiError.errors?.[key];
          if (messages && messages.length > 0) {
            mappedErrors[key] = messages[0];
          }
        });
        setFieldErrors(mappedErrors);
      } else {
        setGeneralError(
          apiError?.message || "Failed to register. Please try again.",
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData: {
      username,
      email,
      password,
      confirmPassword,
      avatarPreview,
    },
    setters: {
      setUsername,
      setEmail,
      setPassword,
      setConfirmPassword,
      setGeneralError,
      handleAvatarChange,
    },
    errors: {
      fieldErrors,
      generalError,
    },
    isLoading,
    handleSubmit,
  };
};
