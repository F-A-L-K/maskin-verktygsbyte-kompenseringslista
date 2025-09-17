import { Info } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Felaktig URL</h2>
          <p className="text-gray-600 mb-8">
            URL:en du angav är inte korrekt. Använd formatet nedan för att komma åt verktygshanteringen.
          </p>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900 mb-3">Korrekt URL-format</h3>
              <p className="text-blue-800 text-sm mb-4">
                Använd 4-siffriga maskin-ID:n separerade med bindestreck:
              </p>
              <div className="text-sm text-blue-700 space-y-2">
                <p><strong>Exempel på korrekta URL:er:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li><code>/5401-5402-5403</code> - Välj mellan maskin 5401, 5402 och 5403</li>
                  <li><code>/5701-5704</code> - Välj mellan maskin 5701 och 5704</li>
                  <li><code>/5503</code> - Endast maskin 5503 tillgänglig</li>
                </ul>
                <p className="mt-3"><strong>Exempel på felaktiga URL:er:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li><code>/</code> - För kort</li>
                  <li><code>/570</code> - Inte 4 siffror</li>
                  <li><code>/5701-570</code> - Blandade längder</li>
                  <li><code>/abc-5701</code> - Innehåller bokstäver</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}