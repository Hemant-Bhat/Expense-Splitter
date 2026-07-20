type EventPrefix = "added" | "removed" | "updated";

type Event<T extends string> = `${T}:${EventPrefix}`;

export type MemberEvent = Event<"member">;
export type ExpenseEvent = Event<"expense">;

// const Prefix = {
//     Added: "added",
//     Updated: "updated",
//     Removed: "removed",
// } as const;

// const Member = {
//     Added: `member:${Prefix.Added}`,
//     Updated: `member:${Prefix.Updated}`,
//     Removed: `member:${Prefix.Removed}`,
// };
