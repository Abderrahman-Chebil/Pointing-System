"use client";

import type React from "react";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { showSuccessToast, showErrorToast } from '@/lib/toast';;
import { Upload, Loader2 } from "lucide-react";
import { createMedicalRecord } from "@/utils/api";

const RECORD_TYPES = [
  { value: "bone", label: "X-Ray" },
  { value: "pneumonia", label: "Pneumonia" },
  { value: "blood-test", label: "Blood Test" },
  { value: "urinalysis", label: "Urinalysis" },
  { value: "glucose", label: "Blood Glucose" },
  { value: "cholesterol", label: "Cholesterol Panel" },
  { value: "thyroid", label: "Thyroid Panel" },
  { value: "complete-blood-count", label: "Complete Blood Count" },
  { value: "liver-function", label: "Liver Function Test" },
  { value: "kidney-function", label: "Kidney Function Test" },
];

interface UploadMedicalRecordProps {
  appointmentId: string;
  onSuccess?: () => void;
}

export function UploadMedicalRecord({
  appointmentId,
  onSuccess,
}: UploadMedicalRecordProps) {
  ;
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    type: "",
    description: "",
    image: null as File | null,
  });

  const handleTypeChange = (value: string) => {
    setFormData((prev) => ({ ...prev, type: value }));
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, description: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, image: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.type || !formData.description || !formData.image) {
      showSuccessToast({
        title: "Missing information",
        description: "Please fill in all fields and select an image",
      });
      return;
    }

    setIsUploading(true);
    try {
      await createMedicalRecord({
        type: formData.type,
        description: formData.description,
        image: formData.image,
        appointment: appointmentId,
      });

      showSuccessToast({
        title: "Medical record uploaded",
        description: "The medical record has been uploaded successfully",
      });

      // Reset form
      setFormData({
        type: "",
        description: "",
        image: null,
      });

      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      showErrorToast({
        title: "Upload failed",
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Medical Record</CardTitle>
        <CardDescription>
          Upload a medical record for this appointment
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="record-type">Record Type</Label>
            <Select value={formData.type} onValueChange={handleTypeChange}>
              <SelectTrigger id="record-type">
                <SelectValue placeholder="Select record type" />
              </SelectTrigger>
              <SelectContent>
                {RECORD_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter a description of the medical record"
              value={formData.description}
              onChange={handleDescriptionChange}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Upload Image</Label>
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <div className="mx-auto w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Upload className="h-5 w-5 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground mt-1 mb-4">
                {formData.image
                  ? formData.image.name
                  : "Drag and drop your image file, or click to browse"}
              </p>
              <Input
                id="image"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById("image")?.click()}
              >
                Browse Files
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isUploading} className="w-full">
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              "Upload Medical Record"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
