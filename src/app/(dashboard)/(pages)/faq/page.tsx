"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";

const faqData = [
  {
    title: "General Questions",
    questions: [
      {
        question: "What is Edit Deck Pro ?",
        answer:
          "Edit Deck Pro is an AI-powered platform that helps creators design professional-quality graphics for album covers, social media, Shopify stores, and more. No design skills required—just upload, describe, and let AI do the rest!",
      },
      {
        question: "Who is this platform for?",
        answer:
          "Our platform is designed for emerging artists, small business owners, and creators who need stunning visuals quickly and affordably. Whether you’re an independent musician, an entrepreneur, or an influencer, we’ve got you covered.",
      },
      {
        question: "How does it work?",
        answer:
          'It’s simple!\nUpload your reference image or inspiration.\nDescribe your vision (e.g., "edgy, black-and-white album cover with bold text").\nGenerate and Download.',
      },
    ],
  },
  {
    title: "Pricing and Plans",
    questions: [
      {
        question: "What are the available subscription plans?",
        answer:
          "We offer two plans:\nRegular Plan ($29/month): 1 AI-generated image at a time, standard resolution, basic customization tools.\nPro Plan ($70/month): Up to 3 AI-generated images simultaneously, high-definition output, priority support, and advanced editing features.",
      },
      {
        question: "Can I try the platform for free?",
        answer:
          "We currently do not offer a free trial, but we’re confident you’ll love what Edit Deck Pro can create for you!",
      },
      {
        question: "Can I cancel my subscription anytime?",
        answer:
          "Absolutely. You can cancel your subscription anytime from your account dashboard, and you won’t be billed for the next billing cycle.",
      },
    ],
  },
  {
    title: "Technical Questions",
    questions: [
      {
        question: "What file formats do the designs come in?",
        answer:
          "All designs are available in industry-standard formats such as PNG, JPG, and PDF. Pro Plan users can also export in high-resolution formats ideal for print.",
      },
      {
        question: "Can I edit the designs after they’re generated?",
        answer:
          "Yes! Our built-in text editor allows you to adjust colors, fonts, layouts, and more to perfectly match your vision.",
      },
      {
        question: "What happens to my designs after my subscription ends?",
        answer:
          "You’ll still have access to any designs you’ve already downloaded. However, creating or editing new designs will require an active subscription.",
      },
    ],
  },
  {
    title: "Support and Assistance",
    questions: [
      {
        question: "What if I need help using the platform?",
        answer:
          "Our support team is here for you! Reach out to us via email at support@editdeckpro.com. Pro Plan users also get access to priority support.",
      },
      {
        question: "Can I request custom features or improvements?",
        answer:
          "Absolutely. We love hearing from our users! Send your suggestions to support@editdeckpro.com.",
      },
    ],
  },
  {
    title: "Security and Privacy",
    questions: [
      {
        question: "Is my data secure?",
        answer:
          "Yes, we prioritize your privacy and security. All data is encrypted and stored securely. For more details, please review our [Privacy Policy].",
      },
      {
        question: "Who owns the rights to the designs I create?",
        answer:
          "You do! All designs generated on our platform are yours to use however you like.",
      },
    ],
  },
];

export default function Page() {
  return (
    <div className="w-full space-y-10">
      <h2 className="text-xl font-bold mb-4">
        Got Questions? We&apos;ve Got Answers!
      </h2>
      <Separator className="my-8" />
      {faqData.map((section, sectionIndex) => (
        <div key={section.title}>
          <h2 className="text-xl font-semibold mb-4">{section.title}</h2>
          <Accordion type="single" collapsible className="w-full">
            {section.questions.map((q, questionIndex) => (
              <AccordionItem
                key={`item-${sectionIndex}-${questionIndex}`}
                value={`item-${sectionIndex}-${questionIndex}`}
              >
                <AccordionTrigger>{q.question}</AccordionTrigger>
                <AccordionContent>
                  {q.answer.split("\n").map((line, i) => (
                    <p key={i} className="mb-2">
                      {line}
                    </p>
                  ))}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          {sectionIndex !== faqData.length - 1 && (
            <Separator className="my-8" />
          )}
        </div>
      ))}
    </div>
  );
}
