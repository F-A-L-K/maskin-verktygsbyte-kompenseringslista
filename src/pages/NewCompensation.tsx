import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
import { MachineId, ToolCompensation } from "@/types";
import { useLastManufacturingOrder } from "@/hooks/useLastManufacturingOrder";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { toast } from "sonner";

// Step 1: Coordinate system, tool, number, direction, value
const step1Schema = z.object({
  coordinateSystem: z.string().optional(),
  tool: z.string().optional(),
  number: z.string().optional(),
  direction: z.enum(["X", "Y", "Z", "R", "L"], {
    required_error: "Välj en kompenseringsriktning",
  }),
  value: z.string()
    .regex(/^[+-]?\d*\.?\d+$/, "Måste vara ett nummer med eventuellt +/- tecken")
    .min(1, "Kompenseringsvärde är obligatoriskt"),
}).refine(data => data.coordinateSystem || data.tool || data.number, {
  message: "Minst ett av koordinatsystem, verktyg eller nummer måste anges",
});

// Step 2: Manufacturing order, signature, comment
const step2Schema = z.object({
  manufacturingOrder: z.string().min(1, "Tillverkningsorder är obligatoriskt"),
  signature: z.string().min(1, "Signatur är obligatoriskt"),
  comment: z.string().optional(),
});

export default function NewCompensation() {
  const [currentStep, setCurrentStep] = useState(1);
  const [step1Data, setStep1Data] = useState<z.infer<typeof step1Schema> | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const machineId = searchParams.get("machine") as MachineId;
  const { getLastOrder, setLastOrder } = useLastManufacturingOrder();

  const step1Form = useForm<z.infer<typeof step1Schema>>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      coordinateSystem: "",
      tool: "",
      number: "",
      direction: undefined,
      value: "",
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

  const handleStep1Submit = (values: z.infer<typeof step1Schema>) => {
    setStep1Data(values);
    setCurrentStep(2);
  };

  const handleStep2Submit = async (values: z.infer<typeof step2Schema>) => {
    if (!step1Data) return;

    const newCompensation: ToolCompensation = {
      id: crypto.randomUUID(),
      machineId,
      manufacturingOrder: values.manufacturingOrder,
      coordinateSystem: step1Data.coordinateSystem || undefined,
      tool: step1Data.tool || undefined,
      number: step1Data.number || undefined,
      direction: step1Data.direction,
      value: step1Data.value,
      comment: values.comment || "",
      signature: values.signature,
      timestamp: new Date(),
    };

    // Save to Supabase
    const { error } = await (supabase as any).from("verktygshanteringssystem_kompenseringslista").insert({
      id: newCompensation.id,
      machine_number: newCompensation.machineId,
      manufacturing_order: newCompensation.manufacturingOrder,
      compnum_coordinate_system: newCompensation.coordinateSystem || null,
      compnum_tool: newCompensation.tool || null,
      compnum_number: newCompensation.number || null,
      compensation_direction: newCompensation.direction,
      compensation_value: newCompensation.value,
      comment: newCompensation.comment,
      signature: newCompensation.signature,
      date_created: newCompensation.timestamp.toISOString(),
    });

    if (error) {
      toast.error("Kunde inte spara verktygskompensation");
      return;
    }

    if (newCompensation.manufacturingOrder) {
      setLastOrder(machineId, newCompensation.manufacturingOrder);
    }

    toast.success("Verktygskompensation sparad");
    navigate(`/${machineId}?tab=kompensering`);
  };

  if (!machineId) {
    return <div>Maskin-ID saknas</div>;
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Ny verktygskompensering - Maskin {machineId}</h1>
            <div className="text-sm text-muted-foreground">
              Steg {currentStep} av 2
            </div>
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg border">
          {currentStep === 1 ? (
            <Form {...step1Form}>
              <form onSubmit={step1Form.handleSubmit(handleStep1Submit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={step1Form.control}
                    name="coordinateSystem"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Koordinatsystem</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Ange koord. sys." />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={step1Form.control}
                    name="tool"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Verktyg</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Ange verktyg" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={step1Form.control}
                    name="number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nummer</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Ange nummer" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={step1Form.control}
                    name="direction"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kompenseringsriktning</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Välj riktning" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="X">X</SelectItem>
                            <SelectItem value="Y">Y</SelectItem>
                            <SelectItem value="Z">Z</SelectItem>
                            <SelectItem value="R">R</SelectItem>
                            <SelectItem value="L">L</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={step1Form.control}
                    name="value"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kompenseringsvärde</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Ange värde (t.ex. +0.15)" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-between">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => navigate(`/${machineId}?tab=kompensering`)}
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
          ) : (
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
                    Tillbaka
                  </Button>
                  <Button type="submit">
                    Spara kompensering
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </div>
      </div>
    </div>
  );
}