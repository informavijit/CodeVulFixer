// Demo Vulnerability Target: DOM-based XSS (CWE-79 / js/xss-through-dom)
export function renderUserProfile(user: { name: string; bio: string }): void {
  const container = document.getElementById('user-profile');
  if (!container) return;

  const userBioElement = document.createElement('div');
  userBioElement.className = 'user-bio';

  // VULNERABLE LINE: Unsanitized DOM assignment
  userBioElement.innerHTML = user.bio;

  container.appendChild(userBioElement);
}
