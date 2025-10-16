// src/components/pdf/PDFGenerator.jsx
import { useState } from "react";
import { Download, FileText, Settings, Loader2 } from "lucide-react";
import Button from "../ui/Button";
import { Card } from "../ui/Card";
import { Modal } from "../ui/Modal";
import Input from "../ui/Input";
import { Switch } from "../ui/Switch";
import pdfGenerator from "../../utils/pdfGenerator";
import toast from "react-hot-toast";

export default function PDFGenerator({
  submission,
  submissions,
  type = "single", // "single" | "bulk"
  className = "",
}) {
  const [generating, setGenerating] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    includeHeader: true,
    includeFooter: true,
    includeMetadata: true,
    watermark: "",
    pageFormat: "a4",
    orientation: "portrait",
    quality: 1.0,
    separatePages: true,
    includeTableOfContents: true,
  });

  // Hapus/disable opsi yang tidak didukung BE:
  // - comments
  // - grading rubric
  // - password protect
  // - compression
  // - color scheme
  // - collaborative

  const handleGenerate = async () => {
    if (!submission && !submissions) {
      toast.error("No data to generate PDF");
      return;
    }

    setGenerating(true);

    try {
      let pdf;
      let filename;

      if (type === "single" && submission) {
        filename = `${submission.student?.fullName || "submission"}_${
          submission.assignment?.title || "assignment"
        }.pdf`;
        pdf = await pdfGenerator.generateSubmissionPDF(submission, {
          ...settings,
          watermark: settings.watermark || null,
        });
      } else if (type === "bulk" && submissions) {
        filename = `bulk_submissions_${
          submissions[0]?.assignment?.title || "assignment"
        }.pdf`;
        pdf = await pdfGenerator.generateBulkSubmissionPDF(
          submissions,
          submissions[0]?.assignment?.title || "Bulk Submissions",
          {
            ...settings,
            separatePages: settings.separatePages,
            includeTableOfContents: settings.includeTableOfContents,
          }
        );
      }

      if (pdf) {
        pdfGenerator.downloadPDF(pdf, filename);
        toast.success("PDF berhasil dihasilkan");
      }
    } catch (error) {
      console.error("PDF generation error:", error);
      toast.error(`Gagal menghasilkan PDF: ${error.message}`);
    } finally {
      setGenerating(false);
    }
  };

  const handlePreview = async () => {
    if (!submission) {
      toast.error("No data to preview");
      return;
    }

    setGenerating(true);

    try {
      const pdf = await pdfGenerator.generateSubmissionPDF(submission, {
        ...settings,
        watermark: settings.watermark || null,
      });

      // Open PDF in new tab for preview
      const blob = pdfGenerator.getPDFBlob(pdf);
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");

      // Clean up
      setTimeout(() => URL.revokeObjectURL(url), 1000);

      toast.success("PDF preview opened");
    } catch (error) {
      console.error("PDF preview error:", error);
      toast.error("Gagal membuat preview PDF");
    } finally {
      setGenerating(false);
    }
  };

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <>
      <div className={`flex items-center gap-2 ${className}`}>
        <Button
          onClick={handleGenerate}
          disabled={generating}
          className="flex items-center gap-2"
        >
          {generating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          {generating ? "Generating..." : "Download PDF"}
        </Button>

        {type === "single" && (
          <Button
            variant="ghost"
            onClick={handlePreview}
            disabled={generating}
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Preview
          </Button>
        )}

        <Button
          variant="ghost"
          onClick={() => setShowSettings(true)}
          className="flex items-center gap-2"
        >
          <Settings className="h-4 w-4" />
          Settings
        </Button>
      </div>

      {/* Settings Modal */}
      <Modal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        title="PDF Generation Settings"
        size="md"
      >
        <div className="space-y-6">
          {/* Basic Settings */}
          <Card className="p-4">
            <h4 className="font-medium mb-4">Basic Settings</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label
                  className="text-sm font-medium"
                  htmlFor="include-header-switch"
                >
                  Include Header
                </label>
                <Switch
                  id="include-header-switch"
                  checked={settings.includeHeader}
                  onCheckedChange={(checked) =>
                    updateSetting("includeHeader", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <label
                  className="text-sm font-medium"
                  htmlFor="include-footer-switch"
                >
                  Include Footer
                </label>
                <Switch
                  id="include-footer-switch"
                  checked={settings.includeFooter}
                  onCheckedChange={(checked) =>
                    updateSetting("includeFooter", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <label
                  className="text-sm font-medium"
                  htmlFor="include-metadata-switch"
                >
                  Include Metadata
                </label>
                <Switch
                  id="include-metadata-switch"
                  checked={settings.includeMetadata}
                  onCheckedChange={(checked) =>
                    updateSetting("includeMetadata", checked)
                  }
                />
              </div>

              <div>
                <label
                  className="text-sm font-medium block mb-2"
                  htmlFor="watermark-input"
                >
                  Watermark Text
                </label>
                <Input
                  id="watermark-input"
                  value={settings.watermark}
                  onChange={(e) => updateSetting("watermark", e.target.value)}
                  placeholder="Enter watermark text (optional)"
                />
              </div>
            </div>
          </Card>

          {/* Page Settings */}
          <Card className="p-4">
            <h4 className="font-medium mb-4">Page Settings</h4>
            <div className="space-y-4">
              <div>
                <label
                  className="text-sm font-medium block mb-2"
                  htmlFor="page-format-select"
                >
                  Page Format
                </label>
                <select
                  id="page-format-select"
                  value={settings.pageFormat}
                  onChange={(e) => updateSetting("pageFormat", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#23407a] focus:border-transparent"
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
                  htmlFor="orientation-select"
                >
                  Orientation
                </label>
                <select
                  id="orientation-select"
                  value={settings.orientation}
                  onChange={(e) => updateSetting("orientation", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#23407a] focus:border-transparent"
                >
                  <option value="portrait">Portrait</option>
                  <option value="landscape">Landscape</option>
                </select>
              </div>

              <div>
                <label
                  className="text-sm font-medium block mb-2"
                  htmlFor="quality-range"
                >
                  Quality ({settings.quality}x)
                </label>
                <input
                  id="quality-range"
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.1"
                  value={settings.quality}
                  onChange={(e) =>
                    updateSetting("quality", parseFloat(e.target.value))
                  }
                  className="w-full"
                />
              </div>
            </div>
          </Card>

          {/* Bulk Settings */}
          {type === "bulk" && (
            <Card className="p-4">
              <h4 className="font-medium mb-4">Bulk Export Settings</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label
                    className="text-sm font-medium"
                    htmlFor="separate-pages-switch"
                  >
                    Separate Pages
                  </label>
                  <Switch
                    id="separate-pages-switch"
                    checked={settings.separatePages}
                    onCheckedChange={(checked) =>
                      updateSetting("separatePages", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label
                    className="text-sm font-medium"
                    htmlFor="table-of-contents-switch"
                  >
                    Table of Contents
                  </label>
                  <Switch
                    id="table-of-contents-switch"
                    checked={settings.includeTableOfContents}
                    onCheckedChange={(checked) =>
                      updateSetting("includeTableOfContents", checked)
                    }
                  />
                </div>
              </div>
            </Card>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setShowSettings(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setShowSettings(false);
                handleGenerate();
              }}
              disabled={generating}
            >
              Generate PDF
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
