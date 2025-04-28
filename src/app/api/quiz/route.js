import { connectToDatabase } from "../../../../lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

// GET all quizzes
export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const quizzes = await db.collection("quizzes").find().toArray();
    return NextResponse.json(quizzes);
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch quizzes. Please check the database connection.",
      },
      { status: 500 }
    );
  }
}

// POST create a new quiz
export async function POST(request) {
  try {
    const { question, answer } = await request.json();
    // Validate input
    if (!question || !answer) {
      return NextResponse.json(
        { error: "Question and answer are required." },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const result = await db
      .collection("quizzes")
      .insertOne({ question, answer });

    return NextResponse.json({ id: result.insertedId, question, answer });
  } catch (error) {
    console.error("Error inserting quiz:", error);
    return NextResponse.json(
      { error: "Failed to create quiz" },
      { status: 500 }
    );
  }
}

// PUT update an existing quiz
// PUT update an existing quiz
export async function PUT(request) {
  try {
    const { id, question, answer } = await request.json();
    const { db } = await connectToDatabase();

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    const updateFields = {};
    if (question !== undefined) updateFields.question = question;
    if (answer !== undefined) updateFields.answer = answer;

    const updatedQuiz = await db
      .collection("quizzes")
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updateFields },
        { returnOriginal: false }
      );

    if (!updatedQuiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    return NextResponse.json(updatedQuiz);
  } catch (error) {
    console.error("Error updating quiz:", error.message);
    return NextResponse.json(
      { error: "Failed to update quiz", details: error.message },
      { status: 500 }
    );
  }
}
// DELETE a quiz
export async function DELETE(request) {
  try {
    const { id } = await request.json();
    const { db } = await connectToDatabase();

    const deletedQuiz = await db
      .collection("quizzes")
      .deleteOne({ _id: new ObjectId(id) });

    if (deletedQuiz.deletedCount === 0) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Question deleted successfully" });
  } catch (error) {
    console.error("Error deleting quiz:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
