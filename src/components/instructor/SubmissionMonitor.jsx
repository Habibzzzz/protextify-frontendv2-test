// src/components/instructor/SubmissionMonitor.jsx
import { Link } from "react-router-dom";
import { FileText, Clock, CheckCircle, Eye, Star } from "lucide-react";
import { Button, Card, CardHeader, CardTitle, CardContent } from "../ui";
import ExportCenter from "../export/ExportCenter";
import SubmissionActions from "../submission/SubmissionActions";

// Hanya status yang didukung BE
const getStatusIcon = (status) => {
  switch (status) {
    case "SUBMITTED":
      return <Clock className="h-4 w-4 text-yellow-600" />;
    case "GRADED":
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    default:
      return <FileText className="h-4 w-4 text-gray-600" />;
  }
};

const getStatusText = (status) => {
  switch (status) {
    case "SUBMITTED":
      return "Menunggu Penilaian";
    case "GRADED":
      return "Sudah Dinilai";
    default:
      return "Draft";
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case "SUBMITTED":
      return "bg-yellow-100";
    case "GRADED":
      return "bg-green-100";
    default:
      return "bg-gray-100";
  }
};

const SubmissionMonitor = ({
  submissions,
  pendingCount,
  assignment: _assignment,
}) => {
  // Prioritas: hanya submission dengan status SUBMITTED
  const getPrioritySubmissions = () => {
    return submissions
      .filter((s) => s.status === "SUBMITTED")
      .sort(
        (a, b) =>
          new Date(a.submittedAt || a.updatedAt) -
          new Date(b.submittedAt || b.updatedAt)
      );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Monitor Submission
            {pendingCount > 0 && (
              <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                {pendingCount} pending
              </span>
            )}
          </CardTitle>
          <Link to="/instructor/classes">
            <Button variant="ghost" size="sm">
              Lihat Semua
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {pendingCount > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-yellow-600 mr-2" />
                <div>
                  <h4 className="font-medium text-yellow-800">
                    Prioritas Tinggi
                  </h4>
                  <p className="text-sm text-yellow-700">
                    {pendingCount} submission menunggu penilaian Anda
                  </p>
                </div>
              </div>
            </div>
          )}

          {getPrioritySubmissions()
            .slice(0, 5)
            .map((submission) => (
              <div
                key={submission.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-start space-x-3 flex-1">
                  <div
                    className={`p-2 rounded-full ${getStatusColor(
                      submission.status
                    )}`}
                  >
                    {getStatusIcon(submission.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {submission.assignment?.title ||
                        submission.assignmentTitle ||
                        "Tugas"}
                    </p>
                    <p className="text-xs text-gray-600 truncate">
                      {submission.student?.fullName || "-"} •{" "}
                      {submission.className || ""}
                    </p>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <span>{getStatusText(submission.status)}</span>
                      <span className="mx-2">•</span>
                      <span>
                        {submission.submittedAt
                          ? new Date(submission.submittedAt).toLocaleDateString(
                              "id-ID",
                              {
                                day: "numeric",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )
                          : new Date(submission.updatedAt).toLocaleDateString(
                              "id-ID",
                              {
                                day: "numeric",
                                month: "short",
                              }
                            )}
                      </span>
                    </div>
                    {typeof submission.grade === "number" && (
                      <div className="mt-1">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          <Star className="h-3 w-3 mr-1" />
                          Nilai: {submission.grade}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <Link to={`/instructor/submissions/${submission.id}/grade`}>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    {submission.status === "SUBMITTED" ? "Nilai" : "Lihat"}
                  </Button>
                </Link>
              </div>
            ))}

          {submissions.length === 0 && (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">Belum ada submission</p>
              <p className="text-sm text-gray-400">
                Submission akan muncul di sini setelah siswa mulai mengerjakan
                tugas
              </p>
            </div>
          )}
        </div>
      </CardContent>
      <div className="space-y-6">
        {/* Bulk Actions */}
        {/* <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Bulk Actions</h3>
            <SubmissionActions
              submissions={submissions}
              type="bulk"
              onActionComplete={() => {
                // Handle completion
              }}
            />
          </div> */}

        {/* Export Center */}
        {/* <ExportCenter
            submissions={submissions}
            assignmentTitle={assignment?.title}
          /> */}
        {/* </Card> */}
      </div>
    </Card>
  );
};

export default SubmissionMonitor;
