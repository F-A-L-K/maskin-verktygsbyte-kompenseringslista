
export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Inställningar</h1>
        <p className="text-muted-foreground">
          Hantera systeminställningar
        </p>
      </div>
      
      <div className="bg-secondary/50 rounded-lg p-6 text-center">
        <h2 className="text-xl font-medium mb-2">Funktionalitet under utveckling</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Inställningar kommer att implementeras i nästa uppdatering.
        </p>
      </div>
    </div>
  );
}
