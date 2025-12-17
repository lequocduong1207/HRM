import { useState } from "react";
import { Link } from "react-router";
import { ChevronLeftIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Call API forgot password
    console.log("Email:", email);
    setIsSubmitted(true);
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="w-full max-w-md pt-10 mx-auto">
        <Link
          to="/signin"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon className="size-5" />
          Back to sign in
        </Link>
      </div>

      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          {!isSubmitted ? (
            <>
              <div className="mb-5 sm:mb-8">
                <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                  Forgot Password?
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No worries, we'll send you reset instructions.
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  {/* Email */}
                  <div>
                    <Label>
                      Email<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div>
                    <button type="submit" className="w-full">
                      <Button className="w-full" size="sm">
                        Reset Password
                      </Button>
                    </button>
                  </div>
                </div>
              </form>
            </>
          ) : (
            <>
              {/* Success Message */}
              <div className="mb-5 text-center sm:mb-8">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-success-50 dark:bg-success-500/10">
                  <svg
                    className="w-8 h-8 text-success-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                  Check your email
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  We sent a password reset link to
                </p>
                <p className="mt-1 text-sm font-medium text-gray-800 dark:text-white/90">
                  {email}
                </p>
              </div>

              <div className="space-y-4">
                <p className="text-sm text-center text-gray-500 dark:text-gray-400">
                  Didn't receive the email?{" "}
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="font-medium text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    Click to resend
                  </button>
                </p>
              </div>
            </>
          )}

          <div className="mt-8">
            <Link
              to="/signin"
              className="flex items-center justify-center text-sm font-medium text-gray-700 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <ChevronLeftIcon className="size-4 mr-1" />
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
