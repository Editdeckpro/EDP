"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useMediaQuery } from "@/hook/use-media-querry";
import { cn } from "@/lib/utils"; // Optional: to handle class merging
import { ChevronRight, Palette } from "lucide-react";
import { FC, useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

const colors = [
  "#B71C1C",
  "#C62828",
  "#E57373",
  "#EF9A9A",
  "#D32F2F",
  "#F44336",
  "#F57C00",
  "#FBC02D",
  "#FFD600",
  "#FFEB3B",
  "#FF9800",
  "#FF5722",
  "#4CAF50",
  "#388E3C",
  "#81C784",
  "#C8E6C9",
  "#1B5E20",
  "#2E7D32",
  "#1976D2",
  "#2196F3",
  "#64B5F6",
  "#90CAF9",
  "#0D47A1",
  "#1565C0",
  "#6A1B9A",
  "#8E24AA",
  "#BA68C8",
  "#E1BEE7",
  "#AD1457",
  "#C2185B",
];

interface ColorPaletteModalProps {
  value: string;
  onSelect: (color: string) => void;
}

const ColorPaletteModal: FC<ColorPaletteModalProps> = ({ value, onSelect }) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [open, setOpen] = useState(false);

  if (isDesktop)
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
          <ModalTrigger value={value} />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Color Palette</DialogTitle>
            <ColorsGrid onSelect={onSelect} setOpen={setOpen} value={value} />
          </DialogHeader>
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
            <DrawerTitle>Select Color Palette</DrawerTitle>
          </DrawerHeader>
          <ColorsGrid onSelect={onSelect} setOpen={setOpen} value={value} />
        </DrawerContent>
      </Drawer>
    );
};

export default ColorPaletteModal;

const ModalTrigger = ({ value }: { value: string }) => (
  <div className="flex h-10 items-center justify-between rounded-md border border-input bg-white px-3 text-sm text-muted-foreground cursor-pointer">
    <div className="flex gap-2 items-center">
      <Palette className="text-muted-foreground" />
      {value != "" ? value : "Color Palette"}
    </div>
    <ChevronRight className="text-muted-foreground size-5" />
  </div>
);

interface ColorsGrid {
  onSelect: (value: string) => void;
  setOpen: (value: boolean) => void;
  value: string;
}

const ColorsGrid = ({ onSelect, setOpen, value }: ColorsGrid) => {
  const [selected, setSelected] = useState<string>(value);

  const handleSelect = () => {
    onSelect(selected);
    setOpen(false);
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <div
          className="w-6 h-6 rounded-full border"
          style={{ backgroundColor: selected }}
        />
        <Input
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          maxLength={7}
          className="w-full"
          placeholder="#COLORCODE"
        />
      </div>

      <ul className="grid grid-cols-2 2xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 py-4 max-h-64 overflow-y-auto">
        {colors.map((color) => (
          <li key={color}>
            <button
              type="button"
              onClick={() => setSelected(color)}
              className={cn(
                "w-10 h-10 rounded-sm border-2 transition",
                selected === color ? "border-black" : "border-transparent"
              )}
              style={{ backgroundColor: color }}
            />
          </li>
        ))}
      </ul>

      <Button className="w-full" onClick={handleSelect}>
        Select
      </Button>
    </>
  );
};
