export type SpaceMember = {
  id: string;
  name: string;
  role: 'owner' | 'member';
};

// Names everyone who can see a shared space, so nobody is a surprise.
export function MemberList({ members }: { members: SpaceMember[] }) {
  return (
    <section aria-labelledby="members-heading">
      <h3 id="members-heading">Who is in this space</h3>
      {members.length === 0 ? (
        <p>Just you for now.</p>
      ) : (
        <ul>
          {members.map((member) => (
            <li key={member.id}>
              {member.name}
              {member.role === 'owner' ? ' (owner)' : ''}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
