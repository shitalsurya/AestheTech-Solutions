import { useState } from "react";
import { useListChallenges, getListChallengesQueryKey, useGetLeaderboard, getGetLeaderboardQueryKey } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import { GuestUpgradeModal } from "@/components/guest-upgrade-modal";
import { Lock } from "lucide-react";

export default function MindMapChallenges() {
  const { data: challenges, isLoading: challengesLoading } = useListChallenges({}, {
    query: { queryKey: getListChallengesQueryKey() },
  });

  const { data: leaderboard, isLoading: leaderboardLoading } = useGetLeaderboard({
    query: { queryKey: getGetLeaderboardQueryKey() },
  });

  const { user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);

  const handlePremiumClick = () => setModalOpen(true);

  return (
    <div className="container mx-auto px-4 py-12">
      <GuestUpgradeModal isOpen={modalOpen} onClose={() => setModalOpen(false)} trigger="premium" />

      {!user && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 glass-card p-4 rounded-2xl border border-accent/30 bg-accent/5 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div>
            <p className="font-medium">Exploring as a guest</p>
            <p className="text-sm text-muted-foreground">Sign up to save your scores and appear on the leaderboard.</p>
          </div>
          <Link href="/mindmap/register">
            <Button size="sm" className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90 whitespace-nowrap flex-shrink-0">
              Create Free Account
            </Button>
          </Link>
        </motion.div>
      )}

      <div className="mb-12">
        <h1 className="text-4xl font-display font-bold mb-4">Interview Challenges</h1>
        <p className="text-muted-foreground text-lg">Test your knowledge with timed challenges and climb the leaderboard.</p>
      </div>

      <Tabs defaultValue="challenges" className="w-full">
        <TabsList className="mb-8 w-full max-w-md grid grid-cols-2">
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>

        <TabsContent value="challenges">
          {challengesLoading ? (
            <div className="py-8 text-center">Loading challenges...</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {challenges?.map((challenge, i) => {
                const isPremiumLocked = challenge.isPremium && !user;
                return (
                  <motion.div
                    key={challenge.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="glass-card p-6 rounded-2xl flex flex-col h-full border-t-accent"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        challenge.difficulty === "easy" ? "bg-green-500/20 text-green-400" :
                        challenge.difficulty === "medium" ? "bg-yellow-500/20 text-yellow-400" :
                        "bg-red-500/20 text-red-400"
                      }`}>
                        {challenge.difficulty}
                      </span>
                      {challenge.isPremium && (
                        <span className="text-xs font-medium px-2 py-1 bg-yellow-500/20 text-yellow-500 rounded-full flex items-center gap-1">
                          {!user && <Lock className="w-3 h-3" />}
                          Premium
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{challenge.title}</h3>
                    <p className="text-muted-foreground text-sm mb-6 flex-1">{challenge.description}</p>

                    <div className="flex justify-between text-sm text-muted-foreground mb-6">
                      <span>{challenge.questionCount} Questions</span>
                      <span>{Math.floor(challenge.timeLimit / 60)} mins</span>
                    </div>

                    {isPremiumLocked ? (
                      <Button className="w-full rounded-full" variant="outline" onClick={handlePremiumClick}>
                        <Lock className="w-4 h-4 mr-2" />
                        Unlock Premium
                      </Button>
                    ) : (
                      <Link href={`/mindmap/challenges/${challenge.id}`}>
                        <Button className="w-full rounded-full" variant="outline">
                          Start Challenge
                        </Button>
                      </Link>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="leaderboard">
          <div className="glass-card rounded-2xl overflow-hidden">
            {leaderboardLoading ? (
              <div className="py-8 text-center">Loading leaderboard...</div>
            ) : leaderboard && leaderboard.length > 0 ? (
              <div className="divide-y divide-white/10">
                {leaderboard.map((entry, idx) => (
                  <div key={idx} className="p-4 flex items-center gap-4 hover:bg-white/5 transition-colors">
                    <div className="w-8 text-center font-bold text-xl text-muted-foreground">{entry.rank}</div>
                    <Avatar>
                      <AvatarImage src={entry.avatarUrl || undefined} />
                      <AvatarFallback>{entry.userName.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-bold">{entry.userName}</p>
                      <p className="text-xs text-muted-foreground">{entry.challengesCompleted} challenges completed</p>
                    </div>
                    <div className="text-xl font-mono font-bold text-accent">{entry.totalScore}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center text-muted-foreground">
                <p className="mb-4">No rankings yet. Be the first to complete a challenge!</p>
                {!user && (
                  <Link href="/mindmap/register">
                    <Button className="rounded-full">Create Account to Rank</Button>
                  </Link>
                )}
              </div>
            )}
          </div>

          {!user && (
            <div className="mt-6 glass-card p-6 rounded-2xl border border-accent/20 text-center">
              <p className="font-medium mb-2">Want to appear on the leaderboard?</p>
              <p className="text-sm text-muted-foreground mb-4">Create a free account to save your scores and compete globally.</p>
              <Link href="/mindmap/register">
                <Button className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90">
                  Join the Leaderboard
                </Button>
              </Link>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
