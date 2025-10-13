import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  Users,
  FileText,
  Settings,
  Copy,
  Plus,
  Eye,
  Calendar,
  Clock,
  Activity,
  UserPlus,
  FilePlus,
  Star,
  CheckCircle,
} from "lucide-react";
import toast from "react-hot-toast";

import {
  Container,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Alert,
  LoadingSpinner,
  Breadcrumb,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  MemberManagement,
  Badge,
} from "../../components";
import { classesService } from "../../services";
import { useAsyncData } from "../../hooks/useAsyncData";
import { formatDate, formatRelativeTime } from "../../utils/helpers";

export default function ClassDetail() {
  const { classId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("overview");

  const {
    data: classDetail,
    loading,
    error,
    refetch,
  } = useAsyncData(() => classesService.getClassById(classId), [classId]);

  // Show success message if coming from create class
  useEffect(() => {
    if (location.state?.isNewClass) {
      toast.success("Kelas berhasil dibuat! Token kelas telah dibuat.");
      // Update URL state to remove the flag
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, navigate, location.pathname]);

  if (loading) {
    return (
      <Container className="py-6">
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-6">
        <Alert variant="error">
          <p>Gagal memuat detail kelas: {error.message}</p>
          <Button onClick={refetch} size="sm" className="mt-3">
            Coba Lagi
          </Button>
        </Alert>
      </Container>
    );
  }

  const copyClassToken = () => {
    navigator.clipboard.writeText(classDetail.classToken);
    toast.success("Token kelas disalin ke clipboard!");
  };

  const studentsCount = classDetail?.enrollments?.length || 0;
  const assignmentsCount = classDetail?.assignments?.length || 0;
  const activeAssignments =
    classDetail?.assignments?.filter((a) => a.active).length || 0;

  return (
    <Container className="py-6">
      {/* Breadcrumb */}
      <Breadcrumb />

      {/* Header */}
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/instructor/classes")}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">
            {classDetail?.name}
          </h1>
          <p className="text-gray-600">
            {classDetail?.description || "Tidak ada deskripsi"}
          </p>
        </div>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={() => navigate(`/instructor/classes/${classId}/settings`)}
          >
            <Settings className="h-4 w-4 mr-2" />
            Pengaturan
          </Button>
          <Button
            onClick={() =>
              navigate(`/instructor/classes/${classId}/create-assignment`)
            }
            className="bg-[#23407a] hover:bg-[#1a2f5c]"
          >
            <Plus className="h-4 w-4 mr-2" />
            Buat Tugas
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Siswa</p>
                <p className="text-2xl font-bold text-gray-900">
                  {studentsCount}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Tugas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {assignmentsCount}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tugas Aktif</p>
                <p className="text-2xl font-bold text-gray-900">
                  {activeAssignments}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Dibuat</p>
                <p className="text-sm font-bold text-gray-900">
                  {formatDate(classDetail?.createdAt)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Class Token */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Token Kelas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm text-gray-600 mb-1">
                Bagikan token ini kepada siswa untuk bergabung ke kelas
              </p>
              <div className="flex items-center space-x-3">
                <span className="font-mono text-lg font-bold bg-white px-3 py-2 rounded border">
                  {classDetail?.classToken}
                </span>
                <Button size="sm" variant="outline" onClick={copyClassToken}>
                  <Copy className="h-4 w-4 mr-2" />
                  Salin
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="assignments">
            Tugas ({assignmentsCount})
          </TabsTrigger>
          <TabsTrigger value="members">Anggota ({studentsCount})</TabsTrigger>
          <TabsTrigger value="activity">Aktivitas</TabsTrigger>
          <TabsTrigger value="history">Riwayat</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab classDetail={classDetail} navigate={navigate} />
        </TabsContent>

        <TabsContent value="assignments">
          <AssignmentsTab classDetail={classDetail} />
        </TabsContent>

        <TabsContent value="members">
          <MemberManagement classDetail={classDetail} onRefresh={refetch} />
        </TabsContent>

        <TabsContent value="activity">
          <ActivityTab classDetail={classDetail} />
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Riwayat Submission Lengkap</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Lihat semua submission dari semua tugas di kelas ini dalam satu
                halaman.
              </p>
              <Button
                onClick={() =>
                  navigate(`/instructor/classes/${classId}/history`)
                }
              >
                <FileText className="h-4 w-4 mr-2" />
                Buka Riwayat Submission
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Container>
  );
}

// Overview Tab Component
function OverviewTab({ classDetail, navigate }) {
  const recentAssignments = classDetail?.assignments?.slice(0, 3) || [];
  const recentStudents = classDetail?.enrollments?.slice(0, 5) || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Recent Assignments */}
      <Card>
        <CardHeader>
          <CardTitle>Tugas Terbaru</CardTitle>
        </CardHeader>
        <CardContent>
          {recentAssignments.length > 0 ? (
            <div className="space-y-3">
              {recentAssignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {assignment.title}
                    </h4>
                    <p className="text-sm text-gray-600">
                      Deadline: {formatDate(assignment.deadline)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {assignment.active && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Aktif
                      </span>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        navigate(`/instructor/assignments/${assignment.id}`)
                      }
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Belum ada tugas</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Students */}
      <Card>
        <CardHeader>
          <CardTitle>Siswa Terbaru</CardTitle>
        </CardHeader>
        <CardContent>
          {recentStudents.length > 0 ? (
            <div className="space-y-3">
              {recentStudents.map((enrollment) => (
                <div
                  key={enrollment.student.id}
                  className="flex items-center p-3 bg-gray-50 rounded-lg"
                >
                  <div className="w-8 h-8 bg-[#23407a] rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {enrollment.student.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-gray-900">
                      {enrollment.student.fullName}
                    </p>
                    <p className="text-sm text-gray-600">
                      Bergabung: {formatDate(enrollment.joinedAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Belum ada siswa</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Assignments Tab Component
function AssignmentsTab({ classDetail }) {
  const navigate = useNavigate();
  const assignments = classDetail?.assignments || [];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Daftar Tugas</h3>
        <Button
          onClick={() =>
            navigate(`/instructor/classes/${classDetail.id}/create-assignment`)
          }
          className="bg-[#23407a] hover:bg-[#1a2f5c]"
        >
          <Plus className="h-4 w-4 mr-2" />
          Buat Tugas Baru
        </Button>
      </div>

      {assignments.length > 0 ? (
        <div className="space-y-4">
          {assignments.map((assignment) => (
            <Card
              key={assignment.id}
              className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              onClick={() =>
                navigate(`/instructor/assignments/${assignment.id}`)
              }
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-gray-900 text-lg">
                        {assignment.title}
                      </h4>
                      {assignment.active && (
                        <Badge className="bg-green-100 text-green-800">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                          Aktif
                        </Badge>
                      )}
                    </div>
                    <div
                      className="text-sm text-gray-600 mb-4"
                      dangerouslySetInnerHTML={{
                        __html: assignment.instructions
                          ? assignment.instructions.substring(0, 150) +
                            (assignment.instructions.length > 150 ? "..." : "")
                          : "Tidak ada instruksi.",
                      }}
                    />
                    <div className="flex items-center space-x-6 text-sm">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-2 text-[#23407a]" />
                        <span>Deadline: {formatDate(assignment.deadline)}</span>
                      </div>
                      {/* Hapus expectedStudentCount dan submission count */}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/instructor/assignments/${assignment.id}`);
                    }}
                    className="border-[#23407a] text-[#23407a] hover:bg-[#23407a] hover:text-white"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Detail
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Belum ada tugas
            </h3>
            <p className="text-gray-600 mb-6">
              Buat tugas pertama untuk siswa di kelas ini
            </p>
            <Button
              onClick={() =>
                navigate(
                  `/instructor/classes/${classDetail.id}/create-assignment`
                )
              }
              className="bg-[#23407a] hover:bg-[#1a2f5c]"
            >
              <Plus className="h-4 w-4 mr-2" />
              Buat Tugas Pertama
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Students Tab Component
function StudentsTab({ classDetail }) {
  const students = classDetail?.enrollments || [];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Daftar Siswa</h3>
        <p className="text-sm text-gray-600">Total: {students.length} siswa</p>
      </div>

      {students.length > 0 ? (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium text-gray-900">
                      Nama Siswa
                    </th>
                    {/* Hapus kolom Email dan Institusi */}
                    <th className="text-left p-4 font-medium text-gray-900">
                      Bergabung
                    </th>
                    <th className="text-left p-4 font-medium text-gray-900">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((enrollment) => (
                    <tr
                      key={enrollment.student.id}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="p-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-[#23407a] rounded-full flex items-center justify-center text-white text-sm font-medium mr-3">
                            {enrollment.student.fullName
                              .charAt(0)
                              .toUpperCase()}
                          </div>
                          <span className="font-medium text-gray-900">
                            {enrollment.student.fullName}
                          </span>
                        </div>
                      </td>
                      {/* Hapus kolom Email dan Institusi */}
                      <td className="p-4 text-gray-600">
                        {formatDate(enrollment.joinedAt)}
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Aktif
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Belum ada siswa
            </h3>
            <p className="text-gray-600 mb-6">
              Bagikan token kelas kepada siswa untuk bergabung
            </p>
            <div className="flex items-center justify-center space-x-3">
              <span className="font-mono text-lg font-bold bg-gray-100 px-3 py-2 rounded">
                {classDetail?.classToken}
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(classDetail?.classToken);
                  toast.success("Token disalin!");
                }}
              >
                <Copy className="h-4 w-4 mr-2" />
                Salin Token
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Enhanced Activity Tab Component
function ActivityTab({ classDetail }) {
  const {
    data: activities,
    loading,
    error,
    refetch,
  } = useAsyncData(
    () => classesService.getClassActivityFeed(classDetail.id, 30),
    [classDetail.id]
  );

  const renderActivityIcon = (type) => {
    const icons = {
      STUDENT_JOINED: {
        icon: UserPlus,
        bg: "bg-blue-100",
        text: "text-blue-600",
      },
      ASSIGNMENT_CREATED: {
        icon: FilePlus,
        bg: "bg-green-100",
        text: "text-green-600",
      },
      SUBMISSION_GRADED: {
        icon: Star,
        bg: "bg-yellow-100",
        text: "text-yellow-600",
      },
      SUBMISSION_SUBMITTED: {
        icon: CheckCircle,
        bg: "bg-purple-100",
        text: "text-purple-600",
      },
    };
    const config = icons[type] || {
      icon: Activity,
      bg: "bg-gray-100",
      text: "text-gray-600",
    };
    const Icon = config.icon;
    return (
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center ring-8 ring-white ${config.bg}`}
      >
        <Icon className={`h-5 w-5 ${config.text}`} />
      </div>
    );
  };

  const renderActivityDetails = (activity) => {
    const { type, details } = activity;
    switch (type) {
      case "STUDENT_JOINED":
        return (
          <p>
            <span className="font-semibold">{details.studentName}</span> telah
            bergabung dengan kelas.
          </p>
        );
      case "ASSIGNMENT_CREATED":
        return (
          <p>
            Tugas baru{" "}
            <span className="font-semibold">"{details.assignmentTitle}"</span>{" "}
            telah dibuat.
          </p>
        );
      case "SUBMISSION_GRADED":
        return (
          <p>
            <span className="font-semibold">{details.studentName}</span>{" "}
            mendapat nilai{" "}
            <span className="font-semibold">{details.grade}</span> untuk tugas{" "}
            <span className="font-semibold">"{details.assignmentTitle}"</span>.
          </p>
        );
      case "SUBMISSION_SUBMITTED":
        return (
          <p>
            <span className="font-semibold">{details.studentName}</span> telah
            mengumpulkan tugas{" "}
            <span className="font-semibold">"{details.assignmentTitle}"</span>.
          </p>
        );
      default:
        return <p>Aktivitas tidak dikenal.</p>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="error" title="Gagal Memuat Aktivitas">
        <p>{error.message || "Terjadi kesalahan saat mengambil data."}</p>
        <Button onClick={refetch} size="sm" className="mt-4">
          Coba Lagi
        </Button>
      </Alert>
    );
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Activity className="h-5 w-5 mr-2" />
          Aktivitas Terbaru
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activities && activities.length > 0 ? (
          <div className="relative pl-4">
            {/* Timeline line */}
            <div className="absolute left-9 top-0 h-full w-0.5 bg-gray-200"></div>
            <div className="space-y-8">
              {activities.map((activity) => (
                <div key={activity.id} className="relative flex items-start">
                  <div className="relative z-10">
                    {renderActivityIcon(activity.type)}
                  </div>
                  <div className="ml-6 flex-1">
                    <div className="text-sm text-gray-800">
                      {renderActivityDetails(activity)}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatRelativeTime(activity.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Belum Ada Aktivitas
            </h3>
            <p className="text-gray-600">
              Aktivitas akan muncul di sini saat ada interaksi di dalam kelas.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
