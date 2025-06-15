// components/MoodModal.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hook/use-media-querry";
import { cn } from "@/lib/utils";
import { ChevronRight, SmilePlus } from "lucide-react";
import { FC, useState } from "react";

const visualStyles = [
  { name: "Whimsical", src: "/images/visual-style.png" },
  { name: "Serene", src: "/images/visual-style.png" },
  { name: "Melancholic", src: "/images/visual-style.png" },
  { name: "Epic", src: "/images/visual-style.png" },
  { name: "Surreal", src: "/images/visual-style.png" },
  { name: "Dramatic", src: "/images/visual-style.png" },
  { name: "Cozy", src: "/images/visual-style.png" },
  { name: "Ominous", src: "/images/visual-style.png" },
  { name: "Romantic", src: "/images/visual-style.png" },
  { name: "Mystical", src: "/images/visual-style.png" },
  { name: "Uplifting", src: "/images/visual-style.png" },
  { name: "Gritty", src: "/images/visual-style.png" },
  { name: "Futuristic", src: "/images/visual-style.png" },
  { name: "Mournful", src: "/images/visual-style.png" },
  { name: "Energetic", src: "/images/visual-style.png" },
];

interface MoodModalProps {
  onSelect: (value: string) => void;
  value: string;
}

const MoodModal: FC<MoodModalProps> = ({ onSelect, value }) => {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop)
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
          <ModalTrigger value={value} />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Mood</DialogTitle>
          </DialogHeader>
          <VisualGrid onSelect={onSelect} setOpen={setOpen} value={value} />
        </DialogContent>
      </Dialog>
    );
  else
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger>
          <ModalTrigger value={value} />
        </DrawerTrigger>
        <DrawerContent className="p-5">
          <DrawerHeader className="text-left">
            <DrawerTitle>Select Mood</DrawerTitle>
          </DrawerHeader>
          <VisualGrid onSelect={onSelect} setOpen={setOpen} value={value} />
        </DrawerContent>
      </Drawer>
    );
};

export default MoodModal;

const ModalTrigger = ({ value }: { value: string }) => (
  <div className="flex h-10 items-center justify-between rounded-md border border-input bg-white px-3 text-sm text-muted-foreground cursor-pointer">
    <div className="flex gap-2 items-center">
      <SmilePlus className="text-muted-foreground" />
      {value != "" ? value : "Mood"}
    </div>
    <ChevronRight className="text-muted-foreground size-5" />
  </div>
);

interface VisualGrid extends MoodModalProps {
  setOpen: (value: boolean) => void;
}

const VisualGrid = ({ onSelect, setOpen }: VisualGrid) => {
  const [selected, setSelected] = useState<string | null>(null);
  const handleSelect = () => {
    if (selected) {
      onSelect(selected);
      setOpen(false);
    }
  };

  return (
    <>
      {/* <ul className="grid grid-cols-2 2xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 py-4"> */}
      <ul className="flex flex-wrap gap-4 py-4 overflow-y-scroll md:overflow-y-auto px-2 md:px-1">
        {visualStyles.map((style) => (
          <li
            key={style.name}
            onClick={() => setSelected(style.name)}
            className={cn(
              `rounded-md p-2 cursor-pointer transition outline-gray-400 outline-1`,
              selected === style.name && "outline-2 outline-gray-600"
            )}
          >
            {/* <Image
              src={style.src}
              alt={style.name}
              className="rounded-md object-cover aspect-square"
              width={100}
              height={100}
            /> */}
            <p className="text-center text-xs ">{style.name}</p>
          </li>
        ))}
      </ul>
      <Button onClick={handleSelect} disabled={!selected}>
        Select
      </Button>
    </>
  );
};
