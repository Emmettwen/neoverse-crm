export const requiredRegex = (value: string) => !!value || 'This field is required.'
export const emailRegex = (value: string) =>
  /.+@.+\..+/.test(value) || 'Please enter a valid email.'
export const phoneRegex = (value: string) =>
  !value || /\+\d\(\d{3}\)-\d{3}-\d{2}-\d{2}/.test(value) || 'Please enter a valid phone number.'
