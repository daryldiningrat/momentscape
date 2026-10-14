"use client";

export interface ListField {
  key: string;
  label: string;
  type?: "text" | "textarea" | "url";
  placeholder?: string;
  span?: number;
}

export default function RepeatableListEditor({
  items,
  onChange,
  fields,
  addLabel = "Add item",
  emptyLabel = "No items yet.",
}: {
  items: Record<string, string>[];
  onChange: (items: Record<string, string>[]) => void;
  fields: ListField[];
  addLabel?: string;
  emptyLabel?: string;
}) {
  function updateItem(index: number, key: string, value: string) {
    const next = items.map((item, i) => (i === index ? { ...item, [key]: value } : item));
    onChange(next);
  }

  function removeItem(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  function addItem() {
    const empty: Record<string, string> = {};
    for (const field of fields) empty[field.key] = "";
    onChange([...items, empty]);
  }

  function moveItem(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    const tmp = next[index];
    next[index] = next[target];
    next[target] = tmp;
    onChange(next);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      {items.length === 0 && <p style={{ fontSize: "0.75rem", color: "#888" }}>{emptyLabel}</p>}

      {items.map((item, index) => (
        <div key={index} style={{ border: "1px solid #333", borderRadius: 8, padding: "0.75rem", backgroundColor: "#161616" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
            {fields.map((field) => {
              const style: React.CSSProperties = {
                padding: "0.5rem",
                fontSize: "0.875rem",
                border: "1px solid #333",
                borderRadius: 6,
                backgroundColor: "#1a1a1a",
                color: "#fafafa",
                ...(field.span ? { gridColumn: `span ${field.span}` } : {}),
              };
              return (
                <label key={field.key} style={{ ...labelStyle, ...(field.span ? { gridColumn: `span ${field.span}` } : {}) }}>
                  {field.label}
                  {field.type === "textarea" ? (
                    <textarea
                      rows={2}
                      value={item[field.key] || ""}
                      placeholder={field.placeholder}
                      onChange={(e) => updateItem(index, field.key, e.target.value)}
                      style={{ ...style, resize: "vertical" }}
                    />
                  ) : (
                    <input
                      type={field.type === "url" ? "url" : "text"}
                      value={item[field.key] || ""}
                      placeholder={field.placeholder}
                      onChange={(e) => updateItem(index, field.key, e.target.value)}
                      style={style}
                    />
                  )}
                </label>
              );
            })}
          </div>
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem", justifyContent: "flex-end" }}>
            <button type="button" onClick={() => moveItem(index, -1)} disabled={index === 0} style={miniBtn}>↑</button>
            <button type="button" onClick={() => moveItem(index, 1)} disabled={index === items.length - 1} style={miniBtn}>↓</button>
            <button type="button" onClick={() => removeItem(index)} style={{ ...miniBtn, backgroundColor: "#dc2626" }}>×</button>
          </div>
        </div>
      ))}

      <button type="button" onClick={addItem} style={addBtn}>
        + {addLabel}
      </button>
    </div>
  );
}

const labelStyle: React.CSSProperties = { display: "flex", flexDirection: "column", gap: "0.25rem", fontSize: "0.75rem", color: "#ccc" };
const miniBtn: React.CSSProperties = { padding: "0.25rem 0.5rem", fontSize: "0.75rem", backgroundColor: "#444", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" };
const addBtn: React.CSSProperties = { padding: "0.5rem", fontSize: "0.875rem", backgroundColor: "#2563eb", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" };
