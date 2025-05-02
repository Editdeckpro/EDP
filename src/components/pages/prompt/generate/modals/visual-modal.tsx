// components/VisualStyleModal.tsx
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
import { ChevronRight, PaintbrushVertical } from "lucide-react";
import Image from "next/image";
import { FC, useState } from "react";

const visualStyles = new Array(15).fill(0).map((_, i) => ({
  name: `style-${i}`,
  src: "/images/visual-style.png", // Replace with your actual image path
}));

interface VisualStyleModalProps {
  onSelect: (value: string) => void;
  value: string;
}

const VisualStyleModal: FC<VisualStyleModalProps> = ({ onSelect, value }) => {
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
            <DialogTitle>Select Visual Style</DialogTitle>
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
            <DrawerTitle>Select Visual Style</DrawerTitle>
          </DrawerHeader>
          <VisualGrid onSelect={onSelect} setOpen={setOpen} value={value} />
        </DrawerContent>
      </Drawer>
    );
};

export default VisualStyleModal;

const ModalTrigger = ({ value }: { value: string }) => (
  <div className="flex h-10 items-center justify-between rounded-md border border-input bg-white px-3 text-sm text-muted-foreground cursor-pointer">
    <div className="flex gap-2 items-center">
      <PaintbrushVertical className="text-muted-foreground" />
      {value != "" ? value : "Visual Styles"}
    </div>
    <ChevronRight className="text-muted-foreground size-5" />
  </div>
);

interface VisualGrid extends VisualStyleModalProps {
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
      <ul className="grid grid-cols-2 2xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 py-4">
        {visualStyles.map((style) => (
          <li
            key={style.name}
            onClick={() => setSelected(style.name)}
            className={`rounded-md border-2 p-1 cursor-pointer transition ${
              selected === style.name ? "border-blue-500" : "border-transparent"
            }`}
          >
            <Image
              src={style.src}
              alt={style.name}
              className="rounded-md object-cover aspect-square"
              width={100}
              height={100}
            />
            <p className="text-center text-xs mt-1">{style.name}</p>
          </li>
        ))}
      </ul>
      <Button onClick={handleSelect} disabled={!selected}>
        Select
      </Button>
    </>
  );
};
