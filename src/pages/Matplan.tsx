import { FileSpreadsheet } from "lucide-react";

export default function Matplan() {
  const fileName = "Mätplan 16990.xlsx";
  const filePath = `/Mätplan 16990.xlsx`;

  return (
    <div className="h-full w-full flex flex-col">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center gap-3">
          <FileSpreadsheet className="h-6 w-6 text-[#507E95]" />
          <h1 className="text-xl font-semibold text-gray-800">{fileName}</h1>
        </div>
      </div>

      {/* File display area */}
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <FileSpreadsheet className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-medium text-gray-800 mb-2">{fileName}</h2>
          <p className="text-gray-600 mb-6">
            Excel-filen kan inte visas direkt i webbläsaren.
          </p>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">
              För att öppna filen:
            </p>
            <ol className="text-sm text-gray-600 space-y-1 text-left max-w-md mx-auto">
              <li>1. Högerklicka på länken nedan</li>
              <li>2. Välj "Spara länk som..."</li>
              <li>3. Öppna filen i Excel eller Google Sheets</li>
            </ol>
          </div>
          <div className="mt-6">
            <a
              href={filePath}
              download={fileName}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#507E95] text-white rounded-lg hover:bg-[#406580] transition-colors"
            >
              <FileSpreadsheet className="h-5 w-5" />
              Öppna Excel-fil
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

