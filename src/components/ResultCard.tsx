import { ShieldCheck, ShieldAlert, ShieldQuestion, AlertTriangle } from "lucide-react";

interface ResultCardProps {
  prediction: string;
  uncertainty: string;
  reasons: string[];
}

const ResultCard = ({ prediction, uncertainty, reasons }: ResultCardProps) => {
  const getConfig = () => {
    switch (prediction) {
      case "True News":
        return {
          icon: ShieldCheck,
          colorClass: "text-success border-success/30 bg-success/5",
          iconColor: "text-success",
          badge: "bg-success/15 text-success",
        };
      case "Fake News":
        return {
          icon: ShieldAlert,
          colorClass: "text-destructive border-destructive/30 bg-destructive/5",
          iconColor: "text-destructive",
          badge: "bg-destructive/15 text-destructive",
        };
      default:
        return {
          icon: ShieldQuestion,
          colorClass: "text-warning border-warning/30 bg-warning/5",
          iconColor: "text-warning",
          badge: "bg-warning/15 text-warning",
        };
    }
  };

  const config = getConfig();
  const Icon = config.icon;

  return (
    <div className={`rounded-xl border p-6 animate-fade-in-up ${config.colorClass}`}>
      <div className="flex items-center gap-4 mb-4">
        <div className={`p-3 rounded-lg ${config.badge}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <h3 className="font-display font-semibold text-lg">{prediction}</h3>
          <p className="font-mono text-sm opacity-75">{uncertainty}</p>
        </div>
      </div>

      {reasons.length > 0 && (
        <div className="mt-4 pt-4 border-t border-current/10">
          <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Reasons for Uncertainty
          </h4>
          <ul className="space-y-2">
            {reasons.map((reason, i) => (
              <li
                key={i}
                className="text-sm opacity-80 pl-4 border-l-2 border-current/20"
              >
                {reason}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ResultCard;
