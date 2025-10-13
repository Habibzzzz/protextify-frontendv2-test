import api from "./api";

/**
 * Mengambil data profil user yang sedang login.
 * @returns {object} user profile sesuai BE
 */
const getCurrentUser = async () => {
  try {
    const response = await api.get("/users/me");
    // Mapping sesuai BE
    return {
      id: response.id,
      email: response.email,
      fullName: response.fullName,
      institution: response.institution,
      phone: response.phone,
      role: response.role,
      emailVerified: response.emailVerified,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt,
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Update data profil user yang sedang login (fullName, institution).
 * @param {object} updateData { fullName?, institution? }
 * @returns {object} updated user profile sesuai BE
 */
const updateProfile = async (updateData) => {
  try {
    const response = await api.patch("/users/me", updateData);
    // Mapping sesuai BE
    return {
      id: response.id,
      email: response.email,
      fullName: response.fullName,
      institution: response.institution,
      phone: response.phone,
      bio: response.bio,
      avatarUrl: response.avatarUrl,
      role: response.role,
      emailVerified: response.emailVerified,
      updatedAt: response.updatedAt,
    };
  } catch (error) {
    throw error;
  }
};

const usersService = {
  getCurrentUser,
  updateProfile,
};

export default usersService;
