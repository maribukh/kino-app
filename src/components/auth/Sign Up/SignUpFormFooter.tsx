interface SignUpFormFooterProps {
  onSwitchToLogin: () => void;
}

export const SignUpFormFooter = ({
  onSwitchToLogin,
}: SignUpFormFooterProps) => {
  return (
    <div className="mt-5 text-center text-body-s text-text-secondary">
      Already have an account?{" "}
      <button
        type="button"
        onClick={onSwitchToLogin}
        className="text-color-red font-bold hover:underline ml-1 cursor-pointer"
      >
        Log in
      </button>
    </div>
  );
};
