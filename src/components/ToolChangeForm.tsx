
import { useState, useEffect } from "react";
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
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  manufacturingOrder: z.string().min(1, "Tillverkningsorder är obligatoriskt"),
  toolNumber: z.string().min(1, "Verktygsnummer är obligatoriskt"),
  reason: z.enum(["Slitage", "Verktygsbrott"], {
    required_error: "Välj en anledning",
  }),
  comment: z.string().optional(),
  signature: z.string({
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
  const [signatures, setSignatures] = useState<string[]>([]);

  useEffect(() => {
    // Fix: use a more generic approach to handle the response
    const fetchSignatures = async () => {
      try {
        // Cast to any to bypass TypeScript's strict checking since we know this table exists
        const { data, error } = await supabase
          .from('signatures' as any)
          .select('name');
        
        if (error) {
          console.error("Error fetching signatures:", error);
          return;
        }
        
        // Safely handle the data, ensuring it's an array with name properties
        if (data && Array.isArray(data)) {
          const names = data.map((item: any) => item.name).filter(Boolean);
          setSignatures(names);
        }
      } catch (err) {
        console.error("Exception when fetching signatures:", err);
      }
    };

    fetchSignatures();
  }, []);

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
                      {signatures.map(sig => (
                        <SelectItem key={sig} value={sig}>{sig}</SelectItem>
                      ))}
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
