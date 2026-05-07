import { useListChallenges, getListChallengesQueryKey, useGetLeaderboard, getGetLeaderboardQueryKey } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function MindMapChallenges() {
  const { data: challenges, isLoading: challengesLoading } = useListChallenges({}, {
    query: { queryKey: getListChallengesQueryKey() }
  });

  const { data: leaderboard, isLoading: leaderboardLoading } = useGetLeaderboard({
    query: { queryKey: getGetLeaderboardQueryKey() }
  });

  return (
    <div className="container mx-auto px-4 py-12">
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
          {challengesLoading ? <div className="py-8 text-center">Loading challenges...</div> : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {challenges?.map((challenge, i) => (
                <motion.div 
                  key={challenge.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card p-6 rounded-2xl flex flex-col h-full border-t-accent"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      challenge.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
                      challenge.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {challenge.difficulty}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{challenge.title}</h3>
                  <p className="text-muted-foreground text-sm mb-6 flex-1">{challenge.description}</p>
                  
                  <div className="flex justify-between text-sm text-muted-foreground mb-6">
                    <span>{challenge.questionCount} Questions</span>
                    <span>{challenge.timeLimit} mins</span>
                  </div>

                  <Link href={`/mindmap/challenges/${challenge.id}`}>
                    <Button className="w-full rounded-full" variant="outline">
                      Start Challenge
                    </Button>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="leaderboard">
          <div className="glass-card rounded-2xl overflow-hidden">
            {leaderboardLoading ? <div className="py-8 text-center">Loading leaderboard...</div> : (
              <div className="divide-y divide-white/10">
                {leaderboard?.map((entry, idx) => (
                  <div key={idx} className="p-4 flex items-center gap-4 hover:bg-white/5 transition-colors">
                    <div className="w-8 text-center font-bold text-xl text-muted-foreground">
                      {entry.rank}
                    </div>
                    <Avatar>
                      <AvatarImage src={entry.avatarUrl || undefined} />
                      <AvatarFallback>{entry.userName.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-bold">{entry.userName}</p>
                      <p className="text-xs text-muted-foreground">{entry.challengesCompleted} challenges completed</p>
                    </div>
                    <div className="text-xl font-mono font-bold text-accent">
                      {entry.totalScore}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}