import React, { createContext, useContext, useEffect, useState } from "react";
import { User, UserRole } from "../types";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  demoUsers: User[];
  login: (emailOrPhone?: string, password?: string, role?: UserRole, userId?: string, phone?: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  switchRole: (role: UserRole) => Promise<void>;
  updateUserPreferences: (prefs: Partial<User>) => void;
  register: (userData: {
    name: string;
    email?: string;
    password?: string;
    phone?: string;
    whatsapp?: string;
    role: UserRole;
    district: string;
    zone?: string;
    organization?: string;
  }) => Promise<{ success: boolean; message?: string }>;
}

const DEFAULT_DEMO_USERS: User[] = [
  {
    id: "user-1",
    name: "Md. Rafiqul Islam",
    nameBn: "মোঃ রফিকুল ইসলাম",
    email: "rafiqul.farmer@agrivision.bd",
    phone: "+8801731460855",
    whatsapp: "+8801731460855",
    role: "farmer",
    district: "Rajshahi",
    organization: "Rajshahi Krishi Samiti",
    assignedFieldIds: ["fld-rajshahi-brri28"],
    preferredLanguage: "bn",
    emailAlertsEnabled: true,
  },
  {
    id: "user-2",
    name: "Dr. Farhana Yasmin",
    nameBn: "ড. ফারহানা ইয়াসমিন",
    email: "farhana.dae@moa.gov.bd",
    phone: "+880 1819-876543",
    role: "agronomist",
    district: "Bogura",
    organization: "Department of Agricultural Extension (DAE)",
    assignedFieldIds: ["fld-rajshahi-brri28", "fld-bogura-potato", "fld-dinajpur-aromatic"],
    preferredLanguage: "en",
    emailAlertsEnabled: true,
  },
  {
    id: "user-3",
    name: "Prof. Dr. Anisur Rahman",
    nameBn: "অধ্যাপক ড. আনিসুর রহমান",
    email: "anisur.bari@research.ac.bd",
    phone: "+880 1912-345678",
    role: "researcher",
    district: "Mymensingh",
    organization: "Bangladesh Agricultural University (BAU)",
    assignedFieldIds: ["fld-mymensingh-mustard", "fld-jashore-wheat"],
    preferredLanguage: "en",
    emailAlertsEnabled: false,
  },
  {
    id: "user-4",
    name: "Ziaur Rahman (Admin)",
    nameBn: "জিয়াউর রহমান (এডমিন)",
    email: "zrziaur360@gmail.com",
    phone: "+8801731460855",
    whatsapp: "+8801731460855",
    role: "admin",
    district: "Dhaka",
    organization: "AgriVision System Administration",
    assignedFieldIds: ["fld-rajshahi-brri28", "fld-bogura-potato", "fld-dinajpur-aromatic", "fld-mymensingh-mustard", "fld-jashore-wheat"],
    preferredLanguage: "en",
    emailAlertsEnabled: true,
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const [demoUsers, setDemoUsers] = useState<User[]>(DEFAULT_DEMO_USERS);

  useEffect(() => {
    // 1. Restore persistent user session from localStorage
    try {
      const savedUser = localStorage.getItem("agrivision_auth_user");
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed && parsed.email) {
          setUser(parsed);
        }
      }
    } catch {
      // ignore
    }

    // 2. Fetch live users from backend
    fetch("/api/auth/demo-users")
      .then((res) => res.json())
      .then((data) => {
        if (data.users && Array.isArray(data.users)) {
          setDemoUsers(data.users);
        }
      })
      .catch(() => {
        // use fallback
      });
  }, []);

  const login = async (emailOrPhone?: string, password?: string, role?: UserRole, userId?: string, phone?: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const isPhoneLike = (emailOrPhone && !emailOrPhone.includes("@") && /[0-9]/.test(emailOrPhone)) || !!phone;
      const cleanPhone = phone || (isPhoneLike ? emailOrPhone : undefined);

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: !isPhoneLike ? emailOrPhone : undefined,
          phone: cleanPhone,
          whatsapp: cleanPhone,
          identifier: emailOrPhone,
          password,
          role,
          userId,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success && data.user) {
        setUser(data.user);
        localStorage.setItem("agrivision_auth_user", JSON.stringify(data.user));
        return { success: true };
      }
      if (data.error) {
        return { success: false, message: data.error };
      }
    } catch {
      // Local fallback
      const digits = (phone || (emailOrPhone && !emailOrPhone.includes("@") ? emailOrPhone : "")).replace(/[^0-9]/g, "");
      const found = demoUsers.find((u) => {
        if (userId) return u.id === userId;
        if (digits && digits.length >= 6) {
          const uP = (u.phone || "").replace(/[^0-9]/g, "");
          const uW = (u.whatsapp || "").replace(/[^0-9]/g, "");
          return uP.endsWith(digits.slice(-10)) || uW.endsWith(digits.slice(-10));
        }
        if (emailOrPhone && u.email.toLowerCase() === emailOrPhone.toLowerCase()) return true;
        if (role && u.role === role) return true;
        return false;
      });
      if (found) {
        setUser(found);
        localStorage.setItem("agrivision_auth_user", JSON.stringify(found));
        return { success: true };
      }
    }
    return { success: false, message: "অ্যাকাউন্ট তৈরি বা লগইন করতে সমস্যা হয়েছে। তথ্য আবার পরোক্ষ করুন।" };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("agrivision_auth_user");
  };

  const switchRole = async (role: UserRole) => {
    const target = demoUsers.find((u) => u.role === role) || demoUsers[0];
    await login(target.email, undefined, role, target.id);
  };

  const updateUserPreferences = async (prefs: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...prefs };
    setUser(updated);
    localStorage.setItem("agrivision_auth_user", JSON.stringify(updated));

    try {
      await fetch("/api/auth/update-preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          selectedZones: prefs.selectedZones,
          alertPreferences: prefs.alertPreferences,
          emailAlertsEnabled: prefs.emailAlertsEnabled,
        }),
      });
    } catch (err) {
      console.warn("Failed to update preferences on server:", err);
    }
  };

  const register = async (userData: {
    name: string;
    email?: string;
    password?: string;
    phone?: string;
    whatsapp?: string;
    role: UserRole;
    district: string;
    zone?: string;
    organization?: string;
  }): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setUser(data.user);
        localStorage.setItem("agrivision_auth_user", JSON.stringify(data.user));
        return { success: true };
      }
      if (data.error) {
        return { success: false, message: data.error };
      }
    } catch {
      // Local fallback
      const rawDigits = (userData.phone || userData.whatsapp || "").replace(/[^0-9]/g, "");
      const formattedPhone = rawDigits ? (rawDigits.startsWith("880") ? `+${rawDigits}` : `+880${rawDigits}`) : "+8801731460855";
      const fallbackEmail = userData.email || `wa.${rawDigits.slice(-6) || Date.now().toString().slice(-6)}@agrivision.bd`;

      const newUser: User = {
        id: `usr-${Date.now()}`,
        name: userData.name,
        nameBn: userData.name,
        email: fallbackEmail,
        phone: formattedPhone,
        whatsapp: formattedPhone,
        role: userData.role,
        district: userData.district,
        zone: userData.zone || "Central Zone",
        organization: userData.organization || (userData.role === "researcher" ? "Bangladesh Agricultural Research Council" : "Local Agriculture Cooperative"),
        assignedFieldIds: ["fld-rajshahi-brri28"],
        preferredLanguage: userData.role === "researcher" ? "en" : "bn",
        emailAlertsEnabled: true,
      };
      setUser(newUser);
      localStorage.setItem("agrivision_auth_user", JSON.stringify(newUser));
      return { success: true };
    }
    return { success: false, message: "রেজিস্ট্রেশন করতে সমস্যা হয়েছে।" };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        demoUsers,
        login,
        logout,
        switchRole,
        updateUserPreferences,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
