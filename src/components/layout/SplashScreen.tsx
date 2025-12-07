"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { cn } from "@/lib/utils";

const SPLASH_STORAGE_KEY = "gorbagana-splash-seen";

export function SplashScreen() {
  const [isOpen, setIsOpen] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    const hasSeenSplash = localStorage.getItem(SPLASH_STORAGE_KEY);
    if (!hasSeenSplash) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem(SPLASH_STORAGE_KEY, "true");
    setIsOpen(false);
  };
  
  useEffect(() => {
    if(isImageLoaded) {
      const timer = setTimeout(() => {
        setShowDialog(true);
      }, 1500); // Wait for a moment before showing dialog
      return () => clearTimeout(timer);
    }
  }, [isImageLoaded]);

  const splashImage = PlaceHolderImages.find(p => p.id === 'splash-origin');
  if (!splashImage) return null;

  if (!isOpen) return null;

  return (
    <>
      <div className={cn(
        "fixed inset-0 z-[200] bg-background flex items-center justify-center transition-opacity duration-500",
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )}>
        <div className="relative w-[90vw] max-w-2xl aspect-[9/10] rounded-lg overflow-hidden shadow-2xl shadow-primary/20">
            <Image 
                src={splashImage.imageUrl}
                alt={splashImage.description}
                fill
                className="object-contain"
                data-ai-hint={splashImage.imageHint}
                priority
                onLoad={() => setIsImageLoaded(true)}
            />
        </div>
      </div>
      <AlertDialog open={showDialog && isOpen} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl text-primary">The Birth of Gorbagana</AlertDialogTitle>
            <AlertDialogDescription className="pt-4 text-base text-foreground">
              Gorbagana is a brand new Blockchain Network forked from Solana after an online debate between Gorbagana founder @lex_node and Solana founder @aeyakovenko.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button onClick={handleClose} className="w-full">Enter the Meme Chain</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
