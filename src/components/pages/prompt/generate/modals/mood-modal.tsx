// components/MoodModal.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { useMediaQuery } from "@/hook/use-media-querry";
import { cn } from "@/lib/utils";
import { ChevronRight, SmilePlus } from "lucide-react";
import { Dispatch, FC, SetStateAction, useState } from "react";

const moods = [
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
  onSelect: (value: string[]) => void;
  value: string[];
  customMoods: string[];
  setCustomMoods: Dispatch<SetStateAction<string[]>>;
}

const MoodModal: FC<MoodModalProps> = ({ onSelect, value, setCustomMoods, customMoods }) => {
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
          <VisualGrid
            onSelect={onSelect}
            setOpen={setOpen}
            value={value}
            setCustomMoods={setCustomMoods}
            customMoods={customMoods}
          />
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
          <VisualGrid
            onSelect={onSelect}
            setOpen={setOpen}
            value={value}
            setCustomMoods={setCustomMoods}
            customMoods={customMoods}
          />
        </DrawerContent>
      </Drawer>
    );
};

export default MoodModal;

const ModalTrigger = ({ value }: { value: string[] }) => (
  <div className="flex h-10 items-center justify-between rounded-md border border-input bg-white px-3 text-sm text-muted-foreground cursor-pointer">
    <div className="flex gap-2 items-center">
      <span>
        <SmilePlus className="text-muted-foreground" />
      </span>
      <span className="line-clamp-1 text-left">{value.length > 0 ? value.join(", ") : "Mood"}</span>
    </div>
    <ChevronRight className="text-muted-foreground size-5" />
  </div>
);

interface VisualGrid extends MoodModalProps {
  setOpen: (value: boolean) => void;
}

const VisualGrid = ({ onSelect, setOpen, value, setCustomMoods, customMoods }: VisualGrid) => {
  const [selected, setSelected] = useState<string[]>(value);
  const [customMood, setCustomMood] = useState("");

  const handleAddCustomMood = () => {
    const trimmed = customMood.trim();
    if (trimmed !== "" && !customMoods.includes(trimmed) && !moods.find((v) => v.name === trimmed)) {
      setCustomMoods((prev) => [...prev, trimmed]);
      setSelected((prev) => [...prev, trimmed]);
      setCustomMood("");
    }
  };

  const toggleSelection = (moodName: string) => {
    setSelected((prev) => (prev.includes(moodName) ? prev.filter((s) => s !== moodName) : [...prev, moodName]));
  };

  const handleSelect = () => {
    if (selected.length > 0) {
      onSelect(selected);
      setOpen(false);
    }
  };

  return (
    <>
      {/* Custom mood Input */}
      <div className="flex items-center gap-2">
        <Input
          placeholder="Enter custom mood"
          value={customMood}
          onChange={(e) => setCustomMood(e.target.value)}
          className="flex-1"
        />
        <Button
          type="button"
          onClick={handleAddCustomMood}
          disabled={customMood.trim() === "" || selected.includes(customMood.trim())}
        >
          Add
        </Button>
      </div>

      {/* <ul className="grid grid-cols-2 2xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 py-4"> */}
      <ul className="flex flex-wrap gap-4 py-4 overflow-y-scroll md:overflow-y-auto px-2 md:px-1">
        {[...customMoods, ...moods.map((m) => m.name)].map((style) => (
          <li
            key={style}
            onClick={() => toggleSelection(style)}
            className={cn(
              `rounded-md p-2 cursor-pointer transition outline-gray-400 outline-1`,
              selected.includes(style) && "outline-2 outline-gray-600"
            )}
          >
            {/* <Image
              src={style.src}
              alt={style.name}
              className="rounded-md object-cover aspect-square"
              width={100}
              height={100}
            /> */}
            <p className="text-center text-xs ">{style}</p>
          </li>
        ))}
      </ul>
      <Button onClick={handleSelect} disabled={selected.length === 0}>
        {selected.length > 0 ? `Selected (${selected.length}/${moods.length})` : "Select moods"}
      </Button>
    </>
  );
};
