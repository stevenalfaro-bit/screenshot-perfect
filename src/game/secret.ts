// Same password the original site used for the Black Hole and Invincible buttons.
export function isSecretPassword(value: string): boolean {
  return value.trim().toLowerCase() === "steven";
}
