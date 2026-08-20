import { HintStatus, type Hint } from '$lib/archipelago.svelte';

const hintPriority = (hint: Hint): number => {
  const status = {
    [HintStatus.priority]: 40,
    [HintStatus.no_priority]: 30,
    [HintStatus.avoid]: 20,
    [HintStatus.found]: 10,
    [HintStatus.unspecified]: 0,
  }[hint.status];

  let guessedStatus = 0;
  if (hint.status === HintStatus.unspecified) {
    if (hint.item.progression) guessedStatus = 40;
    if (hint.item.useful) guessedStatus = 40;
    if (hint.item.filler) guessedStatus = 30;
    if (hint.item.trap) guessedStatus = 20;
  }

  let kind = 0;
  if (hint.item.progression) kind = 4;
  if (hint.item.useful) kind = 3;
  if (hint.item.filler) kind = 2;
  if (hint.item.trap) kind = 1;

  return status + guessedStatus + kind;
};

const isPriority = (hint: Hint) =>
  hint.status === HintStatus.priority ||
  (hint.status === HintStatus.unspecified && hint.item.progression);

export const groupHints = (hints: Hint[], connections: string[]) => {
  const prioritySend: Hint[] = [];
  const send: Hint[] = [];
  const priorityReceive: Hint[] = [];
  const receive: Hint[] = [];
  const found: Hint[] = [];

  const sortedHints = hints
    .toSorted((a, b) => b.item.sender.slot - a.item.sender.slot)
    .toSorted((a, b) => b.item.receiver.slot - a.item.receiver.slot)
    .toSorted((a, b) => hintPriority(b) - hintPriority(a));

  sortedHints.forEach((hint) => {
    if (hint.status === HintStatus.found) {
      found.push(hint);
    } else {
      if (connections.includes(hint.item.sender.name)) {
        if (isPriority(hint)) {
          prioritySend.push(hint);
        } else {
          send.push(hint);
        }
      } else {
        if (isPriority(hint)) {
          priorityReceive.push(hint);
        } else {
          receive.push(hint);
        }
      }
    }
  });

  return { prioritySend, send, priorityReceive, receive, found };
};
