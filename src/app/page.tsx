import Playground from "@/components/Playground";
import { getRepos, profile } from "@/lib/github";

export default async function Home() {
  const repos = await getRepos();

  return <Playground repos={repos} profile={profile} />;
}
