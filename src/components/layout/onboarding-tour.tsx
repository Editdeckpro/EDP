"use client";
import { useTour } from "@/context/OnboardingTourContext";
import Image from "next/image";
import React, { FC, useEffect, useState } from "react";
import type { CallBackProps, Step } from "react-joyride";
import Joyride, { EVENTS, STATUS } from "react-joyride";
import { useRouter, useSearchParams } from "next/navigation";
import { useIsMobile } from "@/hook/use-is-mobile";

interface OnboardingTourProps {
  children: React.ReactNode;
}

const OnboardingTour: FC<OnboardingTourProps> = ({ children }) => {
  const { startTour, setStartTour, loaded, handleTourEnd, progress, setProgress, handleStartTour } = useTour();
  const [run, setRun] = useState(startTour);
  const router = useRouter();
  const searchParams = useSearchParams();
  const isOnboarding = searchParams.get("onboarding") || "";
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isOnboarding && progress === 0) {
      Promise.resolve().then(() => {
        if (!localStorage.getItem("isShowedOnboardTour")) {
          localStorage.setItem("isShowedOnboardTour", "true");
          handleStartTour(); // also safely defers the state update
        }
      });
    }
  }, [isOnboarding, handleStartTour, progress]);

  const steps: Step[] = [
    {
      target: "body",
      placement: "center",
      styles: { options: { width: 700 } },
      content: <StepOneContent />,
    },
    {
      target: isMobile ? "body" : "#step-1",
      placement: isMobile ? "center" : "top",
      styles: { options: { width: 320 } },
      content: <StepTwoContent isMobile={isMobile} />,
    },
    {
      target: isMobile ? "body" : "#step-2",
      placement: isMobile ? "center" : "bottom",
      styles: { options: { width: 320 } },
      content: <StepThreeContent isMobile={isMobile} />,
    },
    {
      target: isMobile ? "body" : "#step-3",
      placement: isMobile ? "center" : "right",
      styles: { options: { width: 320 } },
      content: <StepFourContent isMobile={isMobile} />,
    },
  ];

  useEffect(() => {
    if (startTour) {
      setRun(true);
    }
  }, [startTour]);

  useEffect(() => {
    if (run) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [run]);

  const handleJoyrideCallback = async (data: CallBackProps) => {
    const { status, type, index } = data;

    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      setRun(false);
      setStartTour(false);
      handleTourEnd();
      setProgress(0);
      setTimeout(() => {
        router.replace("/");
      }, 2000);
    } else if (type === EVENTS.STEP_BEFORE) {
      setProgress(index + 1);
    }
  };

  if (!loaded) return null;

  if (startTour) {
    return (
      <>
        <Joyride
          continuous
          callback={handleJoyrideCallback}
          run={run}
          steps={steps}
          disableScrolling
          // scrollToFirstStep
          debug
          showSkipButton
          disableOverlayClose
          disableCloseOnEsc
          hideCloseButton
          styles={{
            // overlay: {
            //   border: "6px solid lightblue",
            // },
            // spotlight: {
            //   border: "2px solid lightblue",
            // },
            buttonClose: {
              marginTop: "5px",
              marginRight: "5px",
              width: "12px",
            },
            buttonNext: {
              outline: "2px solid transparent",
              outlineOffset: "2px",
              //   backgroundColor: "#1c7bd4",
              borderRadius: "5px",
              //   padding: "8px 16px",
              color: "#FFFFFF",
            },
            buttonSkip: {
              color: "#A1A1A1",
            },
            tooltipFooter: {
              margin: "0px 16px 10px 10px",
            },
            buttonBack: {
              outline: "2px solid transparent",
              outlineOffset: "2px",
            },
            options: {
              zIndex: 100,
              arrowColor: "#f4f4f4",
              backgroundColor: "#f4f4f4",
              textColor: "#000000",
              overlayColor: "rgba(0, 0, 0, 0.4)",
              primaryColor: "#3E4EBA",
            },
          }}
          locale={{
            back: "←",
            close: "Close",
            last: "Get start",
            next: "→",
            skip: "Skip",
          }}
        />
        {children}
      </>
    );
  } else {
    return <>{children}</>;
  }
};

interface IStep {
  isMobile: boolean;
}

const StepOneContent = () => {
  const { progress, totalSteps } = useTour(); // from context or props
  return (
    <div className="p-3 z-50">
      <div className="mt-10 w-full flex items-center justify-center">
        <Image src="/images/logo.jpg" alt="Logo" width={150} height={100} priority />
      </div>
      <p className="mt-6 text-2xl font-bold">EditDeck Pro Guide</p>
      <p className="mt-6 mb-8 text-md text-foreground">
        This is your EDP Dashboard, where recently generated images appear and where you can create new images.
      </p>
      <div className="mt-4 border-b border-muted" />
      <div className="text-sm text-neutral-400 mt-4">
        {progress} of {totalSteps}
      </div>
    </div>
  );
};

const StepTwoContent = ({ isMobile }: IStep) => {
  const { progress, totalSteps } = useTour(); // from context or props
  return (
    <div className="mb-2 flex flex-col gap-4 px-2 text-left">
      {/* <p className="mr-4 text-base font-bold">Support section</p> */}
      {isMobile ? (
        <p className="text-sm text-foreground text-center">
          Need help or have questions? Check out the <strong>FAQs</strong> and <strong>Support</strong> options in the
          sidebar menu.
        </p>
      ) : (
        <p className="mr-2 text-sm text-foreground text-center">If you have any questions, check here first!</p>
      )}

      <div className="absolute bottom-[30px] left-[38%] text-sm text-neutral-400">
        {progress} of {totalSteps}
      </div>
    </div>
  );
};

const StepThreeContent = ({ isMobile }: IStep) => {
  const { progress, totalSteps } = useTour(); // from context or props
  return (
    <div className="mb-4 flex flex-col gap-4 px-2 text-left">
      {/* <p className="mr-4 text-base font-bold">Support section</p> */}
      {isMobile ? (
        <p className="text-sm text-foreground text-center">
          Use the <strong>Upload</strong> button in the sidebar to start editing your images instantly.
        </p>
      ) : (
        <p className="mr-2 text-sm text-foreground text-center">Click here to upload an image.</p>
      )}

      <div className="absolute bottom-[30px] left-[38%] text-sm text-neutral-400">
        {progress} of {totalSteps}
      </div>
    </div>
  );
};

const StepFourContent = ({ isMobile }: IStep) => {
  const { progress, totalSteps } = useTour(); // from context or props
  return (
    <div className="my-2 flex flex-col gap-4 px-2 text-left">
      {/* <p className="mr-4 text-base font-bold">Support section</p> */}
      {isMobile ? (
        <p className="text-sm text-foreground text-center">
          Tap <strong>Generate Now</strong> to bring your design to life. You’re all set!
        </p>
      ) : (
        <p className="mr-2 text-sm text-foreground text-center">{"Press 'Generate Now' to create images now!"}</p>
      )}

      <div className="absolute bottom-[30px] left-[38%] text-sm text-neutral-400">
        {progress} of {totalSteps}
      </div>
    </div>
  );
};

export default OnboardingTour;
