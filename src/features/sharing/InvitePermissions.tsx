// Plain-language explanation shown before someone accepts an invitation, so
// they know exactly what becomes visible and what stays private.
export function InvitePermissions({ spaceName }: { spaceName: string }) {
  return (
    <section aria-labelledby="invite-permissions-heading">
      <h3 id="invite-permissions-heading">Before you accept</h3>
      <p>
        You are invited to the shared space “{spaceName}”. Nothing is shared
        until you accept.
      </p>
      <h4>If you accept, people in this space can see</h4>
      <ul>
        <li>Your name in the member list.</li>
        <li>Records you choose to add to this space.</li>
      </ul>
      <h4>They can never see</h4>
      <ul>
        <li>Your personal entries. They stay on your device.</li>
        <li>Anything in other spaces.</li>
      </ul>
      <p>
        You can leave the space at any time. The person who invited you can also
        cancel an invitation that has not been used.
      </p>
    </section>
  );
}
