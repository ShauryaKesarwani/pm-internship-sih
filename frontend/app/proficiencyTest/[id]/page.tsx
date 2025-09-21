
import Quiz from "../Quiz";

interface PageProps {
  params: { id: string };
}

export default function QuizPage({params}:PageProps){
  return(
    <div className="min-h-screen w-full bg-orange-50 p-0 m-0">
      <Quiz internshipId="68cea5c2663cb8f365924065"/>
    </div>
  );
}

export async function generateStaticParams() {
  return [
    { id: "68cea4dd663cb8f365924063" },
    { id: "651234abcd1234abcd567890" },
    { id: "68cea5c2663cb8f365924065" },

    // Add all possible quiz IDs here
  ];
}
