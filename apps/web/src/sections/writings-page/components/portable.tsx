import Link from "next/link";
import type { PortableTextComponents } from "next-sanity";

import { cn } from "@/lib/utils";

import { CodeBlock } from "./code-block";

const sharedMarks: PortableTextComponents["marks"] = {
  link: ({ children, value }) => (
    <Link
      href={value?.href}
      target="_blank"
      rel="noopener noreferrer"
      className="custom-underline-round-dots hover:text-orange-500"
    >
      {children}
    </Link>
  ),
  code: ({ children }) => <code>{children}</code>,
};

export const cardComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="text-sm-expand leading-[1.15] tracking-wide text-neutral-600">
        {children}
      </p>
    ),
    h1: ({ children }) => <p className="text-xl-expand">{children}</p>,
  },
  marks: sharedMarks,
};

export const headerComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="text-neutral-600">{children}</p>,
  },
  marks: sharedMarks,
};

export const textComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="text-base-expand">{children}</p>,
    h1: ({ children }) => (
      <h1 className="text-4xl-expand lg:text-5xl-expand mt-2 leading-[120%] text-balance text-pretty">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-2xl-expand mt-6 font-semibold text-balance">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl-expand mt-6 mb-2 font-semibold">{children}</h3>
    ),
    blockquote: ({ children }) => (
      <div className="text-base-expand border-l-2 border-orange-500 pl-4 leading-[200%]">
        {children}
      </div>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="ml-4 list-disc">{children}</ul>,
    number: ({ children }) => <ol className="ml-4 list-decimal">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li className="">{children}</li>,
    number: ({ children }) => <li className="">{children}</li>,
  },
  marks: sharedMarks,
  types: {
    image: ({ value }) => {
      console.log(value);
      return <figure className="bg-primary-500 relative w-full"></figure>;
    },
    code: ({ value }) => {
      if (!value.code) return null;
      return (
        <CodeBlock
          label={value.filename ?? "Code snippet"}
          language={value.language ?? "tsx"}
        >
          {value.code}
        </CodeBlock>
      );
    },
    table: ({ value }) => {
      const rows = value.rows ?? [];
      if (rows.length === 0) return null;
      const [headerRow, ...bodyRows] = rows;
      return (
        <div className="overflow-x-auto">
          <table className="text-base-expand w-full border-collapse text-left text-sm">
            {headerRow?.cells && (
              <thead>
                <tr className="border-b border-neutral-200">
                  {headerRow.cells.map((cell: string, index: number) => (
                    <th
                      key={index}
                      scope="col"
                      className="px-4 py-3 font-semibold"
                    >
                      {cell}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {bodyRows.map((row: { _key: string; cells?: string[] }) => (
                <tr key={row._key} className="border-b border-neutral-100">
                  {row.cells?.map((cell: string, index: number) => (
                    <td
                      key={index}
                      className={cn("px-4 py-3", {
                        "font-medium": index === 0,
                      })}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    },
  },
};
