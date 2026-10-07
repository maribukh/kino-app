"use client";

import { useState, FormEvent } from "react";
import { useAuth } from "@/context/AuthContext";
import { ApiValidationError } from "@/types/auth";

export const useLoginForm = () => {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFieldErrors({});
    setGeneralError(null);
    setIsLoading(true);

    try {
      await login({ email, password });
    } catch (err: unknown) {
      const apiError = err as ApiValidationError;
      console.error("Login Error:", apiError);

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
          apiError?.message || "Invalid credentials. Please try again.",
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData: {
      email,
      password,
    },
    setters: {
      setEmail,
      setPassword,
      setGeneralError,
    },
    errors: {
      fieldErrors,
      generalError,
    },
    isLoading,
    handleSubmit,
  };
};
