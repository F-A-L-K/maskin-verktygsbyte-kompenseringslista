import { FileText } from "lucide-react";

export default function Matplan() {
  const fileName = "16990 mätplan.pdf";
  const filePath = `/16990 mätplan.pdf`;

  return (
    <div className="h-full w-full flex flex-col">
      {/* Header */}
      {/* <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center gap-3">
          <FileText className="h-6 w-6 text-[#507E95]" />
          <h1 className="text-xl font-semibold text-gray-800">{fileName}</h1>
        </div>
      </div> */}

      {/* PDF viewer */}
      <div className="flex-1 relative">
        <iframe
          src={filePath}
          className="w-full h-full border-0"
          title="Mätplan PDF Viewer"
        />
      </div>
    </div>
  );
}

