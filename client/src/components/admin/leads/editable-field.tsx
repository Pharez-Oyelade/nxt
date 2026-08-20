import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Edit2, Check, X } from "lucide-react";

interface EditableFieldProps {
  label: string;
  value: string;
  field: string;
  onSave: (field: string, newValue: string) => Promise<void>;
  type?: "text" | "email" | "select";
  options?: { label: string; value: string }[];
}

export function EditableField({
  label,
  value,
  field,
  onSave,
  type = "text",
  options = [],
}: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  const handleSave = async () => {
    if (currentValue === value) {
      setIsEditing(false);
      return;
    }
    
    setIsSaving(true);
    try {
      await onSave(field, currentValue);
      setIsEditing(false);
    } catch (error) {
      // Revert on error
      setCurrentValue(value);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setCurrentValue(value);
    setIsEditing(false);
  };

  const displayValue = () => {
    if (type === "select") {
      return options.find(o => o.value === value)?.label || value;
    }
    return value;
  };

  return (
    <div className="flex flex-col gap-1.5 group">
      <label className="text-sm font-medium text-muted-foreground">{label}</label>
      
      {isEditing ? (
        <div className="flex items-center gap-2">
          {type === "select" ? (
            <select
              value={currentValue}
              onChange={(e) => setCurrentValue(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              disabled={isSaving}
            >
              {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ) : (
            <Input
              value={currentValue}
              onChange={(e) => setCurrentValue(e.target.value)}
              disabled={isSaving}
              type={type}
              className="h-10"
              autoFocus
            />
          )}
          
          <Button
            size="icon"
            variant="ghost"
            onClick={handleSave}
            disabled={isSaving}
            className="h-10 w-10 text-green-600 hover:text-green-700 hover:bg-green-50"
          >
            <Check className="w-4 h-4" />
          </Button>
          
          <Button
            size="icon"
            variant="ghost"
            onClick={handleCancel}
            disabled={isSaving}
            className="h-10 w-10 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-2 h-10">
          <span className="text-base font-medium text-foreground">
            {displayValue() || <span className="text-muted-foreground/50 italic">Not specified</span>}
          </span>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setIsEditing(true)}
            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground"
          >
            <Edit2 className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
