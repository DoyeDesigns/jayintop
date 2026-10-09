import { Fragment, type ReactNode } from "react";

function highlightPlain(text: string, highlight: string | undefined, key: { n: number }) {
  if (!highlight) return text;
  const index = text.toLowerCase().indexOf(highlight.toLowerCase());
  if (index < 0) return text;
  const id = key.n++;
  return (
    <Fragment key={id}>
      {text.slice(0, index)}
      <span className="text-[#F9A000]">{text.slice(index, index + highlight.length)}</span>
      {text.slice(index + highlight.length)}
    </Fragment>
  );
}

export function richNodes(text: string, highlight?: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const key = { n: 0 };
  let i = 0;

  while (i < text.length) {
    if (text.startsWith("**", i)) {
      const end = text.indexOf("**", i + 2);
      if (end !== -1) {
        nodes.push(
          <strong key={key.n++} className="font-bold">
            {richNodes(text.slice(i + 2, end), highlight)}
          </strong>,
        );
        i = end + 2;
        continue;
      }
    }

    if (text.startsWith("{{#", i)) {
      const hexEnd = text.indexOf("}}", i + 3);
      const hex = hexEnd === -1 ? "" : text.slice(i + 2, hexEnd);
      if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
        const end = text.indexOf("{{/}}", hexEnd + 2);
        if (end !== -1) {
          nodes.push(
            <span key={key.n++} style={{ color: hex }}>
              {richNodes(text.slice(hexEnd + 2, end), highlight)}
            </span>,
          );
          i = end + 5;
          continue;
        }
      }
    }

    if (text.startsWith("_", i)) {
      const end = text.indexOf("_", i + 1);
      if (end !== -1) {
        nodes.push(
          <em key={key.n++} className="italic">
            {richNodes(text.slice(i + 1, end), highlight)}
          </em>,
        );
        i = end + 1;
        continue;
      }
    }

    let next = text.length;
    for (const marker of ["**", "_", "{{#"]) {
      const from = text.startsWith(marker, i) ? i + marker.length : i;
      const at = text.indexOf(marker, from);
      if (at !== -1 && at < next) next = at;
    }
    nodes.push(highlightPlain(text.slice(i, next), highlight, key));
    if (next <= i) break;
    i = next;
  }

  return nodes;
}

export function plainRich(text: string) {
  return text
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/_(.+?)_/g, "$1")
    .replace(/\{\{#[0-9A-Fa-f]{6}\}\}(.+?)\{\{\/\}\}/g, "$1");
}

export function RichText({
  text,
  highlight,
}: {
  text: string;
  highlight?: string;
}) {
  return <>{richNodes(text, highlight)}</>;
}

export function RichParagraphs({
  text,
  className,
}: {
  text: string;
  className: string;
}) {
  const parts = text
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean);

  return (
    <div className={className}>
      {(parts.length ? parts : [text]).map((part) => (
        <p key={part}>{richNodes(part)}</p>
      ))}
    </div>
  );
}
