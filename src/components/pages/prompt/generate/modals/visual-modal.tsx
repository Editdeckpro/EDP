// components/VisualStyleModal.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { useMediaQuery } from "@/hook/use-media-querry";
import { cn } from "@/lib/utils";
import { ChevronRight, PaintbrushVertical } from "lucide-react";
import { FC, useState } from "react";

const visualStyles = [
  { name: "Photo", src: "/images/visual-style.png" },
  { name: "Illustration", src: "/images/visual-style.png" },
  { name: "3D Render", src: "/images/visual-style.png" },
  { name: "Typography", src: "/images/visual-style.png" },
  { name: "Cinematic", src: "/images/visual-style.png" },
  { name: "Poster", src: "/images/visual-style.png" },
  { name: "Painting", src: "/images/visual-style.png" },
  { name: "Fashion", src: "/images/visual-style.png" },
  { name: "Product", src: "/images/visual-style.png" },
  { name: "Anime", src: "/images/visual-style.png" },
  { name: "Architecture", src: "/images/visual-style.png" },
  { name: "Dark fantasy", src: "/images/visual-style.png" },
  { name: "Vibrant", src: "/images/visual-style.png" },
  { name: "Graffiti", src: "/images/visual-style.png" },
  { name: "Portrait", src: "/images/visual-style.png" },
  { name: "Wildlife", src: "/images/visual-style.png" },
  { name: "Conceptual art", src: "/images/visual-style.png" },
  { name: "Ukiyo-e", src: "/images/visual-style.png" },
];

interface VisualStyleModalProps {
  onSelect: (value: string[]) => void;
  value: string[];
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

const ModalTrigger = ({ value }: { value: string[] }) => (
  <div className="flex h-10 items-center justify-between rounded-md border border-input bg-white px-3 text-sm text-muted-foreground cursor-pointer">
    <div className="flex gap-2 items-center">
      <span>
        <PaintbrushVertical className="text-muted-foreground" />
      </span>
      <span className="line-clamp-1 text-left">{value.length > 0 ? value.join(", ") : "Visual Styles"}</span>
    </div>
    <ChevronRight className="text-muted-foreground size-5" />
  </div>
);

interface VisualGrid extends VisualStyleModalProps {
  setOpen: (value: boolean) => void;
}

const VisualGrid = ({ onSelect, setOpen, value }: VisualGrid) => {
  const [selected, setSelected] = useState<string[]>(value);
  // const MAX_SELECTION = 4;

  const toggleSelection = (styleName: string) => {
    if (selected.includes(styleName)) {
      setSelected(selected.filter((name) => name !== styleName));
    } else {
      // if (selected.length < MAX_SELECTION) {
      setSelected([...selected, styleName]);
      // }
    }
  };

  const handleSelect = () => {
    if (selected.length > 0) {
      onSelect(selected); // Pass array
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
            onClick={() => toggleSelection(style.name)}
            className={cn(
              `rounded-md p-2 outline-1 outline-gray-400 cursor-pointer transition`,
              selected.includes(style.name) && "outline-gray-600 outline-2 "
            )}
          >
            {/* <Image
              src={style.src}
              alt={style.name}
              className="rounded-md object-cover aspect-square"
              width={100}
              height={100}
            /> */}
            <p className="text-center text-xs">{style.name}</p>
          </li>
        ))}
      </ul>
      <Button onClick={handleSelect} disabled={selected.length < 4}>
        {selected.length >= 4 ? `Selected (${selected.length}/${visualStyles.length})` : "Select styles"}
      </Button>
    </>
  );
};
