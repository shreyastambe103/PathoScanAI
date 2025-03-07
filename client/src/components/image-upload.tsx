import { useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CardContent } from "@/components/ui/card";
import { Upload, ImagePlus, Info } from "lucide-react";
import { classifyImage } from "@/lib/model";
import AnalysisResult from "./analysis-result";
import type { AnalysisResult as AnalysisResultType } from "@shared/schema";

export default function ImageUpload() {
  const [preview, setPreview] = useState<string>();
  const imageRef = useRef<HTMLImageElement>(null);
  const { toast } = useToast();
  const { register, handleSubmit, reset } = useForm();

  const { mutate, data: result, isPending, reset: resetMutation } = useMutation({
    mutationFn: async (data: { 
      image: string; 
      notes: string;
      classification: { s_aureus: number; e_coli: number; }
    }) => {
      const res = await apiRequest("POST", "/api/analyze", data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Analysis Complete",
        description: "Your sample has been successfully analyzed",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to analyze image. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid File",
        description: "Please upload an image file (JPG, PNG, or GIF)",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = handleSubmit(async (data) => {
    if (!preview || !imageRef.current) return;

    try {
      // Classify the image using our ML model
      const classification = await classifyImage(imageRef.current);

      mutate({
        image: preview.split(",")[1],
        notes: data.notes,
        classification
      });
    } catch (error) {
      toast({
        title: "Classification Error",
        description: "Failed to analyze the image. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleReset = () => {
    setPreview(undefined);
    reset();
    resetMutation();
  };

  return (
    <CardContent>
      {result ? (
        <div className="space-y-4">
          <AnalysisResult result={result as AnalysisResultType} />
          <Button onClick={handleReset} className="w-full">
            Analyze Another Sample
          </Button>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="border-2 border-dashed rounded-lg p-4">
            {preview ? (
              <div className="space-y-4">
                <img
                  ref={imageRef}
                  src={preview}
                  alt="Preview"
                  className="max-h-64 mx-auto rounded"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setPreview(undefined)}
                  className="w-full"
                >
                  <ImagePlus className="mr-2 h-4 w-4" />
                  Choose Different Image
                </Button>
              </div>
            ) : (
              <label className="block cursor-pointer">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/gif"
                  onChange={onFileChange}
                  className="hidden"
                />
                <div className="h-32 flex flex-col items-center justify-center gap-2 text-muted-foreground">
                  <Upload className="h-8 w-8" />
                  <span>Click or drag image to upload</span>
                  <div className="flex items-center gap-1 text-xs">
                    <Info className="h-3 w-3" />
                    <span>Supported formats: JPG, PNG, GIF</span>
                  </div>
                </div>
              </label>
            )}
          </div>

          <Textarea
            placeholder="Additional notes about the sample..."
            {...register("notes")}
          />

          <Button
            type="submit"
            disabled={!preview || isPending}
            className="w-full"
          >
            {isPending ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-background" />
                Analyzing...
              </div>
            ) : (
              "Analyze Sample"
            )}
          </Button>
        </form>
      )}
    </CardContent>
  );
}