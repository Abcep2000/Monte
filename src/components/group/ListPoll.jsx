import React from "react";
import { StorageService } from "../../lib/storage";

/**
 * Polls (Abstimmungen)
 * Variante B = moderne große Buttons
 *
 * - Single Choice
 * - Eltern können abstimmen, Team nicht
 * - erneuter Klick = Stimme entfernen
 * - Grid-Layout bei vielen Optionen
 */
export default function ListPoll({ list, user, isAdmin, reload }) {
  const items = Array.isArray(list.items) ? list.items : [];

  const toggleVote = (itemIndex) => {
    if (isAdmin) return;

    const all = StorageService.get("grouplists") || [];
    const idx = all.findIndex((l) => l.id === list.id);
    if (idx < 0) return;

    const updated = [...all];
    const li = { ...updated[idx] };

    const me = user.username;
    // Prüfen, ob auf diesem Eintrag bereits eine Stimme von mir liegt
    const currentItem = li.items[itemIndex];
    const currentVotes = Array.isArray(currentItem.votes)
      ? [...currentItem.votes]
      : [];
    const hadMyVote = currentVotes.includes(me);

    // Eigene Stimme aus allen Optionen entfernen (Single‑Choice)
    li.items = li.items.map((item) => {
      const votes = Array.isArray(item.votes) ? [...item.votes] : [];
      const filteredVotes = votes.filter((v) => v !== me);
      return { ...item, votes: filteredVotes };
    });

    // Wenn vorher noch nicht für diese Option gestimmt wurde, Stimme setzen
    if (!hadMyVote) {
      const updatedItem = { ...li.items[itemIndex] };
      const votes = Array.isArray(updatedItem.votes)
        ? [...updatedItem.votes]
        : [];
      votes.push(me);
      updatedItem.votes = votes;
      li.items[itemIndex] = updatedItem;
    }

    updated[idx] = li;
    StorageService.set("grouplists", updated);
    reload();
  };

  if (items.length === 0) {
    return (
      <p className="text-xs text-stone-400">Noch keine Abstimmungsoptionen.</p>
    );
  }

  return (
    <div
      className={`grid gap-2 ${
        items.length <= 2
          ? "grid-cols-1"
          : items.length === 3
          ? "grid-cols-2"
          : "grid-cols-2"
      }`}
    >
      {items.map((item, idx) => {
        const votes = Array.isArray(item.votes) ? item.votes : [];
        const hasMyVote = votes.includes(user.username);

        const voteText =
          votes.length === 0
            ? "Keine Stimmen"
            : votes.length === 1
            ? "1 Stimme"
            : `${votes.length} Stimmen`;

        const baseClasses =
          "w-full flex flex-col items-center justify-center px-4 py-4 rounded-2xl border text-sm font-bold transition text-center";

        if (isAdmin) {
          // TEAM = read-only
          return (
            <div
              key={idx}
              className={`${baseClasses} bg-stone-50 border-stone-200 text-stone-700`}
            >
              <span>{item.label}</span>
              <span className="text-[10px] text-stone-500 mt-1">{voteText}</span>
            </div>
          );
        }

        // Eltern = klickbare Buttons
        return (
          <button
            key={idx}
            onClick={() => toggleVote(idx)}
            className={
              hasMyVote
                ? `${baseClasses} bg-amber-500 border-amber-600 text-white`
                : `${baseClasses} bg-stone-50 border-stone-200 text-stone-700 hover:bg-amber-100`
            }
          >
            <span>{item.label}</span>
            <span className="text-[10px] text-stone-700 mt-1">
              {voteText}
            </span>
          </button>
        );
      })}
    </div>
  );
}