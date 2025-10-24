import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { MachineId } from "@/types";
import { Save } from "lucide-react";
import { getMachineStatus, extractWorkCenterFromMachineId } from "@/lib/machinestatus";

const formSchema = z.object({
  manufacturingOrder: z.string().min(1, "Tillverkningsorder är obligatoriskt"),
  date: z.string().min(6, "Datum måste vara i format ÅÅMMDD").max(6, "Datum måste vara i format ÅÅMMDD"),
  comment: z.string().optional(),
});

interface MatrixkodProps {
  activeMachine: MachineId;
}

export default function Matrixkod({ activeMachine }: MatrixkodProps) {
  const [activeManufacturingOrder, setActiveManufacturingOrder] = useState<string>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      manufacturingOrder: "",
      date: "",
      comment: "",
    },
  });

  // Watch form values to determine if save button should be enabled
  const watchedValues = form.watch();
  const isFormValid = 
    watchedValues.manufacturingOrder && 
    watchedValues.date;

  // Get manufacturing order when component mounts
  useEffect(() => {
    fetchManufacturingOrder();
  }, [activeMachine]);

  const fetchManufacturingOrder = async () => {
    try {
      const workCenter = extractWorkCenterFromMachineId(activeMachine);
      const statusData = await getMachineStatus(workCenter);
      
      if (statusData.active_order?.order_number) {
        setActiveManufacturingOrder(statusData.active_order.order_number);
        form.setValue("manufacturingOrder", statusData.active_order.order_number);
      } else {
        setActiveManufacturingOrder("");
        form.setValue("manufacturingOrder", "");
      }
    } catch (error) {
      console.error('Error fetching manufacturing order:', error);
      setActiveManufacturingOrder("");
      form.setValue("manufacturingOrder", "");
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // When save is clicked, nothing happens as requested
    console.log("Matrixkod form submitted:", values);
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
              name="manufacturingOrder"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-600 text-sm font-medium">Tillverkningsorder</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="Tillverkningsorder" 
                      readOnly
                      className="bg-gray-50"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-600 text-sm font-medium">Datum (ÅÅMMDD)</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="ÅÅMMDD" 
                      maxLength={6}
                      className="uppercase"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-600 text-sm font-medium">Kommentar</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Skriv en kommentar (valfritt)"
                    />
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
