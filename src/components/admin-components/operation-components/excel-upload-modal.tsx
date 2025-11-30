"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
import toast from "react-hot-toast";
import { FileSpreadsheet, CheckCircle2, Download } from "lucide-react";
import { useRouter } from "next/navigation";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ExcelUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    courseId: string;
    subjectId: string;
}

interface ExcelRow {
    Chapter: string;
    Title: string;
    Date: string;
    Time: string;
    TeacherEmail: string;
}

export const ExcelUploadModal = ({
    isOpen,
    onClose,
    courseId,
    subjectId,
}: ExcelUploadModalProps) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const [parsedData, setParsedData] = useState<ExcelRow[]>([]);
    const [stats, setStats] = useState<{
        chapters: number;
        lessons: number;
    } | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);

    const parseExcelDate = (excelDate: string, excelTime: string): string => {
        const dateObj = new Date(excelDate);

        const [h, m] = excelTime.split(":").map(Number);
        dateObj.setHours(h || 10, m || 0);

        return dateObj.toISOString();
    };
    const onDownloadTemplate = () => {
        const templateData = [
            {
                Chapter: "Kinematics",
                Title: "Lecture 01: Introduction",
                Date: "2025-11-25",
                Time: "10:00",
                TeacherEmail: "mohitchamolla@gmail.com",
            },
            {
                Chapter: "Kinematics",
                Title: "Lecture 02: Vectors",
                Date: "2025-11-26",
                Time: "10:00",
                TeacherEmail: "mohitchamolla@gmail.com",
            },
        ];

        const ws = XLSX.utils.json_to_sheet(templateData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Schedule");
        XLSX.writeFile(wb, "batch_schedule_template.xlsx");
    };

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        setFileName(selectedFile.name);

        const reader = new FileReader();
        reader.onload = (e) => {
            const data = e.target?.result;

            const workbook = XLSX.read(data, {
                type: "binary",
                cellDates: true,
            });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const rawJson = XLSX.utils.sheet_to_json<ExcelRow>(sheet);

            const firstRow = rawJson[0];
            if (
                !firstRow.Chapter ||
                !firstRow.Title ||
                !firstRow.Date ||
                !firstRow.Time ||
                !firstRow.TeacherEmail
            ) {
                toast.error(
                    "Invalid format of first Row. Please download the template."
                );
                return;
            }

            const processedData = rawJson.map((row) => ({
                ...row,
                Date: parseExcelDate(row.Date, row.Time),
            }));

            if (rawJson.length === 0) {
                toast.error("File appears to be empty");
                return;
            }

            const uniqueChapters = new Set(
                rawJson.map((row) => row.Chapter).filter(Boolean)
            );
            setStats({
                chapters: uniqueChapters.size,
                lessons: rawJson.length,
            });
            setParsedData(processedData);
        };

        reader.readAsBinaryString(selectedFile);
    };

    const onUpload = async () => {
        if (!parsedData.length) return;

        try {
            setIsLoading(true);
            await axios.post(
                `/api/courses/${courseId}/subjects/${subjectId}/import`,
                {
                    data: parsedData,
                }
            );

            toast.success(`Successfully imported ${stats?.lessons} lessons`);
            router.refresh();
            onClose();

            setStats(null);
            setParsedData([]);
            setFileName(null);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || "Import failed");
            } else {
                toast.error("Something went wrong");
            }
        } finally {
            setIsLoading(false);
            setStats(null);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Bulk Schedule Upload</DialogTitle>
                    <DialogDescription>
                        Generate chapters and lessons from an Excel file.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-4 py-4">
                    {/* Download Template */}
                    <div className="flex justify-end">
                        <Button
                            onClick={onDownloadTemplate}
                            variant="ghost"
                            size="sm"
                            className="text-xs h-8"
                        >
                            <Download className="h-3 w-3 mr-2" />
                            Download Template
                        </Button>
                    </div>

                    {!stats ? (
                        <div className="border-2 border-dashed border-slate-200 rounded-lg p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition cursor-pointer relative bg-slate-50/50">
                            {/* <Upload className="h-8 w-8 text-slate-400 mb-2" /> */}
                            {/* <p className="text-sm font-medium text-slate-900">
                                Click to browse file
                            </p> */}
                            <Input
                                type="file"
                                accept=".xlsx, .xls"
                                className="cursor-pointer"
                                onChange={onFileChange}
                                placeholder="Click to browse file"
                            />
                        </div>
                    ) : (
                        <div className="bg-slate-50 border border-slate-100 rounded-lg p-4">
                            <div className="flex items-center gap-x-2 text-slate-900 font-semibold mb-2 text-sm">
                                <FileSpreadsheet className="h-4 w-4" />
                                <span className="truncate max-w-[200px]">
                                    {fileName}
                                </span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mt-4">
                                <div className="bg-white p-3 rounded border text-center">
                                    <p className="text-2xl font-bold text-slate-900">
                                        {stats.chapters}
                                    </p>
                                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wide">
                                        Chapters
                                    </p>
                                </div>
                                <div className="bg-white p-3 rounded border text-center">
                                    <p className="text-2xl font-bold text-slate-900">
                                        {stats.lessons}
                                    </p>
                                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wide">
                                        Lessons
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-x-2 mt-4 text-xs text-green-700 bg-green-50 p-2 rounded border border-green-100">
                                <CheckCircle2 className="h-4 w-4" />
                                Data validated. Ready to create schedule.
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={onUpload}
                        disabled={!stats || isLoading}
                        className="bg-black text-white hover:bg-slate-800"
                    >
                        {isLoading ? "Generating..." : "Generate Schedule"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
