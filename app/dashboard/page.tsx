import FeatureAssistantsComponent from "@/components/dashboard/feature-assistants-component";
import FeedbackComponent from "@/components/dashboard/feedback";
import HistoryComponent from "@/components/dashboard/history";

const DashboardPage = () => {
  return (
    <div>
      <FeatureAssistantsComponent />
      <div className="grid grid-cols-1 md:grid-cols-2 mt-14 gap-10">
        <FeedbackComponent />
        <HistoryComponent />
      </div>
    </div>
  );
};

export default DashboardPage;
