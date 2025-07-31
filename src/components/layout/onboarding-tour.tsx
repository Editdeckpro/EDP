"use client";
import { useTour } from "@/context/OnboardingTourContext";
import Image from "next/image";
import React, { FC, useEffect, useState } from "react";
import type { CallBackProps, Step } from "react-joyride";
import Joyride, { EVENTS, STATUS } from "react-joyride";

interface OnboardingTourProps {
  children: React.ReactNode;
}

const OnboardingTour: FC<OnboardingTourProps> = ({ children }) => {
  const { startTour, setStartTour, loaded, handleTourEnd, setProgress } = useTour();

  const [run, setRun] = useState(startTour);

  const steps: Step[] = [
    {
      target: "body",
      placement: "center",
      styles: { options: { width: 700 } },
      content: <StepOneContent />,
    },
    {
      target: "#step1",
      placement: "top",
      styles: { options: { width: 320 } },
      content: <StepTwoContent />,
    },
    {
      target: "#step2",
      placement: "bottom",
      styles: { options: { width: 320 } },
      content: <StepThreeContent />,
    },
    {
      target: "#step3",
      placement: "right",
      styles: { options: { width: 320 } },
      content: <StepFourContent />,
    },
  ];

  useEffect(() => {
    if (startTour) {
      setRun(true);
    }
  }, [startTour]);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, type, index } = data;

    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      setRun(false);
      setStartTour(false);
      handleTourEnd();
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
          scrollToFirstStep
          debug
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
          //   stepIndex={stepIndex}
          //   showProgress
          showSkipButton
          //   disableOverlayClose
          //   disableCloseOnEsc
          //   spotlightPadding={10}
          //   hideCloseButton={false}
        />
        {children}
      </>
    );
  } else {
    return <>{children}</>;
  }
};

const StepOneContent = () => {
  const { progress, totalSteps } = useTour(); // from context or props
  return (
    <div className="p-3">
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

const StepTwoContent = () => {
  const { progress, totalSteps } = useTour(); // from context or props
  return (
    <div className="mb-2 flex flex-col gap-4 px-2 text-left">
      {/* <p className="mr-4 text-base font-bold">Support section</p> */}
      <p className="mr-2 text-sm text-foreground text-center">If you have any questions, check here first!</p>
      <div className="absolute bottom-[30px] left-[38%] text-sm text-neutral-400">
        {progress} of {totalSteps}
      </div>
    </div>
  );
};

const StepThreeContent = () => {
  const { progress, totalSteps } = useTour(); // from context or props
  return (
    <div className="mb-4 flex flex-col gap-4 px-2 text-left">
      {/* <p className="mr-4 text-base font-bold">Support section</p> */}
      <p className="mr-2 text-sm text-foreground text-center">Click here to upload an image.</p>
      <div className="absolute bottom-[30px] left-[38%] text-sm text-neutral-400">
        {progress} of {totalSteps}
      </div>
    </div>
  );
};

const StepFourContent = () => {
  const { progress, totalSteps } = useTour(); // from context or props
  return (
    <div className="my-2 flex flex-col gap-4 px-2 text-left">
      {/* <p className="mr-4 text-base font-bold">Support section</p> */}
      <p className="mr-2 text-sm text-foreground text-center">{"Press 'Generate Now' to create images now!"}</p>
      <div className="absolute bottom-[30px] left-[38%] text-sm text-neutral-400">
        {progress} of {totalSteps}
      </div>
    </div>
  );
};

export default OnboardingTour;
