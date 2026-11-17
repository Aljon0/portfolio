/** Opens a Gmail compose window in the browser, with the recipient and a subject filled in. */
export function gmailComposeUrl(email: string, subject = "Portfolio inquiry"): string {
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent(subject)}`;
  }
  
  export function mailtoUrl(email: string): string {
    return `mailto:${email}`;
  }