"use client";

import { useLoginForm } from "@/hooks/useLoginForm";
import { AuthInput } from "@/components/ui/AuthInput";
import { Button } from "@/components/ui/Button";
import { LoginFormHeader } from "./LoginFormHeader";

interface LoginFormProps {
  onSwitchToSignUp: () => void;
  onClose: () => void;
}

export const LoginForm = ({ onSwitchToSignUp, onClose }: LoginFormProps) => {
  const { formData, setters, errors, isLoading, handleSubmit } = useLoginForm();

  const isSubmitDisabled =
    !formData.email.trim() || !formData.password.trim() || isLoading;

  return (
    <div>
      <LoginFormHeader onClose={onClose} />

      {errors.generalError && (
        <div className="mb-4 text-body-s font-medium text-color-red bg-tint-red p-3 rounded-xl border border-color-red/20">
          {errors.generalError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
        <AuthInput
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => setters.setEmail(e.target.value)}
          placeholder="example@gmail.com"
          error={errors.fieldErrors.email}
          isValid={!errors.fieldErrors.email && formData.email.includes("@")}
          required
        />

        <AuthInput
          label="Password"
          type="password"
          value={formData.password}
          onChange={(e) => setters.setPassword(e.target.value)}
          placeholder="••••••••"
          error={errors.fieldErrors.password}
          isValid={
            !errors.fieldErrors.password && formData.password.length >= 3
          }
          required
        />

        <Button
          type="submit"
          disabled={isSubmitDisabled}
          size="md"
          className="mt-2 w-full"
        >
          {isLoading ? "Logging in..." : "Log in"}
        </Button>
      </form>

      <div className="mt-5 text-center text-body-s text-text-secondary">
        Don&apos;t have an account?{" "}
        <button
          type="button"
          onClick={onSwitchToSignUp}
          className="text-color-red font-bold hover:underline ml-1 cursor-pointer"
        >
          Sign up
        </button>
      </div>
    </div>
  );
};
