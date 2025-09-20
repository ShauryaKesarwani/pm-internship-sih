"use client";

import { useParams } from "next/navigation";
import Quiz from "../Quiz";

export default function QuizPage(){
    const {id} = useParams();

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