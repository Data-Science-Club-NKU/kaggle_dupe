import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
if (!uri) {
    throw new Error("MONGODB_URI is not defined");
}
const client = new MongoClient(uri);

export async function GET() {
    try {
        await client.connect();
        const database = client.db("competition");
        const submissions = database.collection("submissions");
        const leaderboard = await submissions.find().sort({ rmseScore: 1 }).toArray();

        // Map the leaderboard data to include members and score fields
        const leaderboardData = leaderboard.map((submission, index) => ({
            rank: index + 1,
            avatar: submission.avatar || '', // Assuming avatar field exists
            teamName: submission.teamName,
            members: submission.members || [], // Assuming members field exists
            score: submission.rmseScore // Assuming rmseScore is the score
        }));
        
        return NextResponse.json(leaderboardData);
    } catch (error) {
        console.error("Error fetching leaderboard data:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    } finally {
        await client.close();
    }
}
