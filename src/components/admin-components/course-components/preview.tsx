"use client";

interface PreviewProps {
    value: string;
}

export const Preview = ({ value }: PreviewProps) => {
    return (
        <div
            className="text-slate-600 leading-relaxed 
      [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 
      [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 
      [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-2 [&_h1]:text-slate-900
      [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-2 [&_h2]:text-slate-900
      [&_a]:text-blue-600 [&_a]:underline"
            dangerouslySetInnerHTML={{ __html: value }}
        />
    );
};
