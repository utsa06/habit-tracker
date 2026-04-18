import ProgressBar from "./ProgressBar";

const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];
const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const JS_DAYS = [1, 2, 3, 4, 5, 6, 0];

const CIRCLE_STYLES = {
  completed: "bg-success-500 border-success-500 text-white",
  scheduled: "border-accent-300 text-accent-400",
  off: "border-surface-200 text-surface-300",
};

function getMonday() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - ((date.getDay() + 6) % 7));
  return date;
}

function getWeekCompletions(habit) {
  const monday = getMonday();
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  return (habit.completions || []).filter((entry) => {
    const date = new Date(entry);
    return date >= monday && date <= endOfToday;
  });
}

function getDayState(index, schedule, weekCompletions) {
  const isCompleted = weekCompletions.some(
    (entry) => new Date(entry).getDay() === JS_DAYS[index]
  );

  if (isCompleted) return "completed";
  if (schedule.includes(DAY_NAMES[index])) return "scheduled";
  return "off";
}

function calculateStreak(habit) {
  const completions = new Set(habit.completions || []);
  let streak = 0;
  const date = new Date();

  while (true) {
    const value = date.toISOString().split("T")[0];
    if (!completions.has(value)) break;
    streak += 1;
    date.setDate(date.getDate() - 1);
  }

  return streak;
}

export default function HabitCard({ habit, onToggleComplete, onEdit, onDelete }) {
  const weekCompletions = getWeekCompletions(habit);
  const streak = calculateStreak(habit);
  const todayName = DAY_NAMES[(new Date().getDay() + 6) % 7];
  const todayScheduled = habit.schedule.includes(todayName);
  const today = new Date().toISOString().split("T")[0];
  const doneToday = (habit.completions || []).includes(today);
  const weeklyTarget = habit.schedule.length;
  const progressValue = weeklyTarget
    ? Math.min(1, weekCompletions.length / weeklyTarget)
    : 0;
  const canToggleToday = todayScheduled || doneToday;

  return (
    <div className="group rounded-2xl border border-surface-200 bg-white p-5 transition-shadow duration-200 hover:shadow-md hover:shadow-surface-200/60">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          {canToggleToday && (
            <button
              type="button"
              onClick={() => onToggleComplete(habit._id)}
              className="mt-0.5 cursor-pointer shrink-0"
              aria-label={doneToday ? "Mark not done" : "Mark done"}
              title={doneToday ? "Completed today" : "Mark today as done"}
            >
              {doneToday ? (
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-success-500 shadow-sm shadow-success-400/30 transition-transform duration-200 hover:scale-110">
                  <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </span>
              ) : (
                <span className="block h-7 w-7 rounded-full border-2 border-surface-300 transition-colors duration-200 hover:border-accent-400" />
              )}
            </button>
          )}

          <div className="min-w-0">
            <h3 className={`truncate text-[14px] font-semibold ${doneToday ? "text-surface-400 line-through" : "text-surface-800"}`}>
              {habit.name}
            </h3>
            {habit.goal && <p className="mt-0.5 truncate text-[12px] text-surface-400">{habit.goal}</p>}
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {streak > 0 && (
            <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-500">
              <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M12.395 2.553a1 1 0 0 0-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 0 0-.613 3.58 2.64 2.64 0 0 1-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 0 0 5.05 6.05 6.981 6.981 0 0 0 3 11a7 7 0 0 0 11.95 4.95c.592-.591.98-1.29 1.216-2.025.228-.708.301-1.506.165-2.376-.15-.963-.534-1.996-1.17-3.09-.635-1.09-1.52-2.265-2.602-3.4l-1.164-1.506Z"
                  clipRule="evenodd"
                />
              </svg>
              {streak}
            </span>
          )}

          <div className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              onClick={() => onEdit(habit)}
              className="cursor-pointer rounded-lg p-1.5 text-surface-400 transition-colors hover:bg-surface-100 hover:text-surface-600"
              aria-label="Edit"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" />
              </svg>
            </button>
            <button
              onClick={() => onDelete(habit)}
              className="cursor-pointer rounded-lg p-1.5 text-surface-400 transition-colors hover:bg-danger-400/10 hover:text-danger-500"
              aria-label="Delete"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="mb-3 flex items-center gap-1.5">
        {DAY_LABELS.map((label, index) => {
          const state = getDayState(index, habit.schedule, weekCompletions);

          return (
            <div key={`${habit._id}-${label}-${index}`} className="flex flex-col items-center gap-0.5">
              <span className="text-[9px] font-medium text-surface-400">{label}</span>
              <span className={`flex h-6 w-6 items-center justify-center rounded-full border-[1.5px] ${CIRCLE_STYLES[state]}`}>
                {state === "completed" && (
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                )}
              </span>
            </div>
          );
        })}
      </div>

      <ProgressBar value={progressValue} />
    </div>
  );
}
