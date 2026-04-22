// src/hooks/useStudentDashboard.js
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import {
  classesService,
  submissionsService,
  assignmentsService,
} from "../services";

export const useStudentDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalClasses: 0,
    activeAssignments: 0,
    completedAssignments: 0,
    pendingSubmissions: 0,
  });
  const [recentClasses, setRecentClasses] = useState([]);
  const [recentAssignments, setRecentAssignments] = useState([]);
  const [activityTimeline, setActivityTimeline] = useState([]);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch classes, submissions, and recent assignments in parallel
      const [classesData, submissionsData, recentAssignmentsData] =
        await Promise.allSettled([
          classesService.getClasses(),
          submissionsService.getHistory(),
          assignmentsService.getRecentAssignments(3),
        ]);

      // Safe handling untuk classesData
      const safeClassesData =
        classesData.status === "fulfilled" && Array.isArray(classesData.value)
          ? classesData.value
          : [];

      // Debug: Log classes data
      console.log("🔍 Student Dashboard - Classes Data:", {
        status: classesData.status,
        value: classesData.value,
        safeData: safeClassesData,
        count: safeClassesData.length
      });

      // Safe handling untuk submissionsData
      const safeSubmissionsData =
        submissionsData.status === "fulfilled" &&
        Array.isArray(submissionsData.value)
          ? submissionsData.value
          : [];

      // Safe handling untuk recentAssignmentsData
      const safeRecentAssignments =
        recentAssignmentsData.status === "fulfilled" &&
        Array.isArray(recentAssignmentsData.value)
          ? recentAssignmentsData.value
          : [];

      // Statistik activeAssignments dari assignments yang aktif dan belum lewat deadline
      const activeAssignments = safeClassesData.reduce(
        (acc, cls) =>
          acc +
          (cls.assignments?.filter(
            (a) => a.active && new Date(a.deadline) > new Date()
          ).length || 0),
        0
      );
      const completedAssignments = safeSubmissionsData.filter(
        (s) => s?.status === "SUBMITTED"
      ).length;
      const pendingSubmissions = safeSubmissionsData.filter(
        (s) => s?.status === "DRAFT"
      ).length;

      setStats({
        totalClasses: safeClassesData.length,
        activeAssignments,
        completedAssignments,
        pendingSubmissions,
      });

      setRecentClasses(safeClassesData.slice(0, 3));
      setRecentAssignments(safeRecentAssignments);

      // Activity timeline: hanya submission yang punya assignment
      const timeline = safeSubmissionsData
        .filter((submission) => submission && submission.assignment)
        .map((submission) => ({
          id: submission.id,
          assignment: submission.assignment,
          status: submission.status,
          grade: submission.grade ?? null,
          plagiarismScore: submission.plagiarismScore ?? null,
          plagiarismChecks: submission.plagiarismChecks ?? null,
          submittedAt: submission.submittedAt,
          updatedAt: submission.updatedAt,
          createdAt: submission.createdAt,
        }))
        .sort(
          (a, b) =>
            new Date(b.submittedAt || b.updatedAt || b.createdAt) -
            new Date(a.submittedAt || a.updatedAt || a.createdAt)
        )
        .slice(0, 10);

      setActivityTimeline(timeline);
    } catch (err) {
      const formattedError = {
        statusCode: err?.response?.data?.statusCode || err?.statusCode || 400,
        message:
          err?.response?.data?.message ||
          err?.message ||
          "Gagal memuat data dashboard",
      };
      setError(formattedError);
      toast.error(formattedError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const refetch = useCallback(() => {
    console.log("🔄 Refreshing student dashboard data...");
    fetchDashboardData();
  }, [fetchDashboardData]);

  const forceRefresh = useCallback(() => {
    console.log("🔄 Force refreshing student dashboard data...");
    setStats({
      totalClasses: 0,
      activeAssignments: 0,
      completedAssignments: 0,
      pendingSubmissions: 0,
    });
    setRecentClasses([]);
    setRecentAssignments([]);
    setActivityTimeline([]);
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    loading,
    error,
    stats,
    recentClasses,
    recentAssignments,
    activityTimeline,
    refetch,
    forceRefresh,
  };
};

export default useStudentDashboard;
