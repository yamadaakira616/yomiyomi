export function generateStaticParams() {
  const profileIds = ["mushi", "stamp"];
  const storyIds = ["mushi-1", "mushi-2", "mushi-3", "mushi-4", "mushi-5",
                    "stamp-1", "stamp-2", "stamp-3", "stamp-4", "stamp-5"];
  return profileIds.flatMap((profileId) =>
    storyIds.map((storyId) => ({ profileId, storyId }))
  );
}

export default function StoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
