const LINKEDIN_ANALYTICS_URL =
  "https://www.linkedin.com/analytics/creator/content/";

const steps = [
  {
    number: "1",
    title: "Open LinkedIn Analytics",
    description: "Go to your Creator Analytics page",
    action: (
      <a
        href={LINKEDIN_ANALYTICS_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-sm font-medium text-[var(--accent)] hover:underline"
      >
        Open LinkedIn Analytics &rarr;
      </a>
    ),
  },
  {
    number: "2",
    title: "Export your data",
    description: 'Click the "Export" button in the top right corner',
  },
  {
    number: "3",
    title: "Upload the file",
    description: "Drop the .xlsx file below to see your dashboard",
  },
];

export default function UploadInstructions() {
  return (
    <div className="mb-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {steps.map((step) => (
          <div
            key={step.number}
            className="flex items-start gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4"
          >
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-sm font-bold text-white">
              {step.number}
            </div>
            <div>
              <p className="font-medium">{step.title}</p>
              <p className="mt-0.5 text-sm text-[var(--muted)]">
                {step.description}
              </p>
              {step.action && <div className="mt-1">{step.action}</div>}
            </div>
          </div>
        ))}
      </div>
      <p className="mt-3 text-center text-xs text-[var(--muted)]">
        Your data never leaves your browser. Everything is processed locally.
      </p>
    </div>
  );
}
