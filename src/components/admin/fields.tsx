"use client";

import { Check, ChevronDown, ChevronUp, X } from "lucide-react";
import { useId, useState, type ReactNode } from "react";
import type { AdminImage } from "@/lib/admin-content";
import { uploadMediaFile } from "@/lib/upload-media";
import { isVideoLink } from "@/lib/video";
import { useList } from "@/components/admin/content-provider";

const inputClass =
  "w-full rounded-[8px] border border-[#373A41] bg-transparent px-3 py-2 font-inter text-[16px] leading-[24px] font-normal text-brand-white outline-none placeholder:text-[#85888E] focus:border-brand";

export function EditorPage({ children }: { children: ReactNode }) {
  return (
    <div className="w-full px-6 py-8 md:py-10">
      <div className="flex w-full max-w-[1080px] flex-col gap-12">{children}</div>
    </div>
  );
}

export function Subsection({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="font-tanker text-[18px] leading-[1.2] font-normal tracking-normal text-[#E8B23D] uppercase md:text-[24px]">
        {title}
      </h2>
      {hint ? (
        <p className="mt-2 font-inter text-[14px] leading-[20px] font-normal text-[#94979C]">
          {hint}
        </p>
      ) : null}
      <div className="mt-3 h-px bg-[#22262F]" />
      <div className="mt-6 flex flex-col gap-6">{children}</div>
    </section>
  );
}

function wrapSelection(
  id: string,
  value: string,
  onChange: (value: string) => void,
  before: string,
  after: string,
) {
  const field = document.getElementById(id) as HTMLInputElement | HTMLTextAreaElement | null;
  const start = field?.selectionStart ?? value.length;
  const end = field?.selectionEnd ?? value.length;
  const selected = value.slice(start, end) || "text";
  const next = `${value.slice(0, start)}${before}${selected}${after}${value.slice(end)}`;
  onChange(next);
  const cursor = start + before.length + selected.length + after.length;
  requestAnimationFrame(() => {
    field?.focus();
    field?.setSelectionRange(cursor, cursor);
  });
}

function FormatBar({
  id,
  value,
  onChange,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const [color, setColor] = useState("#F9A000");

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() => wrapSelection(id, value, onChange, "**", "**")}
        className="inline-flex h-8 cursor-pointer items-center rounded-[6px] border border-[#373A41] px-3 font-inter text-[14px] font-bold text-brand-white hover:border-brand"
      >
        Bold
      </button>
      <button
        type="button"
        onClick={() => wrapSelection(id, value, onChange, "_", "_")}
        className="inline-flex h-8 cursor-pointer items-center rounded-[6px] border border-[#373A41] px-3 font-inter text-[14px] italic text-brand-white hover:border-brand"
      >
        Italic
      </button>
      <label className="inline-flex h-8 cursor-pointer items-center gap-2 rounded-[6px] border border-[#373A41] px-2 font-inter text-[14px] text-brand-white hover:border-brand">
        <input
          type="color"
          value={color}
          aria-label="Text color"
          onChange={(event) => setColor(event.target.value)}
          className="size-5 cursor-pointer border-0 bg-transparent p-0"
        />
        Color
      </label>
      <button
        type="button"
        onClick={() => wrapSelection(id, value, onChange, `{{${color}}}`, "{{/}}")}
        className="inline-flex h-8 cursor-pointer items-center rounded-[6px] border border-[#373A41] px-3 font-inter text-[14px] text-brand-white hover:border-brand"
      >
        Apply color
      </button>
    </div>
  );
}

function Label({
  label,
  required,
  htmlFor,
}: {
  label: string;
  required?: boolean;
  htmlFor: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="inline-flex items-start gap-1 font-tanker text-[20px] leading-[1.2] font-normal tracking-normal text-brand-white uppercase"
    >
      {label}
      {required ? (
        <span className="font-inter text-[14px] leading-none font-medium tracking-normal text-[#94979C] normal-case">
          *
        </span>
      ) : null}
    </label>
  );
}

export function TextField({
  label,
  value,
  onChange,
  help,
  required,
  max,
  format = false,
  onFocus,
  onBlur,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  help?: string;
  required?: boolean;
  max?: number;
  format?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
}) {
  const id = useId();
  const helpId = `${id}-help`;

  return (
    <div className="flex flex-col gap-2">
      <Label label={label} required={required} htmlFor={id} />
      {format ? <FormatBar id={id} value={value} onChange={onChange} /> : null}
      <input
        id={id}
        type="text"
        value={value}
        maxLength={max}
        required={required}
        aria-describedby={help ? helpId : undefined}
        onChange={(event) => onChange(event.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        className={`${inputClass} h-10`}
      />
      {help ? (
        <p id={helpId} className="font-inter text-[14px] leading-[20px] font-normal text-[#94979C]">
          {help}
        </p>
      ) : null}
    </div>
  );
}

export function AreaField({
  label,
  value,
  onChange,
  help,
  required,
  rows = 4,
  format = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  help?: string;
  required?: boolean;
  rows?: number;
  format?: boolean;
}) {
  const id = useId();
  const helpId = `${id}-help`;

  return (
    <div className="flex flex-col gap-2">
      <Label label={label} required={required} htmlFor={id} />
      {format ? <FormatBar id={id} value={value} onChange={onChange} /> : null}
      <textarea
        id={id}
        value={value}
        rows={rows}
        required={required}
        aria-describedby={help ? helpId : undefined}
        onChange={(event) => onChange(event.target.value)}
        className={`${inputClass} min-h-24 resize-y`}
      />
      {help ? (
        <p id={helpId} className="font-inter text-[14px] leading-[20px] font-normal text-[#94979C]">
          {help}
        </p>
      ) : null}
    </div>
  );
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  required,
  help,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  required?: boolean;
  help?: string;
}) {
  const id = useId();
  const helpId = `${id}-help`;

  return (
    <div className="flex flex-col gap-2">
      <Label label={label} required={required} htmlFor={id} />
      {help ? (
        <p id={helpId} className="font-inter text-[14px] leading-[20px] font-normal text-[#94979C]">
          {help}
        </p>
      ) : null}
      <select
        id={id}
        value={value}
        required={required}
        aria-describedby={help ? helpId : undefined}
        onChange={(event) => onChange(event.target.value)}
        className={`${inputClass} h-10`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-[#131313]">
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function IconButton({
  label,
  onClick,
  disabled,
  danger,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-[6px] border border-[#373A41] p-0 text-brand-white disabled:cursor-not-allowed disabled:opacity-30 ${
        danger ? "hover:border-[#E2705F] hover:text-[#E2705F]" : "hover:border-brand hover:text-brand"
      }`}
    >
      {children}
    </button>
  );
}

export function ItemTools({
  title,
  index,
  total,
  onMove,
  onRemove,
  extra,
}: {
  title: string;
  index: number;
  total: number;
  onMove: (direction: -1 | 1) => void;
  onRemove: () => void;
  extra?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="font-tanker text-[18px] leading-[1.2] font-normal tracking-normal text-[#E8B23D] uppercase">
        {title}
      </p>
      <div className={`flex items-center gap-2 ${extra ? "w-full md:w-auto" : ""}`}>
        {extra ? <div className="min-w-0 flex-1 md:flex-none">{extra}</div> : null}
        <div className="flex shrink-0 items-center gap-2">
          <IconButton label="Move up" disabled={index === 0} onClick={() => onMove(-1)}>
            <ChevronUp className="size-4 shrink-0" aria-hidden />
          </IconButton>
          <IconButton
            label="Move down"
            disabled={index === total - 1}
            onClick={() => onMove(1)}
          >
            <ChevronDown className="size-4 shrink-0" aria-hidden />
          </IconButton>
          <IconButton label="Remove" danger onClick={onRemove}>
            <X className="size-4 shrink-0" aria-hidden />
          </IconButton>
        </div>
      </div>
    </div>
  );
}

export function AddButton({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-10 w-full cursor-pointer items-center justify-center rounded-[8px] bg-brand px-4 text-center font-tanker text-[18px] leading-[1.2] font-normal tracking-normal text-white uppercase transition-colors duration-200 hover:bg-brand/70 md:w-fit"
    >
      {children}
    </button>
  );
}

export function GhostButton({
  children,
  onClick,
  danger,
}: {
  children: ReactNode;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-9 w-full cursor-pointer items-center justify-center rounded-[8px] border px-3 text-center font-tanker text-[16px] leading-[1.2] font-normal tracking-normal uppercase md:w-fit ${
        danger
          ? "border-[#E2705F]/60 text-[#E2705F] hover:bg-[#E2705F]/10"
          : "border-[#373A41] text-brand-white hover:border-brand hover:text-brand"
      }`}
    >
      {children}
    </button>
  );
}

export function ImageField({
  label,
  help,
  value,
  onChange,
}: {
  label: string;
  help?: string;
  value: AdminImage | null;
  onChange: (value: AdminImage | null) => void;
}) {
  const id = useId();
  const [over, setOver] = useState(false);
  const [busy, setBusy] = useState(false);

  const take = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    try {
      onChange(await uploadMediaFile(file, "image"));
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "That image could not be read.");
    } finally {
      setBusy(false);
      setOver(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="font-tanker text-[20px] leading-[1.2] font-normal tracking-normal text-brand-white uppercase"
      >
        {label}
      </label>
      {help ? (
        <p className="font-inter text-[14px] leading-[20px] font-normal text-[#94979C]">{help}</p>
      ) : null}
      {value ? (
        <div className="flex flex-wrap items-center gap-3">
          <img
            src={value.src}
            alt=""
            className="h-16 w-[84px] rounded-[6px] object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate font-inter text-[14px] leading-[20px] font-medium text-brand-white">
              {value.name}
            </p>
            <p className="font-inter text-[12px] leading-[16px] text-[#94979C]">
              {value.w ? `${value.w} x ${value.h} px` : "SVG"}
            </p>
          </div>
          <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row">
            <label className="flex h-9 w-full cursor-pointer items-center justify-center rounded-[8px] border border-[#373A41] px-3 text-center font-tanker text-[16px] leading-[1.2] tracking-normal text-brand-white uppercase hover:border-brand hover:text-brand md:w-fit">
              Replace
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(event) => {
                  void take(event.target.files?.[0]);
                  event.target.value = "";
                }}
              />
            </label>
            <GhostButton danger onClick={() => onChange(null)}>
              Remove
            </GhostButton>
          </div>
        </div>
      ) : (
        <label
          htmlFor={id}
          onDragOver={(event) => {
            event.preventDefault();
            setOver(true);
          }}
          onDragLeave={() => setOver(false)}
          onDrop={(event) => {
            event.preventDefault();
            void take(event.dataTransfer.files?.[0]);
          }}
          className={`flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-[8px] border border-dashed px-4 py-8 text-center ${
            over ? "border-brand" : "border-[#373A41]"
          } ${busy ? "pointer-events-none opacity-60" : ""}`}
        >
          <span className="font-inter text-[14px] leading-[20px] font-medium text-brand-white">
            {busy ? "Working on it..." : "Click to choose an image"}
          </span>
          <span className="font-inter text-[12px] leading-[16px] text-[#94979C]">
            or drag one here. JPG, PNG or SVG. 9 MB maximum.
          </span>
        </label>
      )}
      <input
        id={id}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(event) => {
          void take(event.target.files?.[0]);
          event.target.value = "";
        }}
      />
    </div>
  );
}

export function VideoField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const id = useId();
  const [busy, setBusy] = useState(false);

  const take = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    try {
      const video = await uploadMediaFile(file, "video");
      onChange(video.src);
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "That video could not be uploaded.");
    } finally {
      setBusy(false);
    }
  };

  const fileVideo = Boolean(value) && !isVideoLink(value);

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="font-tanker text-[20px] leading-[1.2] font-normal tracking-normal text-brand-white uppercase"
      >
        {label}
      </label>
      <p className="font-inter text-[14px] leading-[20px] font-normal text-[#94979C]">
        MP4, WEBM, or MOV. 99 MB maximum.
      </p>
      {fileVideo ? (
        <video src={value} controls playsInline className="max-h-[240px] w-full rounded-[8px] bg-black" />
      ) : null}
      <div className="flex flex-col gap-2 md:flex-row">
        <label className="flex h-10 w-full cursor-pointer items-center justify-center rounded-[8px] bg-brand px-4 text-center font-tanker text-[18px] leading-[1.2] font-normal tracking-normal text-white uppercase transition-colors duration-200 hover:bg-brand/70 md:w-fit">
          {busy ? "Working on it..." : value ? "Replace video" : "Upload video"}
          <input
            id={id}
            type="file"
            accept="video/mp4,video/webm,video/quicktime"
            className="sr-only"
            disabled={busy}
            onChange={(event) => {
              void take(event.target.files?.[0]);
              event.target.value = "";
            }}
          />
        </label>
        {value ? (
          <GhostButton danger onClick={() => onChange("")}>
            Remove
          </GhostButton>
        ) : null}
      </div>
    </div>
  );
}

export function CategoryChecks({
  options,
  selected,
  onChange,
  onAdd,
}: {
  options: string[];
  selected: string[];
  onChange: (values: string[]) => void;
  onAdd: (name: string) => void;
}) {
  const [name, setName] = useState("");
  const checked = (value: string) =>
    selected.some((item) => item.toLowerCase() === value.toLowerCase());

  const toggle = (value: string) => {
    onChange(
      checked(value)
        ? selected.filter((item) => item.toLowerCase() !== value.toLowerCase())
        : [...selected, value],
    );
  };

  const add = () => {
    const next = name.trim();
    if (!next) return;
    onAdd(next);
    setName("");
  };

  return (
    <div className="flex flex-col gap-3">
      <p className="font-tanker text-[20px] leading-[1.2] font-normal tracking-normal text-brand-white uppercase">
        Categories
      </p>
      <p className="font-inter text-[14px] leading-[20px] font-normal text-[#94979C]">
        Tick every category that applies. These are the same filters used on Selected work and What I do. Add one here and it shows everywhere after you save.
      </p>
      {options.length === 0 ? (
        <p className="font-inter text-[14px] leading-[20px] text-[#94979C]">
          No categories yet. Add one below.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {options.map((option) => {
            const on = checked(option);
            return (
              <li key={option}>
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={on}
                    onChange={() => toggle(option)}
                    className="sr-only"
                  />
                  <span
                    className={`grid size-6 shrink-0 place-items-center rounded-[6px] border ${
                      on ? "border-brand bg-brand" : "border-[#D5D7DA] bg-[#E9EAEB]"
                    }`}
                  >
                    {on ? <Check className="size-4 text-white" strokeWidth={3} aria-hidden /> : null}
                  </span>
                  <span className="font-tanker text-[20px] leading-[1.2] font-normal tracking-normal text-brand-white uppercase">
                    {option}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      )}
      <div className="flex flex-col gap-2 md:flex-row">
        <input
          type="text"
          value={name}
          placeholder="New category"
          onChange={(event) => setName(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              add();
            }
          }}
          className={`${inputClass} h-10 md:max-w-[360px]`}
        />
        <AddButton onClick={add}>Add category</AddButton>
      </div>
    </div>
  );
}

export function StringList({
  path,
  addLabel,
  placeholder,
}: {
  path: string;
  addLabel: string;
  placeholder?: string;
}) {
  const list = useList<string>(path);

  return (
    <div className="flex flex-col gap-3">
      {list.items.map((item, index) => (
        <div key={`${path}-${index}`} className="flex items-center gap-2">
          <input
            type="text"
            value={item}
            placeholder={placeholder}
            onChange={(event) => list.set(index, event.target.value)}
            className={`${inputClass} h-10 min-w-0 flex-1`}
          />
          <IconButton label="Move up" disabled={index === 0} onClick={() => list.move(index, -1)}>
            <ChevronUp className="size-4" aria-hidden />
          </IconButton>
          <IconButton
            label="Move down"
            disabled={index === list.items.length - 1}
            onClick={() => list.move(index, 1)}
          >
            <ChevronDown className="size-4" aria-hidden />
          </IconButton>
          <IconButton label="Remove" danger onClick={() => list.remove(index)}>
            <X className="size-4" aria-hidden />
          </IconButton>
        </div>
      ))}
      <AddButton onClick={() => list.add("")}>{addLabel}</AddButton>
    </div>
  );
}
