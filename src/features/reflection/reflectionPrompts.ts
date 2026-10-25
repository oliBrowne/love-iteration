// Each prompt maps to one optional field on the Reflection record.
export const prompts = [
  { field: 'whatWorked', label: 'What worked this week?' },
  { field: 'whatWasHard', label: 'What was hard this week?' },
  { field: 'whatToTry', label: 'What would you like to try next week?' },
  { field: 'appreciation', label: 'What do you appreciate about the week?' },
] as const;

export type PromptField = (typeof prompts)[number]['field'];
