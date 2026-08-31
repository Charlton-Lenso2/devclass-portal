import { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import {
  ListChecks,
  Bell,
  Megaphone,
  UserCircle,
  ShieldCheck,
  FolderKanban,
  BarChart3,
  X,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const studentSteps = [
  {
    icon: Sparkles,
    title: "Welcome to DevClass Portal",
    text: "Everything about your class — assignments, deadlines, and announcements — lives in one place from now on.",
  },
  {
    icon: ListChecks,
    title: "Track your Activities",
    text: "Every assignment, exercise, project, and event shows up here with a live status: Active, Due Soon, or Expired — so you always know what's urgent.",
  },
  {
    icon: Bell,
    title: "Get notified automatically",
    text: "You'll get a notification when new work is posted and again as deadlines get close. The bell icon shows how many you haven't seen yet.",
  },
  {
    icon: Megaphone,
    title: "Check Announcements",
    text: "Class-wide updates from your admin show up here — separate from individual assignments.",
  },
  {
    icon: UserCircle,
    title: "You're all set",
    text: "Update your name, email, or add a profile picture anytime from your Profile page.",
  },
];

const adminSteps = [
  {
    icon: Sparkles,
    title: "Welcome, Admin",
    text: "You're one of the class administrators — here's a quick tour of what you can manage.",
  },
  {
    icon: ListChecks,
    title: "Create & manage Activities",
    text: "Post assignments, exercises, projects, and events. Students are notified automatically the moment you create one.",
  },
  {
    icon: FolderKanban,
    title: "Organize with Categories",
    text: "Group activities by topic so students can find related work more easily.",
  },
  {
    icon: BarChart3,
    title: "Watch your Dashboard",
    text: "See class-wide stats at a glance — due-soon counts, expired activities needing review, and your most active category.",
  },
  {
    icon: ShieldCheck,
    title: "See who's reading",
    text: "On any activity, you can check exactly which students have seen it — and follow up with the ones who haven't.",
  },
];

export default function OnboardingModal({ onClose }) {
  const { user, setUser } = useAuth();
  const [step, setStep] = useState(0);
  const steps = user?.role === "ADMIN" ? adminSteps : studentSteps;
  const isLast = step === steps.length - 1;
  const current = steps[step];
  const Icon = current.icon;

  async function finish() {
    try {
      const res = await api.patch("/users/me/onboarded");
      if (setUser) setUser(res.data);
    } catch {
      // even if the save fails, don't trap the user in the modal
    } finally {
      onClose();
    }
  }

  return (
    <div className="onboarding-overlay">
      <div className="onboarding-modal">
        <button className="onboarding-skip" onClick={finish} aria-label="Skip onboarding">
          <X size={18} />
        </button>

        <div className="onboarding-icon">
          <Icon size={28} />
        </div>

        <h2 className="onboarding-title">{current.title}</h2>
        <p className="onboarding-text">{current.text}</p>

        <div className="onboarding-dots">
          {steps.map((_, i) => (
            <span key={i} className={`onboarding-dot ${i === step ? "onboarding-dot-active" : ""}`} />
          ))}
        </div>

        <div className="onboarding-actions">
          {!isLast && (
            <button className="onboarding-skip-link" onClick={finish}>
              Skip
            </button>
          )}
          <button
            className="btn-primary"
            onClick={() => (isLast ? finish() : setStep(step + 1))}
          >
            {isLast ? "Get started" : "Next"}
            {!isLast && <ArrowRight size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}