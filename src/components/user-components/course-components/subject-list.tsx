"use client";

import { Chapter, Subject, Lesson } from "@prisma/client";
import { BookOpen, PlayCircle, Lock } from "lucide-react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

interface SubjectListProps {
    subjects: (Subject & {
        chapters: (Chapter & {
            lessons: Lesson[];
        })[];
    })[];
}

export const SubjectList = ({ subjects }: SubjectListProps) => {
    return (
        <Accordion type="single" collapsible className="w-full space-y-2">
            {subjects.map((subject) => (
                <AccordionItem
                    key={subject.id}
                    value={subject.id}
                    className="border rounded-lg bg-slate-50 px-2"
                >
                    <AccordionTrigger className="hover:no-underline hover:bg-slate-100 px-4 rounded-md py-4">
                        <div className="flex items-center gap-x-3 text-left">
                            <div className="bg-white p-2 rounded-md border border-slate-200 shadow-sm text-black">
                                <BookOpen className="h-4 w-4" />
                            </div>
                            <div>
                                <span className="font-semibold text-slate-900 block">
                                    {subject.title}
                                </span>
                                <span className="text-xs text-slate-500 font-normal">
                                    {subject.chapters.length} Chapters •{" "}
                                    {subject.chapters.reduce(
                                        (a, c) => a + c.lessons.length,
                                        0
                                    )}{" "}
                                    Lessons
                                </span>
                            </div>
                        </div>
                    </AccordionTrigger>

                    <AccordionContent className="pt-2 pb-4 px-4 bg-white border-t border-b-4 rounded-lg border-slate-100">
                        <div className="flex flex-col gap-y-4 mt-2">
                            {subject.chapters.length === 0 && (
                                <p className="text-sm text-slate-400 italic">
                                    Curriculum coming soon.
                                </p>
                            )}

                            {subject.chapters.map((chapter) => (
                                <div key={chapter.id}>
                                    <h4 className="text-sm font-bold text-slate-800 mb-2 items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-900" />
                                        {chapter.title} •{" "}
                                        {chapter.lessons.length} Lessons
                                    </h4>
                                    <div className="space-y-1 ml-4 border-l-2 border-slate-100 pl-4">
                                        {chapter.lessons.length === 0 && (
                                            <span className="text-xs text-slate-400">
                                                No lessons yet
                                            </span>
                                        )}
                                        {chapter.lessons.map(
                                            (lesson) =>
                                                lesson.isFree && (
                                                    <div
                                                        key={lesson.id}
                                                        className="text-sm text-slate-600 py-1.5 flex items-center justify-between group hover:bg-slate-50 rounded px-2 -ml-2 transition"
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <PlayCircle className="h-4 w-4 text-slate-400 group-hover:text-blue-600" />
                                                            <span>
                                                                {lesson.title}
                                                            </span>
                                                        </div>
                                                        <Badge
                                                            variant="secondary"
                                                            className="text-[10px] h-5 bg-green-100 text-green-700 hover:bg-green-100"
                                                        >
                                                            Preview
                                                        </Badge>
                                                    </div>
                                                )
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    );
};
