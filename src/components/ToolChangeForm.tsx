
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
import { useLastManufacturingOrder } from "@/hooks/useLastManufacturingOrder";

const formSchema = z.object({
  manufacturingOrder: z.string().min(1, "Tillverkningsorder är obligatoriskt"),
  toolNumber: z.string().min(1, "Verktygsnummer är obligatoriskt"),
  reason: z.enum(["Slitage", "Verktygsbrott"], {
    required_error: "Välj en anledning",
  }),
  comment: z.string().optional(),
  signature: z.enum(["Joel HS",
"Antal G",
"Christian P",
"Tony C",
"Roger J",
"Fredrik F",
"Sejad P",
"Vu T",], {
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
  const { getLastOrder } = useLastManufacturingOrder();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      manufacturingOrder: getLastOrder(machineId) || "",
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
      manufacturingOrder: values.manufacturingOrder,
      toolNumber: values.toolNumber,
      reason: values.reason,
      comment: values.comment || "",
      signature: values.signature,
      timestamp: new Date(),
    };
    
    onSubmit(newToolChange);
    form.reset({
      ...form.formState.defaultValues,
      manufacturingOrder: values.manufacturingOrder,
    });
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
              name="manufacturingOrder"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tillverkningsorder</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ange tillverkningsorder" />
                  </FormControl>
                </FormItem>
              )}
            />

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
                      <SelectItem value="Joel HS">Joel HS</SelectItem>
                      <SelectItem value="Antal G">Antal G</SelectItem>
                      <SelectItem value="Christian P">Christian P</SelectItem>
                      <SelectItem value="Tony C">Tony C</SelectItem>
                      <SelectItem value="Roger J">Roger J</SelectItem>
                      <SelectItem value="Fredrik F">Fredrik F</SelectItem>
                      <SelectItem value="Sejad P">Sejad P</SelectItem>
                      <SelectItem value="Vu T">Vu T</SelectItem>
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
