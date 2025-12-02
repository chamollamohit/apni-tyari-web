"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import LinkExtension from "@tiptap/extension-link";
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    List,
    ListOrdered,
    Heading2,
    Link as LinkIcon,
    Unlink,
} from "lucide-react";

import { Toggle } from "@/components/ui/toggle";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface EditorProps {
    onChange: (value: string) => void;
    value: string;
}

// 1. Helper Component to reduce repetition
const ToolbarToggle = ({
    pressed,
    onPressedChange,
    icon: Icon,
    label,
}: {
    pressed: boolean;
    onPressedChange: () => void;
    icon: any;
    label: string;
}) => {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Toggle
                    size="sm"
                    pressed={pressed}
                    onPressedChange={onPressedChange}
                    aria-label={label}
                    className="data-[state=on]:bg-slate-200 data-[state=on]:text-slate-900"
                >
                    <Icon className="h-4 w-4" />
                </Toggle>
            </TooltipTrigger>
            <TooltipContent>
                <p>{label}</p>
            </TooltipContent>
        </Tooltip>
    );
};

const Toolbar = ({ editor }: { editor: any }) => {
    if (!editor) return null;

    const setLink = () => {
        const previousUrl = editor.getAttributes("link").href;
        const url = window.prompt("URL", previousUrl);

        if (url === null) return;
        if (url === "") {
            editor.chain().focus().extendMarkRange("link").unsetLink().run();
            return;
        }
        editor
            .chain()
            .focus()
            .extendMarkRange("link")
            .setLink({ href: url })
            .run();
    };

    return (
        <TooltipProvider delayDuration={0}>
            <div className="flex items-center gap-1 p-1 border-b border-slate-200 bg-slate-50/50 rounded-t-md flex-wrap">
                <ToolbarToggle
                    pressed={editor.isActive("bold")}
                    onPressedChange={() =>
                        editor.chain().focus().toggleBold().run()
                    }
                    icon={Bold}
                    label="Bold"
                />

                <ToolbarToggle
                    pressed={editor.isActive("italic")}
                    onPressedChange={() =>
                        editor.chain().focus().toggleItalic().run()
                    }
                    icon={Italic}
                    label="Italic"
                />

                <ToolbarToggle
                    pressed={editor.isActive("underline")}
                    onPressedChange={() =>
                        editor.chain().focus().toggleUnderline().run()
                    }
                    icon={UnderlineIcon}
                    label="Underline"
                />

                <div className="w-[1px] h-6 bg-slate-300 mx-1" />

                <ToolbarToggle
                    pressed={editor.isActive("heading", { level: 2 })}
                    onPressedChange={() =>
                        editor.chain().focus().toggleHeading({ level: 2 }).run()
                    }
                    icon={Heading2}
                    label="Heading"
                />

                <ToolbarToggle
                    pressed={editor.isActive("bulletList")}
                    onPressedChange={() =>
                        editor.chain().focus().toggleBulletList().run()
                    }
                    icon={List}
                    label="Bullet List"
                />

                <ToolbarToggle
                    pressed={editor.isActive("orderedList")}
                    onPressedChange={() =>
                        editor.chain().focus().toggleOrderedList().run()
                    }
                    icon={ListOrdered}
                    label="Ordered List"
                />

                <div className="w-[1px] h-6 bg-slate-300 mx-1" />

                <ToolbarToggle
                    pressed={editor.isActive("link")}
                    onPressedChange={setLink}
                    icon={LinkIcon}
                    label="Add Link"
                />

                {editor.isActive("link") && (
                    <ToolbarToggle
                        pressed={false}
                        onPressedChange={() =>
                            editor.chain().focus().unsetLink().run()
                        }
                        icon={Unlink}
                        label="Remove Link"
                    />
                )}
            </div>
        </TooltipProvider>
    );
};

export const Editor = ({ onChange, value }: EditorProps) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            LinkExtension.configure({
                openOnClick: false,
                autolink: true,
            }),
        ],
        content: value,
        editorProps: {
            attributes: {
                class: "min-h-[150px] p-4 focus:outline-none text-sm text-slate-700 prose prose-sm max-w-none prose-headings:font-bold prose-h1:text-xl",
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        immediatelyRender: false,
    });

    return (
        <div className="border border-slate-200 rounded-md bg-white overflow-hidden shadow-sm focus-within:ring-1 focus-within:ring-black focus-within:border-black transition-all">
            <Toolbar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    );
};
