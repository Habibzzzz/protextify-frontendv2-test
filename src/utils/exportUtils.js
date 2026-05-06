// src/utils/exportUtils.js
const downloadBlob = (blob, filename) => {
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const createExcelWorkbook = async () => {
  const ExcelJS = await import("exceljs");
  const Workbook = ExcelJS.Workbook || ExcelJS.default?.Workbook;

  if (!Workbook) {
    throw new Error("Excel export library tidak dapat dimuat");
  }

  return new Workbook();
};

const addJsonWorksheet = (workbook, sheetName, rows) => {
  const worksheet = workbook.addWorksheet(sheetName);
  const columns = Object.keys(rows[0] || {});

  worksheet.columns = columns.map((column) => ({
    header: column,
    key: column,
    width: Math.max(14, Math.min(40, column.length + 4)),
  }));

  rows.forEach((row) => worksheet.addRow(row));
  worksheet.getRow(1).font = { bold: true };

  return worksheet;
};

const writeExcelFile = async (workbook, filename) => {
  const buffer = await workbook.xlsx.writeBuffer();
  downloadBlob(
    new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }),
    filename
  );
};

export const exportSubmissionsToCSV = (submissions, assignmentTitle) => {
  const headers = [
    "Nama Siswa",
    "Email",
    "Status",
    "Tanggal Dikumpulkan",
    "Nilai",
    "Plagiarisme (%)",
    "Feedback",
    "Institusi",
  ];

  const csvContent = [
    headers.join(","),
    ...submissions.map((submission) =>
      [
        `"${submission.student?.fullName || ""}"`,
        `"${submission.student?.email || ""}"`,
        `"${getStatusLabel(submission.status)}"`,
        `"${
          submission.submittedAt
            ? new Date(submission.submittedAt).toLocaleString("id-ID")
            : "Belum dikumpulkan"
        }"`,
        `"${submission.grade || "Belum dinilai"}"`,
        `"${submission.plagiarismScore || "Belum dicek"}"`,
        `"${submission.feedback || ""}"`,
        `"${submission.student?.institution || ""}"`,
      ].join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `submissions_${assignmentTitle}_${
        new Date().toISOString().split("T")[0]
      }.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export const exportSubmissionsToExcel = async (
  submissions,
  assignmentTitle
) => {
  const workbook = await createExcelWorkbook();
  const data = submissions.map((submission) => ({
      "Nama Siswa": submission.student?.fullName || "",
      Email: submission.student?.email || "",
      Status: getStatusLabel(submission.status),
      "Tanggal Dikumpulkan": submission.submittedAt
        ? new Date(submission.submittedAt).toLocaleString("id-ID")
        : "Belum dikumpulkan",
      Nilai: submission.grade || "Belum dinilai",
      "Plagiarisme (%)": submission.plagiarismScore || "Belum dicek",
      Feedback: submission.feedback || "",
      Institusi: submission.student?.institution || "",
      Kata: submission.wordCount || 0,
      "Terakhir Update": submission.updatedAt
        ? new Date(submission.updatedAt).toLocaleString("id-ID")
        : "",
    }));

  addJsonWorksheet(workbook, "Submissions", data);
  await writeExcelFile(
    workbook,
    `submissions_${assignmentTitle}_${
      new Date().toISOString().split("T")[0]
    }.xlsx`
  );
};

// Enhanced export functionality - add to existing exportUtils.js
// src/utils/exportUtils.js

// Add these new functions to existing exportUtils

// Enhanced CSV export with more options
export const exportSubmissionsToCSVAdvanced = (
  submissions,
  assignmentTitle,
  options = {}
) => {
  const {
    includeContent = false,
    includeTimestamps = true,
    includePlagiarismDetails = true,
    includeGrades = true,
    customFields = [],
  } = options;

  const baseHeaders = ["Nama Siswa", "Email", "Status", "Institusi"];

  if (includeTimestamps) {
    baseHeaders.push(
      "Tanggal Dibuat",
      "Tanggal Dikumpulkan",
      "Terakhir Update"
    );
  }

  if (includeContent) {
    baseHeaders.push("Konten", "Jumlah Kata");
  }

  if (includeGrades) {
    baseHeaders.push("Nilai", "Feedback");
  }

  if (includePlagiarismDetails) {
    baseHeaders.push("Skor Plagiarisme (%)", "Status Cek Plagiarisme");
  }

  // Add custom fields
  const headers = [...baseHeaders, ...customFields.map((field) => field.label)];

  const csvContent = [
    headers.join(","),
    ...submissions.map((submission) => {
      const baseData = [
        `"${submission.student?.fullName || ""}"`,
        `"${submission.student?.email || ""}"`,
        `"${getStatusLabel(submission.status)}"`,
        `"${submission.student?.institution || ""}"`,
      ];

      if (includeTimestamps) {
        baseData.push(
          `"${
            submission.createdAt
              ? new Date(submission.createdAt).toLocaleString("id-ID")
              : ""
          }"`,
          `"${
            submission.submittedAt
              ? new Date(submission.submittedAt).toLocaleString("id-ID")
              : "Belum dikumpulkan"
          }"`,
          `"${
            submission.updatedAt
              ? new Date(submission.updatedAt).toLocaleString("id-ID")
              : ""
          }"`
        );
      }

      if (includeContent) {
        baseData.push(
          `"${(submission.content || "").replace(/"/g, '""')}"`,
          `"${submission.wordCount || 0}"`
        );
      }

      if (includeGrades) {
        baseData.push(
          `"${submission.grade || "Belum dinilai"}"`,
          `"${(submission.feedback || "").replace(/"/g, '""')}"`
        );
      }

      if (includePlagiarismDetails) {
        baseData.push(
          `"${submission.plagiarismScore || "Belum dicek"}"`,
          `"${submission.plagiarismStatus || "Belum dicek"}"`
        );
      }

      // Add custom field data
      const customData = customFields.map((field) => {
        const value = field.getValue
          ? field.getValue(submission)
          : submission[field.key] || "";
        return `"${String(value).replace(/"/g, '""')}"`;
      });

      return [...baseData, ...customData].join(",");
    }),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `submissions_${assignmentTitle}_${
        new Date().toISOString().split("T")[0]
      }.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};

// Export to JSON format
export const exportSubmissionsToJSON = (
  submissions,
  assignmentTitle,
  options = {}
) => {
  const { prettify = true, includeMetadata = true } = options;

  const exportData = {
    ...(includeMetadata && {
      metadata: {
        exportedAt: new Date().toISOString(),
        assignmentTitle,
        totalSubmissions: submissions.length,
        exportedBy: "Protextify Platform",
      },
    }),
    submissions: submissions.map((submission) => ({
      id: submission.id,
      student: {
        id: submission.student?.id,
        fullName: submission.student?.fullName,
        email: submission.student?.email,
        institution: submission.student?.institution,
      },
      assignment: {
        id: submission.assignment?.id,
        title: submission.assignment?.title,
        deadline: submission.assignment?.deadline,
      },
      content: submission.content,
      status: submission.status,
      grade: submission.grade,
      feedback: submission.feedback,
      wordCount: submission.wordCount,
      plagiarismScore: submission.plagiarismScore,
      timestamps: {
        createdAt: submission.createdAt,
        updatedAt: submission.updatedAt,
        submittedAt: submission.submittedAt,
      },
    })),
  };

  const jsonString = prettify
    ? JSON.stringify(exportData, null, 2)
    : JSON.stringify(exportData);

  const blob = new Blob([jsonString], {
    type: "application/json;charset=utf-8;",
  });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `submissions_${assignmentTitle}_${
      new Date().toISOString().split("T")[0]
    }.json`
  );
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Export to XML format
export const exportSubmissionsToXML = (submissions, assignmentTitle) => {
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>\n';
  const xmlContent = `<submissions assignment="${assignmentTitle}" exported="${new Date().toISOString()}">
${submissions
  .map(
    (submission) => `
  <submission id="${submission.id}">
    <student>
      <id>${submission.student?.id || ""}</id>
      <fullName><![CDATA[${submission.student?.fullName || ""}]]></fullName>
      <email>${submission.student?.email || ""}</email>
      <institution><![CDATA[${
        submission.student?.institution || ""
      }]]></institution>
    </student>
    <content><![CDATA[${submission.content || ""}]]></content>
    <status>${submission.status || ""}</status>
    <grade>${submission.grade || ""}</grade>
    <feedback><![CDATA[${submission.feedback || ""}]]></feedback>
    <wordCount>${submission.wordCount || 0}</wordCount>
    <plagiarismScore>${submission.plagiarismScore || ""}</plagiarismScore>
    <createdAt>${submission.createdAt || ""}</createdAt>
    <updatedAt>${submission.updatedAt || ""}</updatedAt>
    <submittedAt>${submission.submittedAt || ""}</submittedAt>
  </submission>`
  )
  .join("")}
</submissions>`;

  const blob = new Blob([xmlHeader + xmlContent], {
    type: "application/xml;charset=utf-8;",
  });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `submissions_${assignmentTitle}_${
      new Date().toISOString().split("T")[0]
    }.xml`
  );
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Enhanced Excel export with multiple sheets
export const exportSubmissionsToExcelAdvanced = async (
  submissions,
  assignmentTitle,
  options = {}
) => {
  const {
    includeCharts = false,
    includeStatistics = true,
    separateSheetsByStatus = false,
  } = options;

  const workbook = await createExcelWorkbook();

  // Main submissions sheet
  const submissionsData = submissions.map((submission) => ({
    "Nama Siswa": submission.student?.fullName || "",
    Email: submission.student?.email || "",
    Status: getStatusLabel(submission.status),
    "Tanggal Dikumpulkan": submission.submittedAt
      ? new Date(submission.submittedAt).toLocaleString("id-ID")
      : "Belum dikumpulkan",
    Nilai: submission.grade || "Belum dinilai",
    "Plagiarisme (%)": submission.plagiarismScore || "Belum dicek",
    Feedback: submission.feedback || "",
    Institusi: submission.student?.institution || "",
    Kata: submission.wordCount || 0,
    "Terakhir Update": submission.updatedAt
      ? new Date(submission.updatedAt).toLocaleString("id-ID")
      : "",
  }));

  addJsonWorksheet(workbook, "All Submissions", submissionsData);

  // Separate sheets by status
  if (separateSheetsByStatus) {
    const statusGroups = submissions.reduce((groups, submission) => {
      const status = getStatusLabel(submission.status);
      if (!groups[status]) groups[status] = [];
      groups[status].push(submission);
      return groups;
    }, {});

    Object.entries(statusGroups).forEach(([status, statusSubmissions]) => {
      const statusData = statusSubmissions.map((submission) => ({
        "Nama Siswa": submission.student?.fullName || "",
        Email: submission.student?.email || "",
        "Tanggal Dikumpulkan": submission.submittedAt
          ? new Date(submission.submittedAt).toLocaleString("id-ID")
          : "Belum dikumpulkan",
        Nilai: submission.grade || "Belum dinilai",
        "Plagiarisme (%)": submission.plagiarismScore || "Belum dicek",
        Kata: submission.wordCount || 0,
      }));

      addJsonWorksheet(workbook, status, statusData);
    });
  }

  // Statistics sheet
  if (includeStatistics) {
    const stats = calculateSubmissionStatistics(submissions);
    const statsData = [
      { Metric: "Total Submissions", Value: stats.total },
      { Metric: "Submitted", Value: stats.submitted },
      { Metric: "Draft", Value: stats.draft },
      { Metric: "Graded", Value: stats.graded },
      { Metric: "Average Grade", Value: stats.averageGrade },
      { Metric: "Average Plagiarism Score", Value: stats.averagePlagiarism },
      { Metric: "Average Word Count", Value: stats.averageWordCount },
      { Metric: "Submission Rate", Value: `${stats.submissionRate}%` },
    ];

    addJsonWorksheet(workbook, "Statistics", statsData);
  }

  // Download file
  await writeExcelFile(
    workbook,
    `submissions_${assignmentTitle}_${
      new Date().toISOString().split("T")[0]
    }.xlsx`
  );
};

// Calculate submission statistics
export const calculateSubmissionStatistics = (submissions) => {
  const total = submissions.length;
  const submitted = submissions.filter((s) => s.status === "SUBMITTED").length;
  const draft = submissions.filter((s) => s.status === "DRAFT").length;
  const graded = submissions.filter((s) => s.status === "GRADED").length;

  const gradesWithValues = submissions.filter(
    (s) => s.grade && !isNaN(s.grade)
  );
  const averageGrade =
    gradesWithValues.length > 0
      ? (
          gradesWithValues.reduce((sum, s) => sum + parseFloat(s.grade), 0) /
          gradesWithValues.length
        ).toFixed(2)
      : "N/A";

  const plagiarismWithValues = submissions.filter(
    (s) => s.plagiarismScore && !isNaN(s.plagiarismScore)
  );
  const averagePlagiarism =
    plagiarismWithValues.length > 0
      ? (
          plagiarismWithValues.reduce(
            (sum, s) => sum + parseFloat(s.plagiarismScore),
            0
          ) / plagiarismWithValues.length
        ).toFixed(2)
      : "N/A";

  const wordCountWithValues = submissions.filter(
    (s) => s.wordCount && !isNaN(s.wordCount)
  );
  const averageWordCount =
    wordCountWithValues.length > 0
      ? Math.round(
          wordCountWithValues.reduce(
            (sum, s) => sum + parseInt(s.wordCount),
            0
          ) / wordCountWithValues.length
        )
      : "N/A";

  const submissionRate = total > 0 ? Math.round((submitted / total) * 100) : 0;

  return {
    total,
    submitted,
    draft,
    graded,
    averageGrade,
    averagePlagiarism,
    averageWordCount,
    submissionRate,
  };
};

// Export analytics data
export const exportAnalyticsData = (analyticsData, title) => {
  const { timeSeriesData = [], summaryStats = {}, charts = [] } = analyticsData;

  const exportData = {
    metadata: {
      title,
      exportedAt: new Date().toISOString(),
      dataType: "analytics",
    },
    summary: summaryStats,
    timeSeries: timeSeriesData,
    charts: charts.map((chart) => ({
      type: chart.type,
      title: chart.title,
      data: chart.data,
    })),
  };

  const jsonString = JSON.stringify(exportData, null, 2);
  const blob = new Blob([jsonString], {
    type: "application/json;charset=utf-8;",
  });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `analytics_${title}_${new Date().toISOString().split("T")[0]}.json`
  );
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Keep existing getStatusLabel function
const getStatusLabel = (status) => {
  const labels = {
    DRAFT: "Draft",
    SUBMITTED: "Dikumpulkan",
    GRADED: "Dinilai",
  };
  return labels[status] || status;
};
