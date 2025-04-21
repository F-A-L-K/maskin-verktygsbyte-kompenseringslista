
import { useState } from "react";
import { 
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel 
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { MachineId, ToolChange } from "@/types";

const formSchema = z.object({
  toolNumber: z.string().min(1, "Verktygsnummer är obligatoriskt"),
  reason: z.enum(["Slitage", "Verktygsbrott"], {
    required_error: "Välj en anledning",
  }),
  comment: z.string().optional(),
  signature: z.enum(["Fredrik", "Joel", "Per"], {
    required_error: "Välj en signatur",
  }),
});

interface ToolChangeFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (toolChange: ToolChange) => void;
  machineId: MachineId;
}

export default function ToolChangeForm({ 
  open, 
  onOpenChange, 
  onSubmit,
  machineId
}: ToolChangeFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      toolNumber: "",
      reason: undefined,
      comment: "",
      signature: undefined,
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    const newToolChange: ToolChange = {
      id: crypto.randomUUID(),
      machineId,
      toolNumber: values.toolNumber,
      reason: values.reason,
      comment: values.comment || "",
      signature: values.signature,
      timestamp: new Date(),
    };
    
    onSubmit(newToolChange);
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nytt verktygsbyte - Maskin {machineId}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="toolNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verktygsnummer</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ange verktygsnummer" />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Anledning</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Välj anledning" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Slitage">Slitage</SelectItem>
                      <SelectItem value="Verktygsbrott">Verktygsbrott</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            
            
            
            <FormField
              control={form.control}
              name="signature"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Signatur</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Välj signatur" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Fredrik">Fredrik</SelectItem>
                      <SelectItem value="Joel">Joel</SelectItem>
                      <SelectItem value="Per">Per</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kommentar</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Skriv en kommentar (valfritt)" 
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Avbryt
              </Button>
              <Button type="submit">Spara</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
