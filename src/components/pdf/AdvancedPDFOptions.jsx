// src/components/pdf/AdvancedPDFOptions.jsx
import { useState } from "react";
import { Settings, Download, FileText, Image, Palette } from "lucide-react";
import Button from "../ui/Button";
import { Card } from "../ui/Card";
import { Modal } from "../ui/Modal";
import { Switch } from "../ui/Switch";
import Input from "../ui/Input";
import Select from "../ui/Select";
import pdfGenerator from "../../utils/pdfGenerator";
import toast from "react-hot-toast";

export default function AdvancedPDFOptions({
  submission,
  submissions,
  type = "single",
  className = "",
}) {
  const [showModal, setShowModal] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [options, setOptions] = useState({
    // Basic Options
    includeHeader: true,
    includeFooter: true,
    includeMetadata: true,
    includeCoverPage: false,

    // Content Options
    includeAttachments: true,
    includePlagiarismReport: false,

    // Format Options
    pageFormat: "a4",
    orientation: "portrait",
    margins: "normal",
    fontSize: "12",
    lineSpacing: "1.5",

    // Style Options
    watermark: "",
    headerText: "",
    footerText: "",

    // Bulk Options (for multiple submissions)
    separateFiles: false,
    includeIndex: true,
    groupByStatus: false,
  });

  // Hapus/disable opsi yang tidak didukung BE
  // - includeComments
  // - includeGradingRubric
  // - passwordProtect
  // - compression
  // - colorScheme

  const handleOptionChange = (key, value) => {
    setOptions((prev) => ({ ...prev, [key]: value }));
  };

  const generatePDF = async () => {
    if (!submission && !submissions) {
      toast.error("Tidak ada data untuk generate PDF");
      return;
    }

    setGenerating(true);

    try {
      let result;

      if (type === "single" && submission) {
        result = await pdfGenerator.generateSubmissionPDF(submission, {
          ...options,
          fontSize: parseInt(options.fontSize),
          lineSpacing: parseFloat(options.lineSpacing),
        });

        const filename = `${submission.student?.fullName || "submission"}_${
          submission.assignment?.title || "assignment"
        }.pdf`;

        pdfGenerator.downloadPDF(result, filename);
      } else if (type === "bulk" && submissions) {
        result = await pdfGenerator.generateBulkSubmissionPDF(
          submissions,
          submissions[0]?.assignment?.title || "Bulk Submissions",
          {
            ...options,
            separatePages: !options.separateFiles,
            includeTableOfContents: options.includeIndex,
          }
        );

        const filename = `bulk_submissions_${
          submissions[0]?.assignment?.title || "assignment"
        }.pdf`;

        pdfGenerator.downloadPDF(result, filename);
      }

      toast.success("PDF berhasil dihasilkan dan didownload");
      setShowModal(false);
    } catch (error) {
      console.error("PDF generation error:", error);
      // Contoh perbaikan prefer-template
      // toast.error("Gagal generate PDF: " + error.message);
      toast.error(`Gagal generate PDF: ${error.message}`);
    } finally {
      setGenerating(false);
    }
  };

  const previewPDF = async () => {
    if (!submission) {
      toast.error("Preview hanya tersedia untuk submission tunggal");
      return;
    }

    setGenerating(true);

    try {
      const pdf = await pdfGenerator.generateSubmissionPDF(submission, {
        ...options,
        includeMetadata: false, // Faster for preview
      });

      const blob = pdfGenerator.getPDFBlob(pdf);
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");

      setTimeout(() => URL.revokeObjectURL(url), 1000);
      toast.success("Preview PDF dibuka di tab baru");
    } catch (error) {
      console.error("PDF preview error:", error);
      toast.error("Gagal membuat preview PDF");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <>
      <div className={`flex items-center gap-2 ${className}`}>
        <Button
          onClick={generatePDF}
          disabled={generating}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          {generating ? "Generating..." : "Download PDF"}
        </Button>

        {type === "single" && (
          <Button
            variant="ghost"
            onClick={previewPDF}
            disabled={generating}
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Preview
          </Button>
        )}

        <Button
          variant="ghost"
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2"
        >
          <Settings className="h-4 w-4" />
          Options
        </Button>
      </div>

      {/* Advanced Options Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="PDF Generation Options"
        size="lg"
      >
        <div className="space-y-6 max-h-96 overflow-y-auto">
          {/* Basic Options */}
          <Card className="p-4">
            <h4 className="font-medium mb-4 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Basic Options
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <label
                  className="text-sm font-medium"
                  htmlFor="modal-include-header"
                >
                  Include Header
                </label>
                <Switch
                  id="modal-include-header"
                  checked={options.includeHeader}
                  onCheckedChange={(checked) =>
                    handleOptionChange("includeHeader", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <label
                  className="text-sm font-medium"
                  htmlFor="modal-include-footer"
                >
                  Include Footer
                </label>
                <Switch
                  id="modal-include-footer"
                  checked={options.includeFooter}
                  onCheckedChange={(checked) =>
                    handleOptionChange("includeFooter", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <label
                  className="text-sm font-medium"
                  htmlFor="modal-include-cover-page"
                >
                  Cover Page
                </label>
                <Switch
                  id="modal-include-cover-page"
                  checked={options.includeCoverPage}
                  onCheckedChange={(checked) =>
                    handleOptionChange("includeCoverPage", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <label
                  className="text-sm font-medium"
                  htmlFor="modal-include-metadata"
                >
                  Metadata
                </label>
                <Switch
                  id="modal-include-metadata"
                  checked={options.includeMetadata}
                  onCheckedChange={(checked) =>
                    handleOptionChange("includeMetadata", checked)
                  }
                />
              </div>
            </div>
          </Card>

          {/* Content Options */}
          <Card className="p-4">
            <h4 className="font-medium mb-4">Content Options</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <label
                  className="text-sm font-medium"
                  htmlFor="modal-attachments"
                >
                  Attachments
                </label>
                <Switch
                  id="modal-attachments"
                  checked={options.includeAttachments}
                  onCheckedChange={(checked) =>
                    handleOptionChange("includeAttachments", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <label
                  className="text-sm font-medium"
                  htmlFor="modal-plagiarism-report"
                >
                  Plagiarism Report
                </label>
                <Switch
                  id="modal-plagiarism-report"
                  checked={options.includePlagiarismReport}
                  onCheckedChange={(checked) =>
                    handleOptionChange("includePlagiarismReport", checked)
                  }
                />
              </div>
            </div>
          </Card>

          {/* Format Options */}
          <Card className="p-4">
            <h4 className="font-medium mb-4">Format Options</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  className="text-sm font-medium block mb-2"
                  htmlFor="format-page-size"
                >
                  Page Size
                </label>
                <select
                  id="format-page-size"
                  value={options.pageFormat}
                  onChange={(e) =>
                    handleOptionChange("pageFormat", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#23407a] focus:border-transparent"
                >
                  <option value="a4">A4</option>
                  <option value="a3">A3</option>
                  <option value="letter">Letter</option>
                  <option value="legal">Legal</option>
                </select>
              </div>

              <div>
                <label
                  className="text-sm font-medium block mb-2"
                  htmlFor="format-orientation"
                >
                  Orientation
                </label>
                <select
                  id="format-orientation"
                  value={options.orientation}
                  onChange={(e) =>
                    handleOptionChange("orientation", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#23407a] focus:border-transparent"
                >
                  <option value="portrait">Portrait</option>
                  <option value="landscape">Landscape</option>
                </select>
              </div>

              <div>
                <label
                  className="text-sm font-medium block mb-2"
                  htmlFor="format-font-size"
                >
                  Font Size
                </label>
                <select
                  id="format-font-size"
                  value={options.fontSize}
                  onChange={(e) =>
                    handleOptionChange("fontSize", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#23407a] focus:border-transparent"
                >
                  <option value="10">10pt</option>
                  <option value="11">11pt</option>
                  <option value="12">12pt</option>
                  <option value="14">14pt</option>
                  <option value="16">16pt</option>
                </select>
              </div>

              <div>
                <label
                  className="text-sm font-medium block mb-2"
                  htmlFor="format-line-spacing"
                >
                  Line Spacing
                </label>
                <select
                  id="format-line-spacing"
                  value={options.lineSpacing}
                  onChange={(e) =>
                    handleOptionChange("lineSpacing", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#23407a] focus:border-transparent"
                >
                  <option value="1">Single</option>
                  <option value="1.15">1.15</option>
                  <option value="1.5">1.5</option>
                  <option value="2">Double</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Style Options */}
          <Card className="p-4">
            <h4 className="font-medium mb-4 flex items-center gap-2">
              <Image className="h-4 w-4" />
              Style Options
            </h4>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="pdf-header-text"
                  className="block text-sm font-medium text-gray-700"
                >
                  Header Text
                </label>
                <Input
                  id="pdf-header-text"
                  value={options.headerText}
                  onChange={(e) =>
                    handleOptionChange("headerText", e.target.value)
                  }
                  placeholder="Judul header (opsional)"
                />
              </div>
              <div>
                <label
                  htmlFor="pdf-footer-text"
                  className="block text-sm font-medium text-gray-700"
                >
                  Footer Text
                </label>
                <Input
                  id="pdf-footer-text"
                  value={options.footerText}
                  onChange={(e) =>
                    handleOptionChange("footerText", e.target.value)
                  }
                  placeholder="Footer (opsional)"
                />
              </div>
              <div>
                <label
                  htmlFor="pdf-watermark"
                  className="block text-sm font-medium text-gray-700"
                >
                  Watermark
                </label>
                <Input
                  id="pdf-watermark"
                  value={options.watermark}
                  onChange={(e) =>
                    handleOptionChange("watermark", e.target.value)
                  }
                  placeholder="Watermark (opsional)"
                />
              </div>
              <div>
                <label
                  htmlFor="pdf-page-format"
                  className="block text-sm font-medium text-gray-700"
                >
                  Format Halaman
                </label>
                <Select
                  id="pdf-page-format"
                  value={options.pageFormat}
                  onChange={(e) =>
                    handleOptionChange("pageFormat", e.target.value)
                  }
                >
                  <option value="a4">A4</option>
                  <option value="letter">Letter</option>
                </Select>
              </div>
              <div>
                <label
                  htmlFor="pdf-orientation"
                  className="block text-sm font-medium text-gray-700"
                >
                  Orientasi
                </label>
                <Select
                  id="pdf-orientation"
                  value={options.orientation}
                  onChange={(e) =>
                    handleOptionChange("orientation", e.target.value)
                  }
                >
                  <option value="portrait">Portrait</option>
                  <option value="landscape">Landscape</option>
                </Select>
              </div>
              <div>
                <label
                  htmlFor="pdf-margins"
                  className="block text-sm font-medium text-gray-700"
                >
                  Margin
                </label>
                <Select
                  id="pdf-margins"
                  value={options.margins}
                  onChange={(e) =>
                    handleOptionChange("margins", e.target.value)
                  }
                >
                  <option value="normal">Normal</option>
                  <option value="wide">Wide</option>
                  <option value="narrow">Narrow</option>
                </Select>
              </div>
              <div>
                <label
                  htmlFor="pdf-font-size"
                  className="block text-sm font-medium text-gray-700"
                >
                  Ukuran Font
                </label>
                <Input
                  id="pdf-font-size"
                  type="number"
                  min={8}
                  max={20}
                  value={options.fontSize}
                  onChange={(e) =>
                    handleOptionChange("fontSize", e.target.value)
                  }
                  placeholder="Ukuran font"
                />
              </div>
              <div>
                <label
                  htmlFor="pdf-line-spacing"
                  className="block text-sm font-medium text-gray-700"
                >
                  Spasi Baris
                </label>
                <Select
                  id="pdf-line-spacing"
                  value={options.lineSpacing}
                  onChange={(e) =>
                    handleOptionChange("lineSpacing", e.target.value)
                  }
                >
                  <option value="1">1</option>
                  <option value="1.15">1.15</option>
                  <option value="1.5">1.5</option>
                  <option value="2">2</option>
                </Select>
              </div>
              <div>
                <label
                  htmlFor="pdf-include-header"
                  className="block text-sm font-medium text-gray-700"
                >
                  Sertakan Header
                </label>
                <Switch
                  id="pdf-include-header"
                  checked={options.includeHeader}
                  onCheckedChange={(checked) =>
                    handleOptionChange("includeHeader", checked)
                  }
                />
              </div>
              <div>
                <label
                  htmlFor="pdf-include-footer"
                  className="block text-sm font-medium text-gray-700"
                >
                  Sertakan Footer
                </label>
                <Switch
                  id="pdf-include-footer"
                  checked={options.includeFooter}
                  onCheckedChange={(checked) =>
                    handleOptionChange("includeFooter", checked)
                  }
                />
              </div>
              <div>
                <label
                  htmlFor="pdf-include-metadata"
                  className="block text-sm font-medium text-gray-700"
                >
                  Sertakan Metadata
                </label>
                <Switch
                  id="pdf-include-metadata"
                  checked={options.includeMetadata}
                  onCheckedChange={(checked) =>
                    handleOptionChange("includeMetadata", checked)
                  }
                />
              </div>
              <div>
                <label
                  htmlFor="pdf-include-cover-page"
                  className="block text-sm font-medium text-gray-700"
                >
                  Sertakan Cover Page
                </label>
                <Switch
                  id="pdf-include-cover-page"
                  checked={options.includeCoverPage}
                  onCheckedChange={(checked) =>
                    handleOptionChange("includeCoverPage", checked)
                  }
                />
              </div>
              <div>
                <label
                  htmlFor="pdf-include-attachments"
                  className="block text-sm font-medium text-gray-700"
                >
                  Sertakan Lampiran
                </label>
                <Switch
                  id="pdf-include-attachments"
                  checked={options.includeAttachments}
                  onCheckedChange={(checked) =>
                    handleOptionChange("includeAttachments", checked)
                  }
                />
              </div>
              <div>
                <label
                  htmlFor="pdf-include-plagiarism-report"
                  className="block text-sm font-medium text-gray-700"
                >
                  Sertakan Laporan Plagiarisme
                </label>
                <Switch
                  id="pdf-include-plagiarism-report"
                  checked={options.includePlagiarismReport}
                  onCheckedChange={(checked) =>
                    handleOptionChange("includePlagiarismReport", checked)
                  }
                />
              </div>
              <div>
                <label
                  htmlFor="pdf-separate-files"
                  className="block text-sm font-medium text-gray-700"
                >
                  Pisahkan File per Siswa
                </label>
                <Switch
                  id="pdf-separate-files"
                  checked={options.separateFiles}
                  onCheckedChange={(checked) =>
                    handleOptionChange("separateFiles", checked)
                  }
                />
              </div>
              <div>
                <label
                  htmlFor="pdf-include-index"
                  className="block text-sm font-medium text-gray-700"
                >
                  Sertakan Index
                </label>
                <Switch
                  id="pdf-include-index"
                  checked={options.includeIndex}
                  onCheckedChange={(checked) =>
                    handleOptionChange("includeIndex", checked)
                  }
                />
              </div>
              <div>
                <label
                  htmlFor="pdf-group-by-status"
                  className="block text-sm font-medium text-gray-700"
                >
                  Kelompokkan Berdasarkan Status
                </label>
                <Switch
                  id="pdf-group-by-status"
                  checked={options.groupByStatus}
                  onCheckedChange={(checked) =>
                    handleOptionChange("groupByStatus", checked)
                  }
                />
              </div>
            </div>
          </Card>

          {/* Modal Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="ghost" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            {type === "single" && (
              <Button
                variant="outline"
                onClick={previewPDF}
                disabled={generating}
              >
                Preview
              </Button>
            )}
            <Button onClick={generatePDF} disabled={generating}>
              {generating ? "Generating..." : "Generate PDF"}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
