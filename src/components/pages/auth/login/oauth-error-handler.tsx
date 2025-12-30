"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { OAuthErrorModal } from "./oauth-error-modal";

export function OAuthErrorHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [errorType, setErrorType] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const error = searchParams.get("error");
    const message = searchParams.get("message");

    if (error) {
      // Decode message if provided
      const decodedMessage = message ? decodeURIComponent(message) : null;
      
      setErrorType(error);
      setErrorMessage(decodedMessage);
      setShowModal(true);

      // Remove error params from URL
      const params = new URLSearchParams(searchParams.toString());
      params.delete("error");
      params.delete("message");
      const newSearch = params.toString();
      router.replace(newSearch ? `/login?${newSearch}` : "/login", { scroll: false });
    }
  }, [searchParams, router]);

  const handleCloseModal = () => {
    setShowModal(false);
    setErrorType(null);
    setErrorMessage(null);
  };

  return (
    <OAuthErrorModal
      open={showModal}
      onOpenChange={handleCloseModal}
      errorType={errorType}
      message={errorMessage}
    />
  );
}

