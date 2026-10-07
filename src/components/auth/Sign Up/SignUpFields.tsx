"use client";

import { AuthInput } from "@/components/ui/AuthInput";

interface SignUpFieldsProps {
  formData: {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  };
  setters: {
    setUsername: (val: string) => void;
    setEmail: (val: string) => void;
    setPassword: (val: string) => void;
    setConfirmPassword: (val: string) => void;
  };
  fieldErrors: Record<string, string>;
}

export const SignUpFields = ({
  formData,
  setters,
  fieldErrors,
}: SignUpFieldsProps) => {
  const { username, email, password, confirmPassword } = formData;
  const { setUsername, setEmail, setPassword, setConfirmPassword } = setters;

  return (
    <>
      <AuthInput
        label="Username"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="User"
        error={fieldErrors.username}
        isValid={!fieldErrors.username && username.length >= 3}
        required
      />

      <AuthInput
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="example@gmail.com"
        error={fieldErrors.email}
        isValid={!fieldErrors.email && email.includes("@")}
        required
      />

      <div className="grid grid-cols-2 gap-3">
        <AuthInput
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          error={fieldErrors.password}
          isValid={!fieldErrors.password && password.length >= 3}
          required
        />

        <AuthInput
          label="Confirm password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
          error={fieldErrors.password_confirmation}
          isValid={
            !fieldErrors.password_confirmation &&
            confirmPassword.length >= 3 &&
            confirmPassword === password
          }
          required
        />
      </div>
    </>
  );
};
