"use client";

import { Button } from "@/components/ui/Button";
import { AvatarUpload } from "../AvatarUpload";
import { useSignUpForm } from "@/hooks/useSignUpForm";
import { SignUpFormHeader } from "./SignUpFormHeader";
import { SignUpFields } from "./SignUpFields";
import { SignUpFormFooter } from "./SignUpFormFooter";

interface SignUpFormProps {
  onSwitchToLogin: () => void;
  onClose: () => void;
}

export const SignUpForm = ({ onSwitchToLogin, onClose }: SignUpFormProps) => {
  const { formData, setters, errors, isLoading, handleSubmit } =
    useSignUpForm();

  const isSubmitDisabled =
    !formData.username.trim() ||
    !formData.email.trim() ||
    !formData.password.trim() ||
    !formData.confirmPassword.trim() ||
    isLoading;

  return (
    <div>
      <SignUpFormHeader onClose={onClose} />

      {errors.generalError && (
        <div className="mb-4 text-body-s font-medium text-color-red bg-tint-red p-3 rounded-xl border border-color-red/20">
          {errors.generalError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
        <AvatarUpload
          preview={formData.avatarPreview}
          onChange={setters.handleAvatarChange}
          onError={setters.setGeneralError}
        />

        <SignUpFields
          formData={formData}
          setters={setters}
          fieldErrors={errors.fieldErrors}
        />

        <Button
          type="submit"
          disabled={isSubmitDisabled}
          size="md"
          className="mt-2 w-full"
        >
          {isLoading ? "Signing up..." : "Sign up"}
        </Button>
      </form>

      <SignUpFormFooter onSwitchToLogin={onSwitchToLogin} />
    </div>
  );
};
