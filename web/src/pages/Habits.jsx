import { useState } from "react";
import { useHabits } from "../hooks/useHabits";
import { useNotes } from "../hooks/useNotes";
import HabitCard from "../components/HabitCard";
import HabitModal from "../components/HabitModal";
import DeleteConfirm from "../components/DeleteConfirm";
import EmptyState from "../components/EmptyState";
import ErrorMessage from "../components/ErrorMessage";
import NotesPanel from "../components/NotesPanel";
import HabitFilterBar from "../components/HabitFilterBar";
import ToastNotification from "../components/ToastNotification";
import { useToast } from "../hooks/useToast";
import { handleError } from "../utils/handleError";

export default function Habits() {
  const [filters, setFilters] = useState({ status: 'all', sortBy: 'default' });
  const { habits, isLoading, error, fetchHabits, createHabit, updateHabit, deleteHabit, toggleCompletion } =
    useHabits(filters);
  const { notes, isLoading: notesLoading, createNote, deleteNote } = useNotes();
  const { toasts, addToast, removeToast } = useToast();

  const [modalHabit, setModalHabit] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  function openCreate() {
    setModalHabit(null);
    setShowModal(true);
  }

  function openEdit(habit) {
    setModalHabit(habit);
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setModalHabit(null);
  }

  async function handleSave(data) {
    try {
      if (modalHabit) await updateHabit(modalHabit._id, data);
      else await createHabit(data);
    } catch (err) {
      handleError(err, addToast, "Failed to save habit. Please try again.");
      throw err;
    }
  }

  async function handleDelete() {
    try {
      await deleteHabit(deleteTarget._id);
      setDeleteTarget(null);
    } catch (err) {
      handleError(err, addToast, "Failed to delete habit. Please try again.");
      setDeleteTarget(null);
    }
  }

  async function handleToggleToday(id) {
    try {
      await toggleCompletion(id);
    } catch (err) {
      handleError(err, addToast, "Failed to update habit. Please try again.");
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-7 w-7 animate-spin rounded-full border-[3px] border-accent-200 border-t-accent-500" />
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>My Habits</h1>
          <p className="mt-1 text-[13px]" style={{ color: 'var(--text-secondary)' }}>
            {habits.length} habit{habits.length !== 1 ? "s" : ""} tracked
          </p>
        </div>
        <button
          onClick={openCreate}
          className="cursor-pointer flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-[13px] font-medium text-white shadow-sm transition-colors hover:bg-accent-600"
          style={{ backgroundColor: '#7c5cff' }}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New habit
        </button>
      </div>

      {error ? (
        <div className="mb-4 rounded-2xl border border-danger-400/20" style={{ backgroundColor: 'var(--bg-secondary)' }}>
          <ErrorMessage
            title="Failed to load habits"
            description="Check your connection or try refreshing your habits."
            type="network"
            onRetry={fetchHabits}
          />
        </div>
      ) : null}

      <div className="flex gap-5">
        <div className="min-w-0 flex-[7]">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-7 w-7 animate-spin rounded-full border-[3px] border-accent-200 border-t-accent-500" />
            </div>
          ) : habits.length === 0 && filters.status === 'all' && filters.sortBy === 'default' ? (
            <div className="rounded-2xl border border-surface-200" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <EmptyState
                icon="habits"
                title="No habits yet"
                description="Start building your routine. Add your first habit and begin tracking today."
                actionLabel="Add your first habit"
                onAction={openCreate}
              />
            </div>
          ) : (
            <>
              <HabitFilterBar filters={filters} onChange={setFilters} />
              {habits.length === 0 ? (
                <div className="rounded-2xl border border-surface-200" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                  <EmptyState
                    icon="search"
                    title="No habits match this filter"
                    description={`Try adjusting your filters or ${filters.status !== 'all' ? 'clearing them' : 'create a new habit'}.`}
                    actionLabel="Clear filters"
                    onAction={() => setFilters({ status: 'all', sortBy: 'default' })}
                  />
                </div>
              ) : (
                <>
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                      Showing <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{habits.length}</span> {habits.length === 1 ? 'habit' : 'habits'}
                    </span>
                  </div>
                  <div className="grid gap-3 transition-all duration-300">
                    {habits.map((h) => (
                      <HabitCard
                        key={h._id}
                        habit={h}
                        onToggleToday={handleToggleToday}
                        onEdit={openEdit}
                        onDelete={setDeleteTarget}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>

        <div className="min-w-0 flex-[3]">
          <NotesPanel notes={notes} isLoading={notesLoading} onCreate={createNote} onDelete={deleteNote} />
        </div>
      </div>

      {showModal && <HabitModal habit={modalHabit} onSave={handleSave} onClose={closeModal} />}
      {deleteTarget && (
        <DeleteConfirm
          habitName={deleteTarget.name}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
      <ToastNotification toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
