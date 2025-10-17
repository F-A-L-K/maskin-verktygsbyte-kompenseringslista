import { useState, useEffect } from "react";
import { generateUUID } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel 
} from "@/components/ui/form";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { MachineId, ToolChange } from "@/types";
import { useLastManufacturingOrder } from "@/hooks/useLastManufacturingOrder";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { getAdamBoxValue } from "@/lib/adambox";

const formSchema = z.object({
  toolNumber: z.string().min(1, "Verktygsnummer är obligatoriskt"),
  reason: z.enum(["Slitage", "Verktygsbrott"], {
    required_error: "Välj en anledning",
  }),
  manufacturingOrder: z.string().min(1, "Tillverkningsorder är obligatoriskt"),
  signature: z.string().min(1, "Signatur är obligatoriskt"),
  comment: z.string().optional(),
});

interface CreateToolChangeProps {
  activeMachine: MachineId;
}

export default function CreateToolChange({ activeMachine }: CreateToolChangeProps) {
  const [isLoadingAdamBox, setIsLoadingAdamBox] = useState(false);
  const [adamBoxValue, setAdamBoxValue] = useState<number | null>(null);
  const { getLastOrder, setLastOrder } = useLastManufacturingOrder();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      toolNumber: "",
      reason: undefined,
      manufacturingOrder: getLastOrder(activeMachine) || "",
      signature: "",
      comment: "",
    },
  });

  // Get AdamBox value when component mounts
  useEffect(() => {
    fetchAdamBoxValue();
  }, [activeMachine]);

  const fetchAdamBoxValue = async () => {
    setIsLoadingAdamBox(true);
    try {
      const value = await getAdamBoxValue(activeMachine);
      setAdamBoxValue(value);
    } catch (error) {
      console.error('Error fetching AdamBox value:', error);
      setAdamBoxValue(null);
    } finally {
      setIsLoadingAdamBox(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const newToolChange: ToolChange = {
      id: generateUUID(),
      machineId: activeMachine,
      manufacturingOrder: values.manufacturingOrder,
      toolNumber: values.toolNumber,
      reason: values.reason,
      comment: values.comment || "",
      signature: values.signature,
      timestamp: new Date(),
      number_of_parts_ADAM: adamBoxValue || null,
    };

    // Save to Supabase
    const { error } = await (supabase as any).from("verktygshanteringssystem_verktygsbyteslista").insert({
      id: newToolChange.id,
      machine_number: newToolChange.machineId,
      manufacturing_order: newToolChange.manufacturingOrder,
      tool_number: newToolChange.toolNumber,
      cause: newToolChange.reason,
      comment: newToolChange.comment,
      signature: newToolChange.signature,
      date_created: newToolChange.timestamp.toISOString(),
      number_of_parts_ADAM: adamBoxValue || null,
    });

    if (error) {
      toast.error("Kunde inte spara verktygsbyte");
      return;
    }

    if (newToolChange.manufacturingOrder) {
      setLastOrder(activeMachine, newToolChange.manufacturingOrder);
    }

    toast.success("Verktygsbyte sparat");
    
    // Reset form
    form.reset({
      toolNumber: "",
      reason: undefined,
      manufacturingOrder: getLastOrder(activeMachine) || "",
      signature: "",
      comment: "",
    });
  };

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto">
  
        <div className="bg-card p-6 rounded-lg border">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                name="signature"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Signatur</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ange signatur" />
                    </FormControl>
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

              <div className="flex justify-end">
                <Button type="submit">
                  Spara
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
