import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { generateUUID } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useMachineByNumber } from "@/hooks/useMachines";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronDown } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { MachineId } from "@/types";
import { Save } from "lucide-react";

const formSchema = z.object({
  area: z.enum(["Robot", "Spåntransportör",  "In- och utbana", "Annat"], {
    required_error: "Välj ett område",
  }),
  comment: z.string().min(1, "Kommentar är obligatoriskt"),
  signature: z.string().min(1, "Signatur är obligatoriskt"),
});

interface CreateDisturbanceProps {
  activeMachine: MachineId;
}

export default function CreateDisturbance({ activeMachine }: CreateDisturbanceProps) {
  const [areaDropdownOpen, setAreaDropdownOpen] = useState(false);
  const { toast } = useToast();
  
  // Extract machine number from activeMachine (format: "5701 Machine Name")
  const machineNumber = activeMachine.split(' ')[0];
  const { data: machine } = useMachineByNumber(machineNumber);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      area: undefined,
      comment: "",
      signature: "",
    },
  });

  // Get comment suggestions based on selected area
  const getCommentSuggestions = (area: string | undefined) => {
    switch (area) {
      case "Robot":
        return [
          "Krock vid materialplock",
          "Krock vid detaljlämning i tråg",
          "Krock vid byte av tempo 1", 
          "Krock vid byte av tempo 2",
          
        ];
      case "Spåntransportör":
        return [
          "Översväming"
        ];
      case "In- och utbana":
        return [
          "Fylld pallet in fastnat",
          "Tom pallet ut fastnat",
          "Tom tråg in fastnat",
          "Fyllt tråg ut fastnat", 
         
        ];
      default:
        return [];
    }
  };

  // Watch form values to determine if save button should be enabled
  const watchedValues = form.watch();
  const isFormValid = 
    watchedValues.area && 
    watchedValues.comment && 
    watchedValues.signature;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!machine?.id) {
      toast({
        title: "Fel",
        description: "Kunde inte hitta maskinen",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('verktygshanteringssystem_störningar')
        .insert({
          maskin_id: machine.id,
          område: values.area,
          kommentar: values.comment,
          signatur: values.signature,
        });

      if (error) {
        console.error("Error saving disturbance:", error);
        toast({
          title: "Fel",
          description: "Kunde inte spara störningen",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Sparat",
        description: "Störningen har sparats",
      });

      // Reset form on success
      form.reset({
        area: undefined,
        comment: "",
        signature: "",
      });
    } catch (error) {
      console.error("Error saving disturbance:", error);
      toast({
        title: "Fel",
        description: "Ett oväntat fel uppstod",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Save Button at the top */}
            <div className="flex justify-start mb-8">
              <Button 
                type="submit" 
                disabled={!isFormValid}
                className={`${
                  isFormValid 
                    ? "bg-white text-[#507E95] hover:bg-[#8BA5B8] border border-[#507E95] " 
                    : "bg-white text-[#9DB5C8] hover:bg-[#8BA5B8] border border-[#7A95A8] cursor-not-allowed "
                } rounded-full px-6 py-2 flex items-center gap-2`}
              >
                <Save className="h-4 w-4" />
                SPARA
              </Button>
            </div>

            <FormField
              control={form.control}
              name="area"
              render={({ field }) => {
                const areas = [
                  { value: "Robot", label: "Robot" },
                  { value: "Spåntransportör", label: "Spåntransportör" },
                  
                  { value: "In- och utbana", label: "In- och utbana" },
                  { value: "Annat", label: "Annat" }
                ];
                const selectedArea = areas.find(area => area.value === field.value);

                return (
                  <FormItem>
                    <FormLabel className="text-gray-600 text-sm font-medium">Område</FormLabel>
                    <FormControl>
                      <Popover open={areaDropdownOpen} onOpenChange={setAreaDropdownOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={areaDropdownOpen}
                            className="w-full justify-between hover:bg-[#f3f3f3] hover:text-black"
                          >
                            {selectedArea ? (
                              selectedArea.label
                            ) : (
                              "Välj område"
                            )}
                            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0" align="start">
                          <div className="max-h-96 overflow-y-auto">
                            <div className="grid grid-cols-1 gap-0">
                              {areas.map((area) => (
                                <div
                                  key={area.value}
                                  className={`flex items-center space-x-2 px-4 py-2 cursor-pointer hover:bg-[#f3f3f3] ${
                                    field.value === area.value ? "bg-[#f3f3f3]" : ""
                                  }`}
                                  onClick={() => {
                                    field.onChange(area.value);
                                    setAreaDropdownOpen(false);
                                  }}
                                >
                                  <Check
                                    className={`h-4 w-4 ${
                                      field.value === area.value ? "opacity-100" : "opacity-0"
                                    }`}
                                  />
                                  <div className="flex-1">
                                    <div className="text-sm font-medium">
                                      {area.label}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => {
                const suggestions = getCommentSuggestions(watchedValues.area);
                
                return (
                  <FormItem>
                    <FormLabel className="text-gray-600 text-sm font-medium">Kommentar</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="Skriv en kommentar"
                      />
                    </FormControl>
                    {suggestions.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600 mb-2">Förslag:</p>
                        <div className="flex flex-wrap gap-2">
                          {suggestions.map((suggestion, index) => (
                            <Button
                              key={index}
                              type="button"
                              variant="outline"
                              size="sm"
                              className="text-xs h-8 px-3"
                              onClick={() => {
                                field.onChange(suggestion);
                              }}
                            >
                              {suggestion}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="signature"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-600 text-sm font-medium">Signatur</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ange signatur" />
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
    </div>
  );
}
