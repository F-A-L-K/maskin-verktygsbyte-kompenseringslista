import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getAdamBoxValue, getFullMachineId } from "@/lib/adambox";

const step1Schema = z.object({
  toolNumber: z.string().min(1, "Verktygsnummer är obligatoriskt"),
  reason: z.enum(["Slitage", "Verktygsbrott"], {
    required_error: "Välj en anledning",
  }),
});

const step2Schema = z.object({
  manufacturingOrder: z.string().min(1, "Tillverkningsorder är obligatoriskt"),
  signature: z.string().min(1, "Signatur är obligatoriskt"),
  comment: z.string().optional(),
});

export default function NewToolChange() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const machineNumber = searchParams.get("machine");
  const machineId = machineNumber ? getFullMachineId(machineNumber) : null;
  const [currentStep, setCurrentStep] = useState(1);
  const [step1Data, setStep1Data] = useState<z.infer<typeof step1Schema> | null>(null);
  const [isLoadingAdamBox, setIsLoadingAdamBox] = useState(false);
  const [adamBoxValue, setAdamBoxValue] = useState<number | null>(null);
  const { getLastOrder, setLastOrder } = useLastManufacturingOrder();

  const step1Form = useForm<z.infer<typeof step1Schema>>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      toolNumber: "",
      reason: undefined,
    },
  });

  const step2Form = useForm<z.infer<typeof step2Schema>>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      manufacturingOrder: getLastOrder(machineId) || "",
      signature: "",
      comment: "",
    },
  });

  // Get AdamBox value when component mounts
  useEffect(() => {
    if (machineId) {
      fetchAdamBoxValue();
    }
  }, [machineId]);

  const fetchAdamBoxValue = async () => {
    setIsLoadingAdamBox(true);
    try {
      const value = await getAdamBoxValue(machineId);
      setAdamBoxValue(value);
    } catch (error) {
      console.error('Error fetching AdamBox value:', error);
      setAdamBoxValue(null);
    } finally {
      setIsLoadingAdamBox(false);
    }
  };

  const handleStep1Submit = (values: z.infer<typeof step1Schema>) => {
    setStep1Data(values);
    setCurrentStep(2);
  };

  const handleStep2Submit = async (values: z.infer<typeof step2Schema>) => {
    if (!step1Data) return;

    const newToolChange: ToolChange = {
      id: generateUUID(),
      machineId,
      manufacturingOrder: values.manufacturingOrder,
      toolNumber: step1Data.toolNumber,
      reason: step1Data.reason,
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
      setLastOrder(machineId, newToolChange.manufacturingOrder);
    }

    toast.success("Verktygsbyte sparat");
    navigate(`/${machineNumber}`);
  };

  if (!machineId) {
    return <div>Maskin-ID saknas</div>;
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Nytt verktygsbyte - {machineId}</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <span className={currentStep === 1 ? "text-primary font-medium" : ""}>Steg 1: Verktyg & anledning</span>
            <ArrowRight size={16} />
            <span className={currentStep === 2 ? "text-primary font-medium" : ""}>Steg 2: Order & signatur</span>
          </div>
       
        </div>

        {currentStep === 1 && (
          <div className="bg-card p-6 rounded-lg border">
            <Form {...step1Form}>
              <form onSubmit={step1Form.handleSubmit(handleStep1Submit)} className="space-y-6">
                <FormField
                  control={step1Form.control}
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
                  control={step1Form.control}
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

                <div className="flex justify-between">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => navigate(`/${machineNumber}`)}
                  >
                    <ArrowLeft size={16} className="mr-2" />
                    Tillbaka
                  </Button>
                  <Button type="submit">
                    Nästa
                    <ArrowRight size={16} className="ml-2" />
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        )}

        {currentStep === 2 && (
          <div className="bg-card p-6 rounded-lg border">
            <Form {...step2Form}>
              <form onSubmit={step2Form.handleSubmit(handleStep2Submit)} className="space-y-6">
                <FormField
                  control={step2Form.control}
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
                  control={step2Form.control}
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
                  control={step2Form.control}
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

                <div className="flex justify-between">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setCurrentStep(1)}
                  >
                    <ArrowLeft size={16} className="mr-2" />
                    Föregående
                  </Button>
                  <Button type="submit">
                    Spara verktygsbyte
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        )}
      </div>
    </div>
  );
}