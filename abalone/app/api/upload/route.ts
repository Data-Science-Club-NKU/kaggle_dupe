import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { parse } from "papaparse";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) {
    throw new Error("MONGODB_URI is not defined");
}
const client = new MongoClient(uri);

// Function to calculate RMSE
function calculateRMSE(actual: number[], predicted: number[]): number {
    if (actual.length !== predicted.length) {
        throw new Error("The uploaded CSV and the correct output must have the same number of rows.");
    }
    
    const mse = actual.reduce((sum, actualValue, index) => {
        const predictedValue = predicted[index];
        return sum + Math.pow(actualValue - predictedValue, 2);
    }, 0) / actual.length;
    
    return Math.sqrt(mse);
}

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const teamName = formData.get("teamName") as string;
        const teamMembers = formData.get("teamMembers") as string;
        const file = formData.get("file") as File;

        if (!teamName || !teamMembers || !file) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        // Log the file name and type
        console.log("Uploaded file name:", file.name);
        console.log("Uploaded file type:", file.type);

        // Check if the uploaded file is a CSV
        if (!file.name.endsWith(".csv")) {
            return NextResponse.json({ error: "Only .csv files are allowed" }, { status: 400 });
        }

        // Read the uploaded file as text
        const uploadedText = await file.text();
        const uploadedData = parse<{ Rings: string }>(uploadedText, { header: true }).data;  // Set header: true

        // Read the locally stored correct output CSV
        const correctFilePath = path.join(process.cwd(), "app", "tabs", "data", "Correct_output_to_validate.csv");
        const correctText = fs.readFileSync(correctFilePath, "utf-8");
        const correctData = parse<{ Rings: string }>(correctText, { header: true }).data;  // Set header: true

        // Convert to numerical arrays using the 'Rings' column
        const uploadedValues = uploadedData
            .map((row: { Rings: string }) => parseFloat(row.Rings))
            .filter(val => !isNaN(val));
        const correctValues = correctData
            .map((row: { Rings: string }) => parseFloat(row.Rings))
            .filter(val => !isNaN(val));

        // Calculate RMSE
        const rmse = calculateRMSE(correctValues, uploadedValues);
        console.log("RMSE Score:", rmse);

        await client.connect();
        const database = client.db("competition");
        const submissions = database.collection("submissions");

        const submission = {
            teamName,
            teamMembers: teamMembers.split(","),
            rmseScore: rmse,
            submittedAt: new Date(),
        };

        await submissions.insertOne(submission);

        return NextResponse.json({ message: "Submission successful", rmse: rmse });
    } catch (error) {
        console.error("Error processing file upload:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    } finally {
        await client.close();
    }
}