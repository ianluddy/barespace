export function generateReference() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let reference = 'BR';
  for (let i = 0; i < 6; i++) {
    reference += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return reference;
} 