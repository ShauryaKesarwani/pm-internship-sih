import { notFound } from "next/navigation";
import Quiz from "../Quiz";

interface PageProps {
  params: { id: string };
}

export default function QuizPage({params}:PageProps){
    const {id} = params;

    if(!id){
        return <div className="p-6 text-red-500">Invalid quiz ID</div>;
    }

    return(
        <div className="min-h-screen flex items-center justify-center bg-orange-50 p-6">
            <div className="w-full max-w-3xl">
                <Quiz internshipId={id as string}/>
            </div>
        </div>
    );
}

export async function generateStaticParams() {
  return [
    { id: "68cea4dd663cb8f365924063" },
    { id: "651234abcd1234abcd567890" },
    // Add all possible quiz IDs here
  ];
}