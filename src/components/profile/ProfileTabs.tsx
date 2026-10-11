interface ProfileTabsProps {
  activeTab: "info" | "tickets";
  onTabChange: (tab: "info" | "tickets") => void;
}

export const ProfileTabs = ({ activeTab, onTabChange }: ProfileTabsProps) => {
  return (
    <div className="flex gap-8 border-b border-white/10 pb-4">
      <button
        type="button"
        onClick={() => onTabChange("info")}
        className={`text-[15px] font-medium transition-colors relative pb-4 -mb-4 ${
          activeTab === "info"
            ? "text-white"
            : "text-text-secondary hover:text-white"
        }`}
      >
        Personal Information
        {activeTab === "info" && (
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-color-red" />
        )}
      </button>

      <button
        type="button"
        onClick={() => onTabChange("tickets")}
        className={`text-[15px] font-medium transition-colors relative pb-4 -mb-4 flex items-center gap-2 ${
          activeTab === "tickets"
            ? "text-white"
            : "text-text-secondary hover:text-white"
        }`}
      >
        My Tickets
        <span className="bg-color-red text-white text-[11px] px-2 py-0.5 rounded-full font-bold">
          2
        </span>
        {activeTab === "tickets" && (
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-color-red" />
        )}
      </button>
    </div>
  );
};
